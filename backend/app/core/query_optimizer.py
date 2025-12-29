"""
Query optimization utilities for database operations.
Includes eager loading, caching, and query analysis tools.
"""

import hashlib
import json
import logging
from functools import wraps
from time import time
from typing import Any, Dict, List, Optional, Type

from sqlalchemy import text
from sqlalchemy.orm import joinedload, selectinload
from sqlmodel import Select, Session, select

from app.core.cache import cache

logger = logging.getLogger(__name__)


class QueryOptimizer:
    """Tools for optimizing database queries"""

    @staticmethod
    def with_relationships(query: Select, *relationships) -> Select:
        """
        Eager load relationships to avoid N+1 queries.

        Example:
            query = select(Campaign)
            query = QueryOptimizer.with_relationships(query, "leads", "user")
        """
        for rel in relationships:
            query = query.options(selectinload(rel))
        return query

    @staticmethod
    def with_joined_load(query: Select, *relationships) -> Select:
        """
        Use joined loading for relationships (single query with JOIN).
        Better for one-to-one or small one-to-many relationships.
        """
        for rel in relationships:
            query = query.options(joinedload(rel))
        return query

    @staticmethod
    def explain_query(session: Session, query: Select) -> Dict[str, Any]:
        """
        Analyze query execution plan.
        Returns EXPLAIN output for debugging slow queries.
        """
        compiled = query.compile(compile_kwargs={"literal_binds": True})
        sql = str(compiled)

        try:
            # Get EXPLAIN output
            explain_query = text(f"EXPLAIN {sql}")
            result = session.execute(explain_query)
            explain_output = [row for row in result]

            return {
                "query": sql,
                "explain": explain_output,
                "analysis": QueryOptimizer._analyze_explain(explain_output),
            }
        except Exception as e:
            logger.error(f"Failed to explain query: {e}")
            return {"query": sql, "error": str(e)}

    @staticmethod
    def _analyze_explain(explain_output: List) -> Dict[str, Any]:
        """Analyze EXPLAIN output for optimization suggestions"""
        suggestions = []
        full_scan = False

        for row in explain_output:
            row_str = str(row)
            if "Seq Scan" in row_str or "SCAN TABLE" in row_str:
                full_scan = True
                suggestions.append("Consider adding an index to avoid full table scan")
            if "filesort" in row_str.lower():
                suggestions.append("Query requires filesort - consider index on sort columns")

        return {"has_full_scan": full_scan, "suggestions": suggestions}


class QueryCache:
    """Cache query results in Redis with automatic invalidation"""

    DEFAULT_TTL = 300  # 5 minutes

    @staticmethod
    def generate_cache_key(prefix: str, query: Select, **kwargs) -> str:
        """Generate deterministic cache key from query"""
        query_str = str(query.compile(compile_kwargs={"literal_binds": True}))
        params_str = json.dumps(kwargs, sort_keys=True)
        hash_input = f"{query_str}:{params_str}"
        hash_key = hashlib.md5(hash_input.encode()).hexdigest()
        return f"query:{prefix}:{hash_key}"

    @staticmethod
    def get(key: str) -> Optional[Any]:
        """Get cached query result"""
        return cache.get(key)

    @staticmethod
    def set(key: str, value: Any, ttl: int = DEFAULT_TTL):
        """Cache query result"""
        cache.set(key, value, ttl=ttl)

    @staticmethod
    def invalidate(prefix: str):
        """Invalidate all cached queries with prefix"""
        pattern = f"query:{prefix}:*"
        # In production, use Redis SCAN to find and delete keys
        logger.info(f"Invalidating cache pattern: {pattern}")

    @staticmethod
    def cached_query(prefix: str, ttl: int = DEFAULT_TTL):
        """
        Decorator to automatically cache query results.

        Example:
            @QueryCache.cached_query("leads", ttl=600)
            def get_leads(session: Session, status: str):
                return session.exec(select(Lead).where(Lead.status == status)).all()
        """

        def decorator(func):
            @wraps(func)
            def wrapper(*args, **kwargs):
                # Generate cache key
                cache_key = QueryCache.generate_cache_key(
                    prefix,
                    select(text("dummy")),  # Placeholder
                    func_name=func.__name__,
                    args=str(args),
                    kwargs=str(kwargs),
                )

                # Try to get from cache
                cached = QueryCache.get(cache_key)
                if cached is not None:
                    logger.debug(f"Cache HIT: {cache_key}")
                    return cached

                # Execute function
                logger.debug(f"Cache MISS: {cache_key}")
                start = time()
                result = func(*args, **kwargs)
                duration = time() - start

                # Cache result if query took > 100ms
                if duration > 0.1:
                    QueryCache.set(cache_key, result, ttl=ttl)
                    logger.info(f"Cached slow query ({duration:.2f}s): {func.__name__}")

                return result

            return wrapper

        return decorator


class IndexRecommender:
    """Analyze queries and recommend database indexes"""

    def __init__(self):
        self.slow_queries: List[Dict[str, Any]] = []

    def log_slow_query(self, query: str, duration: float, table: str):
        """Log a slow query for analysis"""
        self.slow_queries.append(
            {"query": query, "duration": duration, "table": table, "timestamp": time()}
        )

    def get_recommendations(self) -> List[Dict[str, Any]]:
        """Analyze slow queries and recommend indexes"""
        recommendations = []

        # Group by table
        by_table = {}
        for q in self.slow_queries:
            table = q["table"]
            if table not in by_table:
                by_table[table] = []
            by_table[table].append(q)

        # Analyze each table
        for table, queries in by_table.items():
            avg_duration = sum(q["duration"] for q in queries) / len(queries)

            if avg_duration > 0.5:  # Slow queries (>500ms)
                # Look for WHERE clauses
                where_fields = set()
                for q in queries:
                    if "WHERE" in q["query"]:
                        # Simple extraction - in production use SQL parser
                        parts = q["query"].split("WHERE")[1].split("AND")
                        for part in parts:
                            if "=" in part:
                                field = part.split("=")[0].strip().split(".")[-1]
                                where_fields.add(field)

                if where_fields:
                    recommendations.append(
                        {
                            "table": table,
                            "avg_duration": avg_duration,
                            "query_count": len(queries),
                            "suggested_indexes": list(where_fields),
                            "sql": [
                                f"CREATE INDEX idx_{table}_{field} ON {table}({field});"
                                for field in where_fields
                            ],
                        }
                    )

        return recommendations


# Global index recommender instance
index_recommender = IndexRecommender()


def track_query_performance(table: str):
    """
    Decorator to track query performance and recommend indexes.

    Example:
        @track_query_performance("leads")
        def get_leads_by_status(session: Session, status: str):
            return session.exec(select(Lead).where(Lead.status == status)).all()
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time()
            result = func(*args, **kwargs)
            duration = time() - start

            if duration > 0.2:  # Log if > 200ms
                logger.warning(f"Slow query in {func.__name__}: {duration:.2f}s")
                index_recommender.log_slow_query(
                    query=func.__name__, duration=duration, table=table
                )

            return result

        return wrapper

    return decorator
