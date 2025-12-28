"""
Usage Metering Middleware

Tracks AI usage for billing and monitoring:
- Token counting per request
- Cost calculation
- Latency tracking
- Tenant quotas
- Rate limiting
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, Any, Optional
from datetime import datetime
from sqlmodel import Session, select
from ..models.ai_enterprise import UsageMeteringRecord, TenantUsageQuota
from ..core.db import engine
import time
import logging
import json
import tiktoken

logger = logging.getLogger(__name__)


class UsageMeteringMiddleware(BaseHTTPMiddleware):
    """
    Middleware to track AI usage per request
    
    Records:
    - Tokens in/out
    - Model used
    - Latency
    - Cost
    - Success/failure
    """
    
    # Pricing per 1M tokens (as of Dec 2024)
    MODEL_PRICING = {
        "gpt-4": {"input": 30.0, "output": 60.0},
        "gpt-4-turbo": {"input": 10.0, "output": 30.0},
        "gpt-3.5-turbo": {"input": 0.5, "output": 1.5},
        "claude-3-opus": {"input": 15.0, "output": 75.0},
        "claude-3-sonnet": {"input": 3.0, "output": 15.0},
        "claude-3-haiku": {"input": 0.25, "output": 1.25},
    }
    
    def __init__(self, app):
        super().__init__(app)
        self.tokenizers = {}
    
    def get_tokenizer(self, model: str):
        """Get or create tokenizer for model"""
        if model not in self.tokenizers:
            try:
                # Try to get model-specific encoding
                self.tokenizers[model] = tiktoken.encoding_for_model(model)
            except:
                # Fall back to cl100k_base (GPT-4 encoding)
                self.tokenizers[model] = tiktoken.get_encoding("cl100k_base")
        return self.tokenizers[model]
    
    def count_tokens(self, text: str, model: str = "gpt-4") -> int:
        """Count tokens in text"""
        try:
            enc = self.get_tokenizer(model)
            return len(enc.encode(text))
        except:
            # Fallback estimation: ~4 chars per token
            return len(text) // 4
    
    def calculate_cost(
        self,
        tokens_in: int,
        tokens_out: int,
        model: str,
    ) -> float:
        """Calculate cost in USD"""
        pricing = self.MODEL_PRICING.get(model, {"input": 10.0, "output": 30.0})
        
        cost_in = (tokens_in / 1_000_000) * pricing["input"]
        cost_out = (tokens_out / 1_000_000) * pricing["output"]
        
        return cost_in + cost_out
    
    async def dispatch(self, request: Request, call_next):
        """Process request and track usage"""
        
        # Only track AI endpoints
        if not request.url.path.startswith("/api/ai"):
            return await call_next(request)
        
        start_time = time.time()
        
        # Extract tenant/user info from headers or auth
        tenant_id = request.headers.get("X-Tenant-ID", "default")
        user_id = request.headers.get("X-User-ID", "anonymous")
        
        # Check quota before processing
        with Session(engine) as db:
            quota_ok = await self.check_quota(tenant_id, db)
            if not quota_ok:
                from fastapi.responses import JSONResponse
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": "Usage quota exceeded",
                        "message": "Your usage quota has been exceeded. Please upgrade your plan.",
                    },
                )
        
        # Process request
        try:
            response = await call_next(request)
            success = response.status_code < 400
        except Exception as e:
            logger.error(f"Request failed: {e}")
            success = False
            raise
        finally:
            latency_ms = (time.time() - start_time) * 1000
            
            # Extract usage info from response
            # In real implementation, this would come from response body or context
            usage_info = {
                "tokens_in": 0,
                "tokens_out": 0,
                "model": "gpt-4",
                "provider": "openai",
            }
            
            # Record usage
            with Session(engine) as db:
                await self.record_usage(
                    tenant_id=tenant_id,
                    user_id=user_id,
                    endpoint=request.url.path,
                    request_id=request.headers.get("X-Request-ID", "unknown"),
                    usage_info=usage_info,
                    latency_ms=latency_ms,
                    success=success,
                    db=db,
                )
        
        return response
    
    async def check_quota(self, tenant_id: str, db: Session) -> bool:
        """Check if tenant has quota available"""
        statement = select(TenantUsageQuota).where(
            TenantUsageQuota.tenant_id == tenant_id
        )
        quota = db.exec(statement).first()
        
        if not quota:
            # No quota record = unlimited
            return True
        
        if not quota.hard_cap_enabled:
            # Hard cap not enabled
            return True
        
        # Check token limit
        if quota.monthly_token_limit:
            if quota.current_tokens_used >= quota.monthly_token_limit:
                return False
        
        # Check cost limit
        if quota.monthly_cost_limit_usd:
            if quota.current_cost_usd >= quota.monthly_cost_limit_usd:
                return False
        
        return True
    
    async def record_usage(
        self,
        tenant_id: str,
        user_id: str,
        endpoint: str,
        request_id: str,
        usage_info: Dict[str, Any],
        latency_ms: float,
        success: bool,
        db: Session,
    ):
        """Record usage to database"""
        
        tokens_in = usage_info.get("tokens_in", 0)
        tokens_out = usage_info.get("tokens_out", 0)
        model = usage_info.get("model", "gpt-4")
        provider = usage_info.get("provider", "openai")
        
        total_tokens = tokens_in + tokens_out
        cost_usd = self.calculate_cost(tokens_in, tokens_out, model)
        
        # Create metering record
        record = UsageMeteringRecord(
            tenant_id=tenant_id,
            user_id=user_id,
            endpoint=endpoint,
            request_id=request_id,
            model_provider=provider,
            model_name=model,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            total_tokens=total_tokens,
            latency_ms=latency_ms,
            success=success,
            cost_usd=cost_usd,
        )
        db.add(record)
        
        # Update tenant quota
        statement = select(TenantUsageQuota).where(
            TenantUsageQuota.tenant_id == tenant_id
        )
        quota = db.exec(statement).first()
        
        if quota:
            quota.current_tokens_used += total_tokens
            quota.current_cost_usd += cost_usd
            quota.updated_at = datetime.utcnow()
            
            # Check soft cap
            if quota.soft_cap_enabled:
                if quota.monthly_token_limit:
                    usage_pct = quota.current_tokens_used / quota.monthly_token_limit
                    if usage_pct >= quota.soft_cap_threshold:
                        logger.warning(
                            f"Tenant {tenant_id} approaching token limit: "
                            f"{usage_pct:.1%} of quota used"
                        )
                
                if quota.monthly_cost_limit_usd:
                    cost_pct = quota.current_cost_usd / quota.monthly_cost_limit_usd
                    if cost_pct >= quota.soft_cap_threshold:
                        logger.warning(
                            f"Tenant {tenant_id} approaching cost limit: "
                            f"{cost_pct:.1%} of budget used"
                        )
        
        db.commit()


class UsageAnalyticsService:
    """Service for analyzing usage data"""
    
    def __init__(self, db: Session):
        self.db = db
    
    async def get_tenant_usage(
        self,
        tenant_id: str,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> Dict[str, Any]:
        """Get usage summary for tenant"""
        from sqlalchemy import func, case
        
        query = (
            select(
                func.count(UsageMeteringRecord.id).label("total_requests"),
                func.sum(UsageMeteringRecord.total_tokens).label("total_tokens"),
                func.sum(UsageMeteringRecord.cost_usd).label("total_cost"),
                func.avg(UsageMeteringRecord.latency_ms).label("avg_latency"),
                func.sum(case((UsageMeteringRecord.success == True, 1), else_=0)).label("successful_requests"),
            )
            .where(UsageMeteringRecord.tenant_id == tenant_id)
        )
        
        if start_date:
            query = query.where(UsageMeteringRecord.timestamp >= start_date)
        if end_date:
            query = query.where(UsageMeteringRecord.timestamp <= end_date)
        
        result = self.db.exec(query).first()
        
        # Get quota info
        quota_statement = select(TenantUsageQuota).where(
            TenantUsageQuota.tenant_id == tenant_id
        )
        quota = self.db.exec(quota_statement).first()
        
        return {
            "tenant_id": tenant_id,
            "total_requests": result[0] or 0,
            "total_tokens": result[1] or 0,
            "total_cost_usd": float(result[2] or 0),
            "avg_latency_ms": float(result[3] or 0),
            "successful_requests": result[4] or 0,
            "success_rate": (result[4] / result[0] * 100) if result[0] else 0,
            "quota": {
                "monthly_token_limit": quota.monthly_token_limit if quota else None,
                "monthly_cost_limit_usd": quota.monthly_cost_limit_usd if quota else None,
                "current_tokens_used": quota.current_tokens_used if quota else 0,
                "current_cost_usd": quota.current_cost_usd if quota else 0,
            } if quota else None,
        }
    
    async def get_model_usage_breakdown(
        self,
        tenant_id: str,
    ) -> List[Dict[str, Any]]:
        """Get usage breakdown by model"""
        from sqlalchemy import func
        
        query = (
            select(
                UsageMeteringRecord.model_provider,
                UsageMeteringRecord.model_name,
                func.count(UsageMeteringRecord.id).label("requests"),
                func.sum(UsageMeteringRecord.total_tokens).label("tokens"),
                func.sum(UsageMeteringRecord.cost_usd).label("cost"),
            )
            .where(UsageMeteringRecord.tenant_id == tenant_id)
            .group_by(
                UsageMeteringRecord.model_provider,
                UsageMeteringRecord.model_name,
            )
        )
        
        results = self.db.exec(query).all()
        
        return [
            {
                "provider": row[0],
                "model": row[1],
                "requests": row[2],
                "tokens": row[3],
                "cost_usd": float(row[4]),
            }
            for row in results
        ]
