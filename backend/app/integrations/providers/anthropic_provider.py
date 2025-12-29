"""
Anthropic Claude Provider Implementation
"""

import json
import logging
import os
import time
from typing import AsyncIterator, Optional

import anthropic
from pydantic import BaseModel

from .base import AIProvider, ProviderResponse

logger = logging.getLogger(__name__)


class AnthropicProvider(AIProvider):
    """Anthropic Claude provider implementation"""

    def __init__(
        self,
        model: str,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None,
        **kwargs,
    ):
        super().__init__(model, temperature, max_tokens or 4096, **kwargs)
        self.client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    async def generate(
        self, prompt: str, system_prompt: Optional[str] = None, **kwargs
    ) -> ProviderResponse:
        """Generate completion using Anthropic"""
        start_time = time.time()

        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt if system_prompt else "",
                messages=[{"role": "user", "content": prompt}],
                **{**self.extra_params, **kwargs},
            )

            latency_ms = (time.time() - start_time) * 1000

            # Extract text content from response
            content = ""
            for block in response.content:
                if block.type == "text":
                    content += block.text

            return ProviderResponse(
                content=content,
                model=response.model,
                provider="anthropic",
                tokens_used=response.usage.input_tokens + response.usage.output_tokens,
                latency_ms=latency_ms,
                finish_reason=response.stop_reason,
                metadata={
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens,
                },
            )
        except Exception as e:
            logger.error(f"Anthropic generation failed: {e}")
            raise

    async def generate_structured(
        self,
        prompt: str,
        response_model: type[BaseModel],
        system_prompt: Optional[str] = None,
        **kwargs,
    ) -> tuple[BaseModel, ProviderResponse]:
        """
        Generate structured output using Anthropic

        Note: Anthropic doesn't have native function calling like OpenAI,
        so we use prompt engineering + JSON validation
        """
        start_time = time.time()

        # Add structured output instructions to prompt
        schema_json = json.dumps(response_model.model_json_schema(), indent=2)
        enhanced_prompt = f"""{prompt}

Please respond with ONLY a valid JSON object matching this schema:
{schema_json}

Do not include any explanation or markdown formatting - only the raw JSON."""

        try:
            response = await self.client.messages.create(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt if system_prompt else "",
                messages=[{"role": "user", "content": enhanced_prompt}],
                **{**self.extra_params, **kwargs},
            )

            latency_ms = (time.time() - start_time) * 1000

            # Extract text content
            content = ""
            for block in response.content:
                if block.type == "text":
                    content += block.text

            # Parse and validate JSON
            try:
                # Try to extract JSON from markdown code blocks if present
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()

                parsed_data = json.loads(content)
                validated_output = response_model(**parsed_data)
            except (json.JSONDecodeError, ValueError) as e:
                logger.error(f"Failed to parse structured output: {e}\nContent: {content}")
                raise ValueError(f"Failed to parse structured output: {e}")

            provider_response = ProviderResponse(
                content=content,
                model=response.model,
                provider="anthropic",
                tokens_used=response.usage.input_tokens + response.usage.output_tokens,
                latency_ms=latency_ms,
                finish_reason=response.stop_reason,
                metadata={
                    "input_tokens": response.usage.input_tokens,
                    "output_tokens": response.usage.output_tokens,
                    "structured_output": True,
                },
            )

            return validated_output, provider_response

        except Exception as e:
            logger.error(f"Anthropic structured generation failed: {e}")
            raise

    async def stream(
        self, prompt: str, system_prompt: Optional[str] = None, **kwargs
    ) -> AsyncIterator[str]:
        """Stream completion tokens from Anthropic"""
        try:
            async with self.client.messages.stream(
                model=self.model,
                max_tokens=self.max_tokens,
                temperature=self.temperature,
                system=system_prompt if system_prompt else "",
                messages=[{"role": "user", "content": prompt}],
                **{**self.extra_params, **kwargs},
            ) as stream:
                async for text in stream.text_stream:
                    yield text

        except Exception as e:
            logger.error(f"Anthropic streaming failed: {e}")
            raise

    def count_tokens(self, text: str) -> int:
        """
        Approximate token count for Anthropic
        Using rough approximation since Anthropic doesn't provide public tokenizer
        """
        # Rough approximation: 1 token ≈ 4 characters
        return len(text) // 4

    @property
    def name(self) -> str:
        return "anthropic"

    @property
    def supports_streaming(self) -> bool:
        return True

    @property
    def supports_function_calling(self) -> bool:
        return False  # No native function calling, use prompt engineering
