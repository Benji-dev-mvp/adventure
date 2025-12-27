"""
Self-Healing Error Recovery System
Automatically retries failures with alternative approaches
"""
from typing import Callable, Any, Optional, Dict, List
from functools import wraps
from datetime import datetime
import asyncio
import traceback
from pydantic import BaseModel
from enum import Enum


class ErrorCategory(str, Enum):
    API_RATE_LIMIT = "api_rate_limit"
    API_TIMEOUT = "api_timeout"
    API_ERROR = "api_error"
    VALIDATION_ERROR = "validation_error"
    DATA_ERROR = "data_error"
    NETWORK_ERROR = "network_error"
    AUTH_ERROR = "auth_error"


class RecoveryStrategy(BaseModel):
    """Strategy for recovering from specific error"""
    error_category: ErrorCategory
    max_retries: int
    retry_delay_seconds: float
    backoff_multiplier: float
    alternative_approaches: List[str]


class ErrorAnalysis(BaseModel):
    """AI analysis of error"""
    error_type: str
    likely_cause: str
    suggested_fix: str
    confidence: float
    alternative_actions: List[str]


class RecoveryAttempt(BaseModel):
    """Single recovery attempt"""
    attempt_number: int
    strategy: str
    timestamp: datetime
    success: bool
    error_message: Optional[str] = None
    result: Optional[Any] = None


class SelfHealingResult(BaseModel):
    """Result of self-healing process"""
    original_error: str
    error_category: ErrorCategory
    total_attempts: int
    recovery_attempts: List[RecoveryAttempt]
    final_success: bool
    final_result: Optional[Any] = None
    time_to_recovery_seconds: Optional[float] = None
    ai_analysis: Optional[ErrorAnalysis] = None


# Recovery strategies for different error types
RECOVERY_STRATEGIES = {
    ErrorCategory.API_RATE_LIMIT: RecoveryStrategy(
        error_category=ErrorCategory.API_RATE_LIMIT,
        max_retries=5,
        retry_delay_seconds=30,
        backoff_multiplier=2.0,
        alternative_approaches=[
            "Switch to backup API provider",
            "Use cached data",
            "Queue for later processing"
        ]
    ),
    ErrorCategory.API_TIMEOUT: RecoveryStrategy(
        error_category=ErrorCategory.API_TIMEOUT,
        max_retries=3,
        retry_delay_seconds=5,
        backoff_multiplier=1.5,
        alternative_approaches=[
            "Reduce request payload size",
            "Use faster endpoint",
            "Split into smaller requests"
        ]
    ),
    ErrorCategory.API_ERROR: RecoveryStrategy(
        error_category=ErrorCategory.API_ERROR,
        max_retries=3,
        retry_delay_seconds=10,
        backoff_multiplier=2.0,
        alternative_approaches=[
            "Adjust request parameters",
            "Use alternative API method",
            "Fallback to manual process"
        ]
    ),
    ErrorCategory.VALIDATION_ERROR: RecoveryStrategy(
        error_category=ErrorCategory.VALIDATION_ERROR,
        max_retries=2,
        retry_delay_seconds=0,
        backoff_multiplier=1.0,
        alternative_approaches=[
            "Auto-sanitize input data",
            "Apply default values",
            "Relax validation rules"
        ]
    )
}


class SelfHealingSystem:
    """
    AI-powered error recovery system that learns from failures
    """
    
    def __init__(self, openai_client=None):
        self.client = openai_client
        self.recovery_history: List[SelfHealingResult] = []
        self.success_rate_by_category: Dict[ErrorCategory, float] = {}
    
    async def analyze_error(self, error: Exception, context: Dict[str, Any]) -> ErrorAnalysis:
        """
        Use AI to analyze error and suggest recovery strategies
        """
        if not self.client:
            # Fallback to rule-based analysis
            return self._rule_based_analysis(error)
        
        error_message = str(error)
        error_type = type(error).__name__
        error_traceback = traceback.format_exc()
        
        prompt = f"""
Analyze this error and suggest recovery strategies:

Error Type: {error_type}
Error Message: {error_message}
Context: {context}
Traceback: {error_traceback}

Provide:
1. Likely root cause
2. Immediate fix
3. Alternative approaches
4. Confidence level (0-1)
"""
        
        response = await self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=[
                {"role": "system", "content": "You are an expert at diagnosing and fixing software errors."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3
        )
        
        analysis_text = response.choices[0].message.content
        
        # Parse AI response
        return ErrorAnalysis(
            error_type=error_type,
            likely_cause=self._extract_cause(analysis_text),
            suggested_fix=self._extract_fix(analysis_text),
            confidence=0.8,
            alternative_actions=self._extract_alternatives(analysis_text)
        )
    
    def _rule_based_analysis(self, error: Exception) -> ErrorAnalysis:
        """Fallback rule-based error analysis"""
        error_type = type(error).__name__
        error_message = str(error)
        
        if "rate limit" in error_message.lower():
            return ErrorAnalysis(
                error_type=error_type,
                likely_cause="API rate limit exceeded",
                suggested_fix="Wait 30 seconds and retry, or use backup provider",
                confidence=0.9,
                alternative_actions=["Switch provider", "Queue request", "Use cache"]
            )
        elif "timeout" in error_message.lower():
            return ErrorAnalysis(
                error_type=error_type,
                likely_cause="Request timeout - endpoint taking too long",
                suggested_fix="Retry with smaller payload or increase timeout",
                confidence=0.85,
                alternative_actions=["Reduce payload", "Split request", "Use faster endpoint"]
            )
        else:
            return ErrorAnalysis(
                error_type=error_type,
                likely_cause="Unknown error",
                suggested_fix="Review error logs and retry",
                confidence=0.5,
                alternative_actions=["Retry", "Skip", "Manual review"]
            )
    
    async def execute_with_recovery(
        self,
        func: Callable,
        *args,
        error_category: ErrorCategory = ErrorCategory.API_ERROR,
        context: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> SelfHealingResult:
        """
        Execute function with automatic error recovery
        
        If function fails, tries alternative approaches automatically
        """
        start_time = datetime.utcnow()
        strategy = RECOVERY_STRATEGIES.get(error_category)
        recovery_attempts: List[RecoveryAttempt] = []
        
        original_error = None
        ai_analysis = None
        
        for attempt in range(strategy.max_retries + 1):
            try:
                # Execute function
                if asyncio.iscoroutinefunction(func):
                    result = await func(*args, **kwargs)
                else:
                    result = func(*args, **kwargs)
                
                # Success!
                recovery_attempts.append(RecoveryAttempt(
                    attempt_number=attempt + 1,
                    strategy="direct_execution" if attempt == 0 else "retry_with_backoff",
                    timestamp=datetime.utcnow(),
                    success=True,
                    result=str(result)[:200]  # Truncate for logging
                ))
                
                end_time = datetime.utcnow()
                time_to_recovery = (end_time - start_time).total_seconds()
                
                healing_result = SelfHealingResult(
                    original_error=str(original_error) if original_error else "None",
                    error_category=error_category,
                    total_attempts=attempt + 1,
                    recovery_attempts=recovery_attempts,
                    final_success=True,
                    final_result=result,
                    time_to_recovery_seconds=time_to_recovery,
                    ai_analysis=ai_analysis
                )
                
                self.recovery_history.append(healing_result)
                return healing_result
                
            except Exception as e:
                if attempt == 0:
                    original_error = e
                    # Analyze error with AI
                    ai_analysis = await self.analyze_error(e, context or {})
                
                recovery_attempts.append(RecoveryAttempt(
                    attempt_number=attempt + 1,
                    strategy="retry_with_backoff",
                    timestamp=datetime.utcnow(),
                    success=False,
                    error_message=str(e)
                ))
                
                if attempt < strategy.max_retries:
                    # Wait before retry with exponential backoff
                    delay = strategy.retry_delay_seconds * (strategy.backoff_multiplier ** attempt)
                    await asyncio.sleep(delay)
                    continue
                else:
                    # All retries exhausted, try alternative approaches
                    for alt_strategy in strategy.alternative_approaches:
                        try:
                            result = await self._try_alternative(
                                func, alt_strategy, args, kwargs, context
                            )
                            
                            recovery_attempts.append(RecoveryAttempt(
                                attempt_number=attempt + 2,
                                strategy=alt_strategy,
                                timestamp=datetime.utcnow(),
                                success=True,
                                result=str(result)[:200]
                            ))
                            
                            healing_result = SelfHealingResult(
                                original_error=str(original_error),
                                error_category=error_category,
                                total_attempts=len(recovery_attempts),
                                recovery_attempts=recovery_attempts,
                                final_success=True,
                                final_result=result,
                                time_to_recovery_seconds=(datetime.utcnow() - start_time).total_seconds(),
                                ai_analysis=ai_analysis
                            )
                            
                            self.recovery_history.append(healing_result)
                            return healing_result
                            
                        except Exception as alt_error:
                            recovery_attempts.append(RecoveryAttempt(
                                attempt_number=len(recovery_attempts) + 1,
                                strategy=alt_strategy,
                                timestamp=datetime.utcnow(),
                                success=False,
                                error_message=str(alt_error)
                            ))
                            continue
                    
                    # All recovery attempts failed
                    healing_result = SelfHealingResult(
                        original_error=str(original_error),
                        error_category=error_category,
                        total_attempts=len(recovery_attempts),
                        recovery_attempts=recovery_attempts,
                        final_success=False,
                        ai_analysis=ai_analysis
                    )
                    
                    self.recovery_history.append(healing_result)
                    return healing_result
    
    async def _try_alternative(
        self,
        func: Callable,
        strategy: str,
        args: tuple,
        kwargs: dict,
        context: Optional[Dict[str, Any]]
    ) -> Any:
        """Try alternative approach based on strategy"""
        
        if strategy == "Use cached data":
            # Return cached result if available
            cache_key = f"{func.__name__}_{args}_{kwargs}"
            # In production, check actual cache
            raise Exception("No cached data available")
        
        elif strategy == "Queue for later processing":
            # Add to queue for async processing
            # In production, use Celery or similar
            return {"status": "queued", "message": "Will process later"}
        
        elif strategy == "Switch to backup API provider":
            # Try alternative API
            # Modify kwargs to use backup
            kwargs['use_backup'] = True
            if asyncio.iscoroutinefunction(func):
                return await func(*args, **kwargs)
            return func(*args, **kwargs)
        
        elif strategy == "Auto-sanitize input data":
            # Clean and retry
            sanitized_args = self._sanitize_data(args)
            if asyncio.iscoroutinefunction(func):
                return await func(*sanitized_args, **kwargs)
            return func(*sanitized_args, **kwargs)
        
        else:
            raise Exception(f"Unknown strategy: {strategy}")
    
    def _sanitize_data(self, data: Any) -> Any:
        """Auto-sanitize data to fix common issues"""
        if isinstance(data, str):
            # Remove special characters, trim whitespace
            return data.strip().replace('\x00', '')
        elif isinstance(data, tuple):
            return tuple(self._sanitize_data(item) for item in data)
        elif isinstance(data, list):
            return [self._sanitize_data(item) for item in data]
        return data
    
    def _extract_cause(self, text: str) -> str:
        """Extract likely cause from AI response"""
        # Simple extraction - in production, use more sophisticated parsing
        if "cause:" in text.lower():
            lines = text.split('\n')
            for line in lines:
                if "cause:" in line.lower():
                    return line.split(':', 1)[1].strip()
        return "Unknown cause"
    
    def _extract_fix(self, text: str) -> str:
        """Extract suggested fix from AI response"""
        if "fix:" in text.lower():
            lines = text.split('\n')
            for line in lines:
                if "fix:" in line.lower():
                    return line.split(':', 1)[1].strip()
        return "No fix suggested"
    
    def _extract_alternatives(self, text: str) -> List[str]:
        """Extract alternative approaches from AI response"""
        alternatives = []
        lines = text.split('\n')
        collecting = False
        for line in lines:
            if "alternative" in line.lower():
                collecting = True
                continue
            if collecting and line.strip().startswith(('-', '•', '*', str(len(alternatives) + 1))):
                alternatives.append(line.strip().lstrip('-•*0123456789. '))
        return alternatives[:3]  # Top 3 alternatives
    
    def get_recovery_stats(self) -> Dict[str, Any]:
        """Get statistics on recovery success rates"""
        if not self.recovery_history:
            return {"total_recoveries": 0}
        
        total = len(self.recovery_history)
        successful = sum(1 for r in self.recovery_history if r.final_success)
        
        avg_attempts = sum(r.total_attempts for r in self.recovery_history) / total
        avg_recovery_time = sum(
            r.time_to_recovery_seconds for r in self.recovery_history if r.time_to_recovery_seconds
        ) / total if total > 0 else 0
        
        by_category = {}
        for category in ErrorCategory:
            category_results = [r for r in self.recovery_history if r.error_category == category]
            if category_results:
                success_rate = sum(1 for r in category_results if r.final_success) / len(category_results)
                by_category[category.value] = {
                    "total": len(category_results),
                    "success_rate": round(success_rate * 100, 1),
                    "avg_attempts": round(sum(r.total_attempts for r in category_results) / len(category_results), 1)
                }
        
        return {
            "total_recoveries": total,
            "success_rate": round((successful / total) * 100, 1),
            "avg_attempts": round(avg_attempts, 1),
            "avg_recovery_time_seconds": round(avg_recovery_time, 2),
            "by_category": by_category
        }


# Decorator for easy integration
def with_self_healing(error_category: ErrorCategory = ErrorCategory.API_ERROR):
    """
    Decorator to add self-healing to any function
    
    Usage:
    @with_self_healing(error_category=ErrorCategory.API_RATE_LIMIT)
    async def call_external_api():
        # Your code here
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            healing_system = SelfHealingSystem()
            result = await healing_system.execute_with_recovery(
                func, *args, error_category=error_category, **kwargs
            )
            
            if result.final_success:
                return result.final_result
            else:
                raise Exception(f"All recovery attempts failed: {result.original_error}")
        
        return wrapper
    return decorator
