"""
OpenAI Provider Implementation
"""

import openai
from typing import Optional, AsyncIterator
from pydantic import BaseModel
import time
import tiktoken
import os
import logging

from .base import AIProvider, ProviderResponse

logger = logging.getLogger(__name__)


class OpenAIProvider(AIProvider):
    """OpenAI GPT provider implementation"""
    
    def __init__(self, model: str, temperature: float = 0.7, max_tokens: Optional[int] = None, **kwargs):
        super().__init__(model, temperature, max_tokens, **kwargs)
        self.client = openai.AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        
        # Initialize tokenizer for the model
        try:
            self.tokenizer = tiktoken.encoding_for_model(model)
        except KeyError:
            # Fallback to cl100k_base for newer models
            self.tokenizer = tiktoken.get_encoding("cl100k_base")
    
    async def generate(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> ProviderResponse:
        """Generate completion using OpenAI"""
        start_time = time.time()
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                **{**self.extra_params, **kwargs}
            )
            
            latency_ms = (time.time() - start_time) * 1000
            
            return ProviderResponse(
                content=response.choices[0].message.content,
                model=response.model,
                provider="openai",
                tokens_used=response.usage.total_tokens,
                latency_ms=latency_ms,
                finish_reason=response.choices[0].finish_reason,
                metadata={
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                }
            )
        except Exception as e:
            logger.error(f"OpenAI generation failed: {e}")
            raise
    
    async def generate_structured(
        self,
        prompt: str,
        response_model: type[BaseModel],
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> tuple[BaseModel, ProviderResponse]:
        """Generate structured output using OpenAI function calling"""
        start_time = time.time()
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        # Convert Pydantic model to OpenAI function schema
        function_schema = {
            "name": "structured_output",
            "description": f"Generate {response_model.__name__}",
            "parameters": response_model.model_json_schema()
        }
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                functions=[function_schema],
                function_call={"name": "structured_output"},
                **{**self.extra_params, **kwargs}
            )
            
            latency_ms = (time.time() - start_time) * 1000
            
            # Parse function call arguments into Pydantic model
            import json
            function_args = json.loads(
                response.choices[0].message.function_call.arguments
            )
            validated_output = response_model(**function_args)
            
            provider_response = ProviderResponse(
                content=str(validated_output),
                model=response.model,
                provider="openai",
                tokens_used=response.usage.total_tokens,
                latency_ms=latency_ms,
                finish_reason=response.choices[0].finish_reason,
                metadata={
                    "prompt_tokens": response.usage.prompt_tokens,
                    "completion_tokens": response.usage.completion_tokens,
                    "function_called": True,
                }
            )
            
            return validated_output, provider_response
            
        except Exception as e:
            logger.error(f"OpenAI structured generation failed: {e}")
            raise
    
    async def stream(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        **kwargs
    ) -> AsyncIterator[str]:
        """Stream completion tokens from OpenAI"""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})
        
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                stream=True,
                **{**self.extra_params, **kwargs}
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
                    
        except Exception as e:
            logger.error(f"OpenAI streaming failed: {e}")
            raise
    
    def count_tokens(self, text: str) -> int:
        """Count tokens using tiktoken"""
        return len(self.tokenizer.encode(text))
    
    @property
    def name(self) -> str:
        return "openai"
    
    @property
    def supports_streaming(self) -> bool:
        return True
    
    @property
    def supports_function_calling(self) -> bool:
        return True
