"""
AI Provider Abstraction Layer

Eliminates hardcoded AI_PROVIDER checks throughout codebase
"""

from .base import AIProvider, ProviderResponse
from .openai_provider import OpenAIProvider
from .anthropic_provider import AnthropicProvider
from .factory import ProviderFactory

__all__ = [
    "AIProvider",
    "ProviderResponse",
    "OpenAIProvider",
    "AnthropicProvider",
    "ProviderFactory",
]
