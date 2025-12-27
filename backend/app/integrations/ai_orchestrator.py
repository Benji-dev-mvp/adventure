"""
AI Orchestrator - Single Entry Point

Policy-based orchestration with explicit policies per use case
"""

from typing import Optional, Dict, Any, AsyncIterator
from pydantic import BaseModel
import logging
import time
import yaml
import os
from pathlib import Path

from .policies import AIPolicy, UseCaseType, DEFAULT_POLICIES
from .providers import ProviderFactory, AIProvider, ProviderResponse
from .budget_manager import BudgetManager
from ..core.cache import cache

logger = logging.getLogger(__name__)


class OrchestrationContext(BaseModel):
    """Context for AI orchestration requests"""
    user_id: str
    org_id: str
    session_id: Optional[str] = None
    account_id: Optional[str] = None
    request_id: Optional[str] = None
    metadata: Dict[str, Any] = {}


class OrchestrationResult(BaseModel):
    """Result from AI orchestration"""
    content: str
    provider_response: Dict[str, Any]
    policy_used: str
    cached: bool = False
    budget_remaining: Dict[str, Any] = {}
    latency_ms: float = 0.0


class AIOrchestrator:
    """
    Central AI orchestration with policy-based routing
    
    Features:
    - Policy-based use case routing
    - Config-driven model selection
    - Multi-provider support
    - Budget management
    - Caching and streaming
    - Memory and RAG integration
    - Observability
    """
    
    def __init__(self, config_path: Optional[str] = None):
        """
        Initialize orchestrator
        
        Args:
            config_path: Path to ai_config.yaml (optional, uses default if not provided)
        """
        # Load configuration
        self.config = self._load_config(config_path)
        
        # Load policies (defaults + any overrides)
        self.policies = dict(DEFAULT_POLICIES)
        
        # Apply config overrides to policies
        self._apply_config_to_policies()
        
        # Initialize budget manager
        self.budget_manager = BudgetManager(
            global_config=self.config.get("budget", {})
        )
        
        # Provider cache
        self._provider_cache: Dict[str, AIProvider] = {}
        
        logger.info("AIOrchestrator initialized with config-driven routing")
    
    def _load_config(self, config_path: Optional[str] = None) -> Dict[str, Any]:
        """Load configuration from YAML"""
        if config_path is None:
            config_path = Path(__file__).parent / "ai_config.yaml"
        
        try:
            with open(config_path, 'r') as f:
                config = yaml.safe_load(f)
            logger.info(f"Loaded AI config from {config_path}")
            return config
        except Exception as e:
            logger.warning(f"Failed to load AI config from {config_path}: {e}. Using defaults.")
            return {}
    
    def _apply_config_to_policies(self):
        """Apply config overrides to default policies"""
        use_case_configs = self.config.get("use_cases", {})
        
        for use_case_name, use_case_config in use_case_configs.items():
            try:
                use_case_type = UseCaseType(use_case_name)
                
                if use_case_type in self.policies:
                    policy = self.policies[use_case_type]
                    
                    # Override model settings from config
                    if "provider" in use_case_config:
                        policy.provider = use_case_config["provider"]
                    if "model" in use_case_config:
                        policy.model = use_case_config["model"]
                    if "temperature" in use_case_config:
                        policy.temperature = use_case_config["temperature"]
                    if "max_tokens" in use_case_config:
                        policy.max_tokens = use_case_config["max_tokens"]
                    if "streaming" in use_case_config:
                        policy.streaming_enabled = use_case_config["streaming"]
                    
                    logger.info(f"Applied config overrides to {use_case_type.value}: {policy.provider}/{policy.model}")
            except ValueError:
                logger.warning(f"Unknown use case in config: {use_case_name}")
    
    def _get_provider(self, policy: AIPolicy) -> AIProvider:
        """Get or create provider for policy"""
        cache_key = f"{policy.provider}:{policy.model}"
        
        if cache_key not in self._provider_cache:
            self._provider_cache[cache_key] = ProviderFactory.create(
                provider=policy.provider,
                model=policy.model,
                temperature=policy.temperature,
                max_tokens=policy.max_tokens,
            )
        
        return self._provider_cache[cache_key]
    
    async def execute(
        self,
        use_case: UseCaseType,
        prompt: str,
        context: OrchestrationContext,
        variables: Optional[Dict[str, Any]] = None,
        response_model: Optional[type[BaseModel]] = None,
    ) -> OrchestrationResult:
        """
        Execute AI operation with policy-based orchestration
        
        Args:
            use_case: Use case type
            prompt: User prompt (will be formatted with variables)
            context: Orchestration context (user, org, session)
            variables: Template variables for prompt formatting
            response_model: Optional Pydantic model for structured output
            
        Returns:
            OrchestrationResult with content and metadata
        """
        start_time = time.time()
        
        # Get policy for use case
        policy = self.policies.get(use_case)
        if not policy:
            raise ValueError(f"No policy defined for use case: {use_case}")
        
        # Check budget
        budget_check = await self.budget_manager.check_budget(
            user_id=context.user_id,
            org_id=context.org_id,
            policy=policy,
        )
        
        if not budget_check["allowed"]:
            raise ValueError(f"Budget exceeded: {budget_check['reason']}")
        
        # Format prompt with variables
        if variables:
            formatted_prompt = policy.user_prompt_template.format(**variables)
        else:
            formatted_prompt = prompt
        
        # Check cache if enabled
        cache_key = None
        if policy.cache_results:
            cache_key = f"ai:{use_case.value}:{hash(formatted_prompt)}"
            cached_result = await cache.get(cache_key)
            if cached_result:
                logger.info(f"Cache hit for {use_case.value}")
                return OrchestrationResult(
                    content=cached_result["content"],
                    provider_response=cached_result["provider_response"],
                    policy_used=policy.name,
                    cached=True,
                    latency_ms=(time.time() - start_time) * 1000,
                )
        
        # Get provider
        provider = self._get_provider(policy)
        
        # Execute based on structured vs. unstructured
        if response_model:
            validated_output, provider_response = await provider.generate_structured(
                prompt=formatted_prompt,
                response_model=response_model,
                system_prompt=policy.system_prompt,
            )
            content = validated_output.model_dump_json()
        else:
            provider_response = await provider.generate(
                prompt=formatted_prompt,
                system_prompt=policy.system_prompt,
            )
            content = provider_response.content
        
        # Update budget
        await self.budget_manager.record_usage(
            user_id=context.user_id,
            org_id=context.org_id,
            tokens_used=provider_response.tokens_used,
            cost=provider_response.tokens_used * 0.00001,  # Rough estimate
        )
        
        # Cache result if enabled
        if policy.cache_results and cache_key:
            await cache.set(
                cache_key,
                {
                    "content": content,
                    "provider_response": provider_response.model_dump(),
                },
                ttl=policy.cache_ttl_seconds,
            )
        
        # Log for observability
        logger.info(
            f"AI execution complete",
            extra={
                "use_case": use_case.value,
                "policy": policy.name,
                "provider": provider.name,
                "model": policy.model,
                "tokens_used": provider_response.tokens_used,
                "latency_ms": provider_response.latency_ms,
                "user_id": context.user_id,
                "org_id": context.org_id,
                "request_id": context.request_id,
            }
        )
        
        return OrchestrationResult(
            content=content,
            provider_response=provider_response.model_dump(),
            policy_used=policy.name,
            cached=False,
            budget_remaining=await self.budget_manager.get_remaining_budget(
                user_id=context.user_id,
                org_id=context.org_id,
            ),
            latency_ms=(time.time() - start_time) * 1000,
        )
    
    async def stream(
        self,
        use_case: UseCaseType,
        prompt: str,
        context: OrchestrationContext,
        variables: Optional[Dict[str, Any]] = None,
    ) -> AsyncIterator[str]:
        """
        Stream AI response with policy-based orchestration
        
        Args:
            use_case: Use case type
            prompt: User prompt
            context: Orchestration context
            variables: Template variables
            
        Yields:
            Content chunks
        """
        # Get policy
        policy = self.policies.get(use_case)
        if not policy:
            raise ValueError(f"No policy defined for use case: {use_case}")
        
        if not policy.streaming_enabled:
            raise ValueError(f"Streaming not enabled for use case: {use_case}")
        
        # Check budget
        budget_check = await self.budget_manager.check_budget(
            user_id=context.user_id,
            org_id=context.org_id,
            policy=policy,
        )
        
        if not budget_check["allowed"]:
            raise ValueError(f"Budget exceeded: {budget_check['reason']}")
        
        # Format prompt
        if variables:
            formatted_prompt = policy.user_prompt_template.format(**variables)
        else:
            formatted_prompt = prompt
        
        # Get provider
        provider = self._get_provider(policy)
        
        # Stream
        async for chunk in provider.stream(
            prompt=formatted_prompt,
            system_prompt=policy.system_prompt,
        ):
            yield chunk
    
    def get_policy(self, use_case: UseCaseType) -> Optional[AIPolicy]:
        """Get policy for use case"""
        return self.policies.get(use_case)
    
    def update_policy(self, use_case: UseCaseType, policy: AIPolicy):
        """Update policy for use case (runtime configuration)"""
        self.policies[use_case] = policy
        logger.info(f"Updated policy for {use_case.value}: {policy.name}")


# Global orchestrator instance
_orchestrator: Optional[AIOrchestrator] = None


def get_orchestrator() -> AIOrchestrator:
    """Get global orchestrator instance"""
    global _orchestrator
    if _orchestrator is None:
        _orchestrator = AIOrchestrator()
    return _orchestrator
