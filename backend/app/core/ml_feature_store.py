"""
ML Feature Store - Feature Engineering, Versioning, and Serving Layer.
Centralized feature management for consistent ML model training and serving.
"""

import hashlib
import json
import logging
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Callable, Dict, List, Optional

import numpy as np
import pandas as pd

from app.core.cache import cache

logger = logging.getLogger(__name__)


class FeatureType(str, Enum):
    """Feature data types"""

    NUMERICAL = "numerical"
    CATEGORICAL = "categorical"
    TEXT = "text"
    TIMESTAMP = "timestamp"
    BOOLEAN = "boolean"
    ARRAY = "array"


@dataclass
class FeatureMetadata:
    """Metadata for feature definition"""

    name: str
    feature_type: FeatureType
    description: str
    version: int
    created_at: datetime
    updated_at: datetime
    owner: str
    tags: List[str] = field(default_factory=list)
    dependencies: List[str] = field(default_factory=list)  # Other features this depends on
    transformation_code: Optional[str] = None
    validation_rules: Dict[str, Any] = field(default_factory=dict)


@dataclass
class FeatureValue:
    """Single feature value with metadata"""

    feature_name: str
    entity_id: str  # Lead ID, Campaign ID, etc.
    value: Any
    timestamp: datetime
    version: int


@dataclass
class FeatureGroup:
    """Group of related features"""

    name: str
    description: str
    features: List[str]  # Feature names
    entity_type: str  # "lead", "campaign", "user"


class FeatureRegistry:
    """
    Central registry of feature definitions.
    Tracks feature versions, metadata, and lineage.
    """

    def __init__(self):
        self.features: Dict[str, FeatureMetadata] = {}
        self.feature_groups: Dict[str, FeatureGroup] = {}

    def register_feature(
        self,
        name: str,
        feature_type: FeatureType,
        description: str,
        owner: str,
        transformation: Optional[Callable] = None,
        tags: Optional[List[str]] = None,
        dependencies: Optional[List[str]] = None,
        validation_rules: Optional[Dict[str, Any]] = None,
    ) -> FeatureMetadata:
        """Register new feature or version"""

        # Check if feature exists
        if name in self.features:
            # Increment version
            existing = self.features[name]
            version = existing.version + 1
        else:
            version = 1

        metadata = FeatureMetadata(
            name=name,
            feature_type=feature_type,
            description=description,
            version=version,
            created_at=datetime.now(),
            updated_at=datetime.now(),
            owner=owner,
            tags=tags or [],
            dependencies=dependencies or [],
            transformation_code=transformation.__name__ if transformation else None,
            validation_rules=validation_rules or {},
        )

        self.features[name] = metadata

        logger.info(f"Registered feature '{name}' v{version}")
        return metadata

    def register_feature_group(
        self, name: str, description: str, features: List[str], entity_type: str
    ) -> FeatureGroup:
        """Group related features"""

        # Validate all features exist
        for feature_name in features:
            if feature_name not in self.features:
                raise ValueError(f"Feature '{feature_name}' not registered")

        group = FeatureGroup(
            name=name,
            description=description,
            features=features,
            entity_type=entity_type,
        )

        self.feature_groups[name] = group

        logger.info(f"Registered feature group '{name}' with {len(features)} features")
        return group

    def get_feature(self, name: str) -> Optional[FeatureMetadata]:
        """Get feature metadata"""
        return self.features.get(name)

    def search_features(
        self, tags: Optional[List[str]] = None, entity_type: Optional[str] = None
    ) -> List[FeatureMetadata]:
        """Search features by tags or entity type"""
        results = []

        for feature in self.features.values():
            # Filter by tags
            if tags and not any(tag in feature.tags for tag in tags):
                continue

            results.append(feature)

        return results

    def get_feature_lineage(self, name: str) -> Dict[str, Any]:
        """Get feature dependencies (lineage)"""
        feature = self.features.get(name)
        if not feature:
            return {}

        lineage = {
            "feature": name,
            "direct_dependencies": feature.dependencies,
            "all_dependencies": self._get_all_dependencies(name),
        }

        return lineage

    def _get_all_dependencies(self, name: str, visited: Optional[set] = None) -> List[str]:
        """Recursively get all dependencies"""
        if visited is None:
            visited = set()

        if name in visited:
            return []

        visited.add(name)

        feature = self.features.get(name)
        if not feature:
            return []

        all_deps = list(feature.dependencies)

        for dep in feature.dependencies:
            all_deps.extend(self._get_all_dependencies(dep, visited))

        return list(set(all_deps))


class FeatureStore:
    """
    Feature store with online and offline serving.
    Online: Low-latency for real-time predictions
    Offline: Batch processing for training
    """

    def __init__(self, registry: FeatureRegistry):
        self.registry = registry
        self.online_cache = cache  # Redis for online serving
        self.offline_storage: Dict[str, List[FeatureValue]] = {}  # Mock offline storage

    def compute_and_store(
        self,
        feature_name: str,
        entity_id: str,
        raw_data: Dict[str, Any],
        transformation: Callable,
    ) -> FeatureValue:
        """
        Compute feature value and store in both online and offline stores.
        """
        metadata = self.registry.get_feature(feature_name)
        if not metadata:
            raise ValueError(f"Feature '{feature_name}' not registered")

        # Apply transformation
        try:
            value = transformation(raw_data)
        except Exception as e:
            logger.error(f"Feature computation failed for '{feature_name}': {e}")
            raise

        # Validate
        self._validate_feature_value(feature_name, value, metadata)

        # Create feature value
        feature_value = FeatureValue(
            feature_name=feature_name,
            entity_id=entity_id,
            value=value,
            timestamp=datetime.now(),
            version=metadata.version,
        )

        # Store online (Redis with 24h TTL)
        online_key = self._online_key(feature_name, entity_id)
        self.online_cache.set(online_key, value, ttl=86400)

        # Store offline (append to history)
        offline_key = f"{feature_name}:{entity_id}"
        if offline_key not in self.offline_storage:
            self.offline_storage[offline_key] = []
        self.offline_storage[offline_key].append(feature_value)

        logger.debug(f"Stored feature '{feature_name}' for entity {entity_id}")
        return feature_value

    def get_online_features(self, feature_names: List[str], entity_id: str) -> Dict[str, Any]:
        """
        Get features for real-time serving (low latency).
        Returns latest values from online cache.
        """
        features = {}

        for feature_name in feature_names:
            online_key = self._online_key(feature_name, entity_id)
            value = self.online_cache.get(online_key)

            if value is None:
                logger.warning(f"Feature '{feature_name}' not in online cache for {entity_id}")
                # Could trigger on-demand computation here
                value = None

            features[feature_name] = value

        return features

    def get_offline_features(
        self,
        feature_names: List[str],
        entity_ids: List[str],
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
    ) -> pd.DataFrame:
        """
        Get historical features for training (batch).
        Returns DataFrame with features for multiple entities.
        """
        data = []

        for entity_id in entity_ids:
            row = {"entity_id": entity_id}

            for feature_name in feature_names:
                offline_key = f"{feature_name}:{entity_id}"
                values = self.offline_storage.get(offline_key, [])

                # Filter by date range
                if start_date or end_date:
                    values = [
                        fv
                        for fv in values
                        if (not start_date or fv.timestamp >= start_date)
                        and (not end_date or fv.timestamp <= end_date)
                    ]

                # Get latest value
                if values:
                    latest = max(values, key=lambda fv: fv.timestamp)
                    row[feature_name] = latest.value
                else:
                    row[feature_name] = None

            data.append(row)

        return pd.DataFrame(data)

    def materialize_feature_group(
        self,
        group_name: str,
        entity_ids: List[str],
        transformations: Dict[str, Callable],
    ) -> pd.DataFrame:
        """
        Materialize all features in a group for batch processing.
        Useful for training dataset creation.
        """
        group = self.registry.feature_groups.get(group_name)
        if not group:
            raise ValueError(f"Feature group '{group_name}' not found")

        logger.info(f"Materializing feature group '{group_name}' for {len(entity_ids)} entities")

        # Get offline features
        df = self.get_offline_features(group.features, entity_ids)

        return df

    def _validate_feature_value(
        self, feature_name: str, value: Any, metadata: FeatureMetadata
    ) -> None:
        """Validate feature value against rules"""
        rules = metadata.validation_rules

        # Type validation
        if metadata.feature_type == FeatureType.NUMERICAL:
            if not isinstance(value, (int, float)):
                raise ValueError(f"Feature '{feature_name}' must be numerical")

            # Range check
            if "min" in rules and value < rules["min"]:
                raise ValueError(f"Feature '{feature_name}' below min: {value} < {rules['min']}")
            if "max" in rules and value > rules["max"]:
                raise ValueError(f"Feature '{feature_name}' above max: {value} > {rules['max']}")

        elif metadata.feature_type == FeatureType.CATEGORICAL:
            if "allowed_values" in rules and value not in rules["allowed_values"]:
                raise ValueError(f"Feature '{feature_name}' has invalid value: {value}")

    def _online_key(self, feature_name: str, entity_id: str) -> str:
        """Generate online cache key"""
        return f"feature:{feature_name}:{entity_id}"

    def get_feature_stats(self, feature_name: str) -> Dict[str, Any]:
        """Get statistics for a feature"""
        values = []

        # Collect all values for this feature
        for key, feature_values in self.offline_storage.items():
            if key.startswith(f"{feature_name}:"):
                values.extend(
                    [fv.value for fv in feature_values if isinstance(fv.value, (int, float))]
                )

        if not values:
            return {"error": "No data"}

        return {
            "count": len(values),
            "mean": np.mean(values),
            "std": np.std(values),
            "min": np.min(values),
            "max": np.max(values),
            "median": np.median(values),
            "p25": np.percentile(values, 25),
            "p75": np.percentile(values, 75),
        }


# Feature transformation functions (examples)


def compute_engagement_score(data: Dict[str, Any]) -> float:
    """
    Compute engagement score from raw lead data.

    Factors:
    - Email opens: +10 per open
    - Link clicks: +20 per click
    - Replies: +50 per reply
    - Recent activity bonus: +30 if active in last 7 days
    """
    score = 0.0

    score += data.get("email_opens", 0) * 10
    score += data.get("link_clicks", 0) * 20
    score += data.get("replies", 0) * 50

    last_activity = data.get("last_activity_date")
    if last_activity and (datetime.now() - last_activity).days <= 7:
        score += 30

    return min(score, 100.0)  # Cap at 100


def compute_lead_quality_score(data: Dict[str, Any]) -> float:
    """
    Lead quality based on company and role.

    Factors:
    - Company size: Large (1.0), Medium (0.7), Small (0.4)
    - Seniority: C-Level (1.0), VP (0.8), Manager (0.6), IC (0.3)
    - Industry match: 1.0 if target industry, 0.5 otherwise
    """
    company_size_map = {"large": 1.0, "medium": 0.7, "small": 0.4}
    seniority_map = {"c_level": 1.0, "vp": 0.8, "manager": 0.6, "ic": 0.3}

    company_score = company_size_map.get(data.get("company_size", "small"), 0.4)
    seniority_score = seniority_map.get(data.get("seniority", "ic"), 0.3)

    target_industries = ["technology", "saas", "software"]
    industry_score = 1.0 if data.get("industry") in target_industries else 0.5

    # Weighted average
    quality_score = (company_score * 0.4 + seniority_score * 0.4 + industry_score * 0.2) * 100

    return quality_score


def compute_time_since_last_contact(data: Dict[str, Any]) -> int:
    """Days since last contact"""
    last_contact = data.get("last_contact_date")
    if not last_contact:
        return 999  # Never contacted

    days = (datetime.now() - last_contact).days
    return days


def compute_email_domain_reputation(data: Dict[str, Any]) -> str:
    """Categorize email domain reputation"""
    email = data.get("email", "")
    domain = email.split("@")[-1] if "@" in email else ""

    # High-reputation domains
    enterprise_domains = ["gmail.com", "microsoft.com", "apple.com", "amazon.com"]
    generic_domains = ["gmail.com", "yahoo.com", "hotmail.com"]

    if domain in enterprise_domains and domain not in generic_domains:
        return "enterprise"
    elif domain in generic_domains:
        return "generic"
    elif domain:
        return "corporate"
    else:
        return "unknown"


# Initialize global instances

feature_registry = FeatureRegistry()
feature_store = FeatureStore(feature_registry)


# Register common features

feature_registry.register_feature(
    name="engagement_score",
    feature_type=FeatureType.NUMERICAL,
    description="Lead engagement score (0-100) based on email interactions",
    owner="ml_team",
    transformation=compute_engagement_score,
    tags=["engagement", "lead", "ml"],
    validation_rules={"min": 0, "max": 100},
)

feature_registry.register_feature(
    name="lead_quality_score",
    feature_type=FeatureType.NUMERICAL,
    description="Lead quality score based on company size, seniority, industry",
    owner="ml_team",
    transformation=compute_lead_quality_score,
    tags=["quality", "lead", "ml"],
    validation_rules={"min": 0, "max": 100},
)

feature_registry.register_feature(
    name="days_since_last_contact",
    feature_type=FeatureType.NUMERICAL,
    description="Number of days since last contact",
    owner="ml_team",
    transformation=compute_time_since_last_contact,
    tags=["recency", "lead"],
    validation_rules={"min": 0},
)

feature_registry.register_feature(
    name="email_domain_reputation",
    feature_type=FeatureType.CATEGORICAL,
    description="Email domain reputation category",
    owner="ml_team",
    transformation=compute_email_domain_reputation,
    tags=["quality", "lead"],
    validation_rules={"allowed_values": ["enterprise", "corporate", "generic", "unknown"]},
)

# Register feature group for lead scoring model
feature_registry.register_feature_group(
    name="lead_scoring_features",
    description="Features for lead scoring ML model",
    features=[
        "engagement_score",
        "lead_quality_score",
        "days_since_last_contact",
        "email_domain_reputation",
    ],
    entity_type="lead",
)


# Example usage


async def prepare_training_data(lead_ids: List[int]) -> pd.DataFrame:
    """Prepare training dataset with all features"""

    # Convert int IDs to strings
    entity_ids = [str(lead_id) for lead_id in lead_ids]

    # Materialize feature group
    df = feature_store.materialize_feature_group(
        group_name="lead_scoring_features",
        entity_ids=entity_ids,
        transformations={
            "engagement_score": compute_engagement_score,
            "lead_quality_score": compute_lead_quality_score,
            "days_since_last_contact": compute_time_since_last_contact,
            "email_domain_reputation": compute_email_domain_reputation,
        },
    )

    logger.info(f"Prepared training data: {df.shape}")
    return df


async def get_real_time_features(lead_id: int) -> Dict[str, Any]:
    """Get features for real-time prediction"""

    features = feature_store.get_online_features(
        feature_names=[
            "engagement_score",
            "lead_quality_score",
            "days_since_last_contact",
        ],
        entity_id=str(lead_id),
    )

    return features
