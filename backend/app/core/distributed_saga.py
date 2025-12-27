"""
Distributed Saga Pattern for Multi-Service Transactions.
Ensures data consistency across microservices with compensation logic.
"""
import logging
from typing import List, Dict, Any, Optional, Callable, Awaitable
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
import asyncio
import uuid
import json

from app.core.cache import cache

logger = logging.getLogger(__name__)


class SagaStatus(str, Enum):
    """Saga execution status"""
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"
    COMPENSATING = "compensating"
    COMPENSATED = "compensated"


class StepStatus(str, Enum):
    """Individual step status"""
    PENDING = "pending"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    COMPENSATING = "compensating"
    COMPENSATED = "compensated"


@dataclass
class SagaStep:
    """
    Single step in saga with forward and compensation logic.
    """
    name: str
    action: Callable[..., Awaitable[Dict[str, Any]]]  # Forward transaction
    compensation: Callable[..., Awaitable[None]]  # Rollback/undo
    status: StepStatus = StepStatus.PENDING
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    attempts: int = 0
    max_retries: int = 3
    timeout: int = 30  # seconds
    
    def __hash__(self):
        return hash(self.name)


@dataclass
class SagaContext:
    """
    Context passed between saga steps.
    Contains accumulated state from previous steps.
    """
    saga_id: str
    data: Dict[str, Any] = field(default_factory=dict)
    steps_completed: List[str] = field(default_factory=list)
    
    def set(self, key: str, value: Any) -> None:
        """Store data in context"""
        self.data[key] = value
    
    def get(self, key: str, default: Any = None) -> Any:
        """Retrieve data from context"""
        return self.data.get(key, default)


@dataclass
class SagaExecution:
    """Record of saga execution"""
    saga_id: str
    saga_name: str
    status: SagaStatus
    started_at: datetime
    completed_at: Optional[datetime] = None
    steps: List[SagaStep] = field(default_factory=list)
    context: Optional[SagaContext] = None
    error: Optional[str] = None


class SagaOrchestrator:
    """
    Orchestrates saga execution with compensation.
    Implements choreography-based saga pattern.
    """
    
    def __init__(self):
        self.executions: Dict[str, SagaExecution] = {}
    
    async def execute_saga(
        self,
        saga_name: str,
        steps: List[SagaStep],
        initial_data: Optional[Dict[str, Any]] = None
    ) -> SagaExecution:
        """
        Execute saga with automatic compensation on failure.
        
        Flow:
        1. Execute each step sequentially
        2. If any step fails, run compensation for completed steps in reverse
        3. Return execution record
        """
        saga_id = str(uuid.uuid4())
        context = SagaContext(saga_id=saga_id, data=initial_data or {})
        
        execution = SagaExecution(
            saga_id=saga_id,
            saga_name=saga_name,
            status=SagaStatus.IN_PROGRESS,
            started_at=datetime.now(),
            steps=steps,
            context=context
        )
        
        self.executions[saga_id] = execution
        
        try:
            # Execute forward steps
            for step in steps:
                await self._execute_step(step, context)
                context.steps_completed.append(step.name)
            
            # All steps succeeded
            execution.status = SagaStatus.COMPLETED
            execution.completed_at = datetime.now()
            
            logger.info(f"Saga {saga_id} completed successfully")
            
        except Exception as e:
            logger.error(f"Saga {saga_id} failed: {e}")
            execution.status = SagaStatus.FAILED
            execution.error = str(e)
            
            # Run compensation
            await self._compensate(steps, context)
            execution.status = SagaStatus.COMPENSATED
        
        # Persist execution log
        await self._persist_execution(execution)
        
        return execution
    
    async def _execute_step(self, step: SagaStep, context: SagaContext) -> None:
        """Execute single step with retry logic"""
        step.status = StepStatus.EXECUTING
        
        while step.attempts < step.max_retries:
            try:
                step.attempts += 1
                
                # Execute with timeout
                result = await asyncio.wait_for(
                    step.action(context),
                    timeout=step.timeout
                )
                
                step.result = result
                step.status = StepStatus.COMPLETED
                
                logger.info(f"Step '{step.name}' completed (attempt {step.attempts})")
                return
                
            except asyncio.TimeoutError:
                logger.warning(f"Step '{step.name}' timed out (attempt {step.attempts})")
                if step.attempts >= step.max_retries:
                    step.status = StepStatus.FAILED
                    step.error = "Timeout"
                    raise
                
                # Exponential backoff
                await asyncio.sleep(2 ** step.attempts)
                
            except Exception as e:
                logger.error(f"Step '{step.name}' failed: {e} (attempt {step.attempts})")
                step.error = str(e)
                
                if step.attempts >= step.max_retries:
                    step.status = StepStatus.FAILED
                    raise
                
                await asyncio.sleep(2 ** step.attempts)
    
    async def _compensate(self, steps: List[SagaStep], context: SagaContext) -> None:
        """
        Run compensation logic for completed steps in reverse order.
        Best-effort: continues even if compensation fails.
        """
        logger.info(f"Starting compensation for saga {context.saga_id}")
        
        # Reverse order
        completed_steps = [s for s in steps if s.status == StepStatus.COMPLETED]
        
        for step in reversed(completed_steps):
            step.status = StepStatus.COMPENSATING
            
            try:
                await asyncio.wait_for(
                    step.compensation(context),
                    timeout=step.timeout
                )
                
                step.status = StepStatus.COMPENSATED
                logger.info(f"Compensated step '{step.name}'")
                
            except Exception as e:
                logger.error(f"Compensation failed for '{step.name}': {e}")
                # Continue with other compensations
    
    async def _persist_execution(self, execution: SagaExecution) -> None:
        """Persist saga execution log"""
        log_entry = {
            "saga_id": execution.saga_id,
            "saga_name": execution.saga_name,
            "status": execution.status,
            "started_at": execution.started_at.isoformat(),
            "completed_at": execution.completed_at.isoformat() if execution.completed_at else None,
            "steps": [
                {
                    "name": step.name,
                    "status": step.status,
                    "attempts": step.attempts,
                    "error": step.error
                }
                for step in execution.steps
            ],
            "error": execution.error
        }
        
        # Store in Redis for 7 days
        cache.set(
            f"saga_execution:{execution.saga_id}",
            json.dumps(log_entry),
            ttl=604800
        )
    
    def get_execution(self, saga_id: str) -> Optional[SagaExecution]:
        """Retrieve saga execution by ID"""
        return self.executions.get(saga_id)
    
    def list_active_sagas(self) -> List[SagaExecution]:
        """List all in-progress sagas"""
        return [
            exec for exec in self.executions.values()
            if exec.status in [SagaStatus.IN_PROGRESS, SagaStatus.COMPENSATING]
        ]


# Global orchestrator
saga_orchestrator = SagaOrchestrator()


# Example: Multi-step campaign launch saga

async def launch_campaign_saga(campaign_id: int, lead_ids: List[int]) -> SagaExecution:
    """
    Example saga: Launch campaign with multiple coordinated steps.
    
    Steps:
    1. Reserve credits (billing service)
    2. Enqueue emails (email service)
    3. Update campaign status (campaign service)
    4. Create analytics records (analytics service)
    
    If any step fails, compensate (rollback) previous steps.
    """
    
    # Step 1: Reserve credits
    async def reserve_credits(ctx: SagaContext) -> Dict[str, Any]:
        logger.info(f"Reserving credits for campaign {campaign_id}")
        # Simulate API call to billing service
        await asyncio.sleep(0.1)
        
        credit_cost = len(lead_ids) * 10
        
        # Mock check
        if credit_cost > 10000:
            raise ValueError("Insufficient credits")
        
        ctx.set("reserved_credits", credit_cost)
        ctx.set("reservation_id", "RES-123")
        
        return {"credits_reserved": credit_cost, "reservation_id": "RES-123"}
    
    async def compensate_credits(ctx: SagaContext) -> None:
        logger.info("Releasing reserved credits")
        reservation_id = ctx.get("reservation_id")
        # Call billing service to release
        await asyncio.sleep(0.1)
    
    # Step 2: Enqueue emails
    async def enqueue_emails(ctx: SagaContext) -> Dict[str, Any]:
        logger.info(f"Enqueueing {len(lead_ids)} emails")
        await asyncio.sleep(0.1)
        
        # Simulate Celery task creation
        task_ids = [f"task-{i}" for i in lead_ids]
        ctx.set("email_task_ids", task_ids)
        
        return {"tasks_created": len(task_ids), "task_ids": task_ids}
    
    async def compensate_emails(ctx: SagaContext) -> None:
        logger.info("Cancelling queued emails")
        task_ids = ctx.get("email_task_ids", [])
        # Call Celery to revoke tasks
        await asyncio.sleep(0.1)
    
    # Step 3: Update campaign status
    async def update_campaign_status(ctx: SagaContext) -> Dict[str, Any]:
        logger.info(f"Updating campaign {campaign_id} to ACTIVE")
        await asyncio.sleep(0.1)
        
        # DB update
        ctx.set("old_status", "DRAFT")
        # UPDATE campaigns SET status = 'ACTIVE' WHERE id = campaign_id
        
        return {"status": "ACTIVE"}
    
    async def compensate_campaign_status(ctx: SagaContext) -> None:
        logger.info(f"Reverting campaign {campaign_id} to DRAFT")
        old_status = ctx.get("old_status", "DRAFT")
        # UPDATE campaigns SET status = old_status WHERE id = campaign_id
        await asyncio.sleep(0.1)
    
    # Step 4: Create analytics records
    async def create_analytics(ctx: SagaContext) -> Dict[str, Any]:
        logger.info(f"Creating analytics for campaign {campaign_id}")
        await asyncio.sleep(0.1)
        
        # Insert analytics records
        ctx.set("analytics_ids", [101, 102, 103])
        
        return {"analytics_created": 3}
    
    async def compensate_analytics(ctx: SagaContext) -> None:
        logger.info("Deleting analytics records")
        analytics_ids = ctx.get("analytics_ids", [])
        # DELETE FROM analytics WHERE id IN analytics_ids
        await asyncio.sleep(0.1)
    
    # Define saga steps
    steps = [
        SagaStep(
            name="reserve_credits",
            action=reserve_credits,
            compensation=compensate_credits,
            max_retries=2
        ),
        SagaStep(
            name="enqueue_emails",
            action=enqueue_emails,
            compensation=compensate_emails,
            max_retries=3
        ),
        SagaStep(
            name="update_campaign_status",
            action=update_campaign_status,
            compensation=compensate_campaign_status,
            max_retries=2
        ),
        SagaStep(
            name="create_analytics",
            action=create_analytics,
            compensation=compensate_analytics,
            max_retries=2
        )
    ]
    
    # Execute saga
    execution = await saga_orchestrator.execute_saga(
        saga_name=f"launch_campaign_{campaign_id}",
        steps=steps,
        initial_data={"campaign_id": campaign_id, "lead_ids": lead_ids}
    )
    
    return execution


# Example: User onboarding saga

async def onboard_user_saga(user_data: Dict[str, Any]) -> SagaExecution:
    """
    Multi-step user onboarding:
    1. Create user account
    2. Send welcome email
    3. Initialize workspace
    4. Grant trial credits
    """
    
    async def create_user_account(ctx: SagaContext) -> Dict[str, Any]:
        email = user_data["email"]
        logger.info(f"Creating account for {email}")
        await asyncio.sleep(0.1)
        
        user_id = 12345  # Mock
        ctx.set("user_id", user_id)
        
        return {"user_id": user_id, "email": email}
    
    async def compensate_user_account(ctx: SagaContext) -> None:
        user_id = ctx.get("user_id")
        logger.info(f"Deleting user account {user_id}")
        # DELETE FROM users WHERE id = user_id
        await asyncio.sleep(0.1)
    
    async def send_welcome_email(ctx: SagaContext) -> Dict[str, Any]:
        user_id = ctx.get("user_id")
        email = user_data["email"]
        
        logger.info(f"Sending welcome email to {email}")
        await asyncio.sleep(0.1)
        
        ctx.set("email_sent", True)
        return {"email_sent": True}
    
    async def compensate_welcome_email(ctx: SagaContext) -> None:
        # Can't unsend email, log for manual follow-up
        logger.info("Email sent cannot be compensated, flagging for manual review")
    
    async def initialize_workspace(ctx: SagaContext) -> Dict[str, Any]:
        user_id = ctx.get("user_id")
        
        logger.info(f"Initializing workspace for user {user_id}")
        await asyncio.sleep(0.1)
        
        workspace_id = 567
        ctx.set("workspace_id", workspace_id)
        
        return {"workspace_id": workspace_id}
    
    async def compensate_workspace(ctx: SagaContext) -> None:
        workspace_id = ctx.get("workspace_id")
        logger.info(f"Deleting workspace {workspace_id}")
        await asyncio.sleep(0.1)
    
    async def grant_trial_credits(ctx: SagaContext) -> Dict[str, Any]:
        user_id = ctx.get("user_id")
        
        logger.info(f"Granting trial credits to user {user_id}")
        await asyncio.sleep(0.1)
        
        credits = 1000
        ctx.set("credits_granted", credits)
        
        return {"credits": credits}
    
    async def compensate_trial_credits(ctx: SagaContext) -> None:
        user_id = ctx.get("user_id")
        credits = ctx.get("credits_granted")
        
        logger.info(f"Revoking {credits} credits from user {user_id}")
        await asyncio.sleep(0.1)
    
    steps = [
        SagaStep(
            name="create_user_account",
            action=create_user_account,
            compensation=compensate_user_account
        ),
        SagaStep(
            name="send_welcome_email",
            action=send_welcome_email,
            compensation=compensate_welcome_email
        ),
        SagaStep(
            name="initialize_workspace",
            action=initialize_workspace,
            compensation=compensate_workspace
        ),
        SagaStep(
            name="grant_trial_credits",
            action=grant_trial_credits,
            compensation=compensate_trial_credits
        )
    ]
    
    return await saga_orchestrator.execute_saga(
        saga_name="onboard_user",
        steps=steps,
        initial_data=user_data
    )
