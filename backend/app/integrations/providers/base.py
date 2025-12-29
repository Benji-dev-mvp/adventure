"""
Base AI Provider Interface

Defines contract for all AI provider implementations
"""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, AsyncIterator, Dict, Optional

from pydantic import BaseModel, Field


class ProviderResponse(BaseModel):
    """Standardized response from any AI provider"""

    content: str
    model: str
    provider: str
    tokens_used: int = 0
    latency_ms: float = 0.0
    finish_reason: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class AIProvider(ABC):
    """Abstract base class for AI providers"""

    def __init__(
        self, model: str, temperature: float = 0.7, max_tokens: Optional[int] = None, **kwargs
    ):
        self.model = model
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.extra_params = kwargs

    @abstractmethod
    async def generate(
        self, prompt: str, system_prompt: Optional[str] = None, **kwargs
    ) -> ProviderResponse:
        """
        Generate completion from prompt

        Args:
            prompt: User prompt
            system_prompt: Optional system prompt
            **kwargs: Provider-specific parameters

        Returns:
            ProviderResponse with generated content
        """

    @abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        response_model: type[BaseModel],
        system_prompt: Optional[str] = None,
        **kwargs,
    ) -> tuple[BaseModel, ProviderResponse]:
        """
        Generate structured output validated against Pydantic model

        Args:
            prompt: User prompt
            response_model: Pydantic model for output validation
            system_prompt: Optional system prompt
            **kwargs: Provider-specific parameters

        Returns:
            Tuple of (validated_model, provider_response)
        """

    @abstractmethod
    async def stream(
        self, prompt: str, system_prompt: Optional[str] = None, **kwargs
    ) -> AsyncIterator[str]:
        """
        Stream completion tokens

        Args:
            prompt: User prompt
            system_prompt: Optional system prompt
            **kwargs: Provider-specific parameters

        Yields:
            Content chunks as they arrive
        """

    @abstractmethod
    def count_tokens(self, text: str) -> int:
        """
        Count tokens in text (provider-specific tokenization)

        Args:
            text: Text to tokenize

        Returns:
            Token count
        """

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name (e.g., 'openai', 'anthropic')"""

    @property
    @abstractmethod
    def supports_streaming(self) -> bool:
        """Whether provider supports streaming"""

    @property
    @abstractmethod
    def supports_function_calling(self) -> bool:
        """Whether provider supports function/tool calling"""
