from typing import List
from fastapi import APIRouter
from app.models.schemas import Lead

router = APIRouter()

MOCK_LEADS: List[Lead] = [
    Lead(id=1, name="Alice Johnson", email="alice@example.com", status="new"),
    Lead(id=2, name="Bob Smith", email="bob@example.com", status="contacted"),
    Lead(id=3, name="Charlie Brown", email="charlie@example.com", status="qualified"),
]

@router.get("/leads", response_model=List[Lead])
async def list_leads():
    return MOCK_LEADS
