"""
AI Provider Abstraction Layer

Eliminates hardcoded AI_PROVIDER checks throughout codebase
"""

from .anthropic_provider import AnthropicProvider
from .base import AIProvider, ProviderResponse
from .factory import ProviderFactory
from .openai_provider import OpenAIProvider

__all__ = [
    "AIProvider",
    "ProviderResponse",
    "OpenAIProvider",
    "AnthropicProvider",
    "ProviderFactory",
]
