"""
Lead Enrichment API Routes
Enrich leads with company and contact data
"""

from typing import List

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from app.services.enrichment_service import (
    EnrichmentResult,
    enrichment_service,
)

router = APIRouter()


class EnrichEmailRequest(BaseModel):
    """Request to enrich by email"""

    email: str


class EnrichBulkRequest(BaseModel):
    """Request to enrich multiple emails"""

    emails: List[str]


class EnrichDomainRequest(BaseModel):
    """Request to enrich a company by domain"""

    domain: str


@router.post("/email", response_model=EnrichmentResult)
async def enrich_by_email(request: EnrichEmailRequest):
    """
    Enrich a contact by email address.
    Returns company and contact data from available sources.
    """
    result = await enrichment_service.enrich_email(request.email)
    return result


@router.post("/bulk", response_model=List[EnrichmentResult])
async def enrich_bulk(request: EnrichBulkRequest):
    """
    Enrich multiple email addresses.
    Limited to 100 emails per request.
    """
    if len(request.emails) > 100:
        raise HTTPException(status_code=400, detail="Maximum 100 emails per bulk request")

    results = await enrichment_service.bulk_enrich(request.emails)
    return results


@router.post("/company", response_model=EnrichmentResult)
async def enrich_company(request: EnrichDomainRequest):
    """
    Enrich a company by domain.
    Returns company data from available sources.
    """
    result = await enrichment_service.enrich_company(request.domain)
    return result


@router.get("/lookup")
async def lookup_email(email: str = Query(..., description="Email address to look up")):
    """
    Quick lookup of an email address.
    GET endpoint for easy testing.
    """
    result = await enrichment_service.enrich_email(email)

    if not result.success:
        raise HTTPException(status_code=404, detail=result.error or "Contact not found")

    return {
        "email": email,
        "contact": result.contact,
        "company": result.company,
        "source": result.source,
        "cached": result.cached,
    }


@router.get("/company/{domain}")
async def get_company_info(domain: str):
    """
    Get company information by domain.
    """
    result = await enrichment_service.enrich_company(domain)

    if not result.success:
        raise HTTPException(status_code=404, detail=result.error or "Company not found")

    return {
        "domain": domain,
        "company": result.company,
        "source": result.source,
        "cached": result.cached,
    }


@router.get("/status")
async def enrichment_status():
    """
    Get enrichment service status and available providers.
    """
    import os

    return {
        "status": "operational",
        "providers": {
            "clearbit": bool(os.getenv("CLEARBIT_API_KEY")),
            "apollo": bool(os.getenv("APOLLO_API_KEY")),
            "hunter": bool(os.getenv("HUNTER_API_KEY")),
            "mock": True,  # Always available as fallback
        },
        "cache_size": len(enrichment_service._cache),
    }
