"""
Provider Factory

Creates AI provider instances based on configuration
"""

import logging
import os
from typing import Optional

from .anthropic_provider import AnthropicProvider
from .base import AIProvider
from .openai_provider import OpenAIProvider

logger = logging.getLogger(__name__)


class ProviderFactory:
    """Factory for creating AI provider instances"""

    _providers = {
        "openai": OpenAIProvider,
        "anthropic": AnthropicProvider,
    }

    @classmethod
    def create(
        cls,
        provider: Optional[str] = None,
        model: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs,
    ) -> AIProvider:
        """
        Create AI provider instance

        Args:
            provider: Provider name ('openai', 'anthropic'). Defaults to AI_PROVIDER env var
            model: Model name. Defaults based on provider
            temperature: Sampling temperature
            max_tokens: Max tokens to generate
            **kwargs: Additional provider-specific parameters

        Returns:
            AIProvider instance

        Raises:
            ValueError: If provider is unsupported
        """
        # Default to environment variable
        if provider is None:
            provider = os.getenv("AI_PROVIDER", "openai").lower()

        # Validate provider
        if provider not in cls._providers:
            raise ValueError(
                f"Unsupported provider: {provider}. " f"Supported: {list(cls._providers.keys())}"
            )

        # Default model based on provider
        if model is None:
            model = cls._get_default_model(provider)

        # Create provider instance
        provider_class = cls._providers[provider]

        logger.info(f"Creating {provider} provider with model {model}")

        return provider_class(model=model, temperature=temperature, max_tokens=max_tokens, **kwargs)

    @classmethod
    def _get_default_model(cls, provider: str) -> str:
        """Get default model for provider"""
        defaults = {
            "openai": os.getenv("OPENAI_MODEL", "gpt-4"),
            "anthropic": os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022"),
        }
        return defaults.get(provider, "gpt-4")

    @classmethod
    def register_provider(cls, name: str, provider_class: type[AIProvider]):
        """
        Register a custom provider

        Args:
            name: Provider name
            provider_class: Provider class implementing AIProvider
        """
        cls._providers[name] = provider_class
        logger.info(f"Registered custom provider: {name}")
