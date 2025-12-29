"""LLM Workflows API routes for multi-step AI orchestration."""
from fastapi import APIRouter, Depends, HTTPException, Path, Body
from typing import Dict, Any, Optional, List
from pydantic import BaseModel, Field
from sqlmodel import Session

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.user import User
from app.services.llm_workflow_service import llm_workflow_service
from app.services.audit_log_service import audit_log_service

router = APIRouter(prefix="/api/workflows", tags=["llm-workflows"])


class WorkflowRunRequest(BaseModel):
    """Workflow execution request."""
    input_data: Dict[str, Any] = Field(..., description="Input data for the workflow")


class WorkflowRunResponse(BaseModel):
    """Workflow execution response."""
    workflow_id: str
    workflow_name: str
    started_at: str
    completed_at: str
    status: str
    steps: List[Dict[str, Any]]


class WorkflowInfo(BaseModel):
    """Workflow information."""
    id: str
    name: str
    description: str
    steps: List[str]


@router.get("", response_model=List[WorkflowInfo])
async def list_workflows(
    user: User = Depends(get_current_user)
):
    """List all available LLM workflows.
    
    Workflows are multi-step AI processes that automate complex tasks
    like lead enrichment, email generation, objection handling, etc.
    """
    workflows = llm_workflow_service.list_workflows()
    return workflows


@router.get("/{workflow_id}", response_model=WorkflowInfo)
async def get_workflow_info(
    workflow_id: str = Path(..., description="Workflow ID"),
    user: User = Depends(get_current_user)
):
    """Get detailed information about a specific workflow.
    
    Returns the workflow's name, description, and list of steps.
    """
    workflows = llm_workflow_service.list_workflows()
    
    for workflow in workflows:
        if workflow["id"] == workflow_id:
            return workflow
    
    raise HTTPException(status_code=404, detail="Workflow not found")


@router.post("/{workflow_id}/run", response_model=WorkflowRunResponse)
async def run_workflow(
    workflow_id: str = Path(..., description="Workflow ID"),
    request: WorkflowRunRequest = Body(...),
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Execute a multi-step LLM workflow.
    
    Workflows orchestrate multiple AI operations in sequence,
    with each step building on the results of previous steps.
    
    Available workflows:
    - lead_enrichment: Enrich lead data with company info and scoring
    - email_generation: Generate personalized email sequences
    - objection_handling: Analyze and respond to objections
    - meeting_prep: Prepare for sales meetings
    - call_analysis: Analyze call transcripts
    
    The workflow will execute all steps and return comprehensive results.
    """
    # Get tenant ID (in production, from user.tenant_id)
    tenant_id = 1
    
    try:
        # Run workflow
        result = await llm_workflow_service.run_workflow(
            workflow_id=workflow_id,
            input_data=request.input_data,
            tenant_id=tenant_id,
            user_id=user.id
        )
        
        # Log workflow execution
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="workflow.run",
            user=user,
            resource_type="workflow",
            resource_id=workflow_id,
            metadata={
                "workflow_id": workflow_id,
                "steps_completed": len(result.get("steps", [])),
                "status": result.get("status")
            },
            success=True
        )
        
        return WorkflowRunResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    except Exception as e:
        # Log error
        audit_log_service.log_audit_event(
            session,
            tenant_id=tenant_id,
            action="workflow.run",
            user=user,
            resource_type="workflow",
            resource_id=workflow_id,
            metadata={"workflow_id": workflow_id},
            success=False,
            error_message=str(e)
        )
        
        raise HTTPException(
            status_code=500,
            detail=f"Workflow execution failed: {str(e)}"
        )


@router.post("/{workflow_id}/simulate", response_model=Dict[str, Any])
async def simulate_workflow(
    workflow_id: str = Path(..., description="Workflow ID"),
    request: WorkflowRunRequest = Body(...),
    user: User = Depends(get_current_user)
):
    """Simulate a workflow execution (dry run).
    
    Returns what the workflow would do without actually executing it.
    Useful for testing and understanding workflow behavior.
    """
    # Get workflow info
    workflows = llm_workflow_service.list_workflows()
    
    workflow_info = None
    for wf in workflows:
        if wf["id"] == workflow_id:
            workflow_info = wf
            break
    
    if not workflow_info:
        raise HTTPException(status_code=404, detail="Workflow not found")
    
    return {
        "workflow_id": workflow_id,
        "workflow_name": workflow_info["name"],
        "steps": workflow_info["steps"],
        "estimated_duration_seconds": len(workflow_info["steps"]) * 2,
        "input_data": request.input_data,
        "note": "This is a simulation. No actual LLM calls will be made."
    }
