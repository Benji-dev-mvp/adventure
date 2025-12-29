"""
Lead Enrichment Service
Provides company and contact enrichment via multiple data sources
"""

import logging
import os
from datetime import datetime
from typing import Dict, Optional

import httpx
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class EnrichedCompany(BaseModel):
    """Enriched company data"""

    name: str
    domain: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None  # e.g., "50-200", "1000+"
    revenue: Optional[str] = None  # e.g., "$10M-$50M"
    founded: Optional[int] = None
    location: Optional[str] = None
    description: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    tech_stack: list[str] = []
    tags: list[str] = []


class EnrichedContact(BaseModel):
    """Enriched contact data"""

    email: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    title: Optional[str] = None
    seniority: Optional[str] = None  # e.g., "VP", "Director", "Manager"
    department: Optional[str] = None  # e.g., "Sales", "Engineering"
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    company: Optional[EnrichedCompany] = None


class EnrichmentResult(BaseModel):
    """Result from enrichment"""

    success: bool
    source: str  # "clearbit", "apollo", "mock", etc.
    contact: Optional[EnrichedContact] = None
    company: Optional[EnrichedCompany] = None
    credits_used: int = 0
    cached: bool = False
    enriched_at: datetime = datetime.utcnow()
    error: Optional[str] = None


class EnrichmentService:
    """
    Multi-source enrichment service
    Supports Clearbit, Apollo, and mock data for development
    """

    def __init__(self):
        self.clearbit_key = os.getenv("CLEARBIT_API_KEY")
        self.apollo_key = os.getenv("APOLLO_API_KEY")
        self.hunter_key = os.getenv("HUNTER_API_KEY")

        # In-memory cache for development
        self._cache: Dict[str, EnrichmentResult] = {}

    async def enrich_email(self, email: str) -> EnrichmentResult:
        """
        Enrich a contact by email address
        Tries multiple sources in priority order
        """
        # Check cache first
        cache_key = f"email:{email.lower()}"
        if cache_key in self._cache:
            result = self._cache[cache_key]
            result.cached = True
            return result

        # Try Clearbit first (if configured)
        if self.clearbit_key:
            result = await self._enrich_clearbit(email)
            if result.success:
                self._cache[cache_key] = result
                return result

        # Try Apollo (if configured)
        if self.apollo_key:
            result = await self._enrich_apollo(email)
            if result.success:
                self._cache[cache_key] = result
                return result

        # Fallback to mock enrichment for development
        result = await self._enrich_mock(email)
        self._cache[cache_key] = result
        return result

    async def enrich_company(self, domain: str) -> EnrichmentResult:
        """Enrich a company by domain"""
        cache_key = f"domain:{domain.lower()}"
        if cache_key in self._cache:
            result = self._cache[cache_key]
            result.cached = True
            return result

        # Try Clearbit
        if self.clearbit_key:
            result = await self._enrich_company_clearbit(domain)
            if result.success:
                self._cache[cache_key] = result
                return result

        # Fallback to mock
        result = await self._enrich_company_mock(domain)
        self._cache[cache_key] = result
        return result

    async def bulk_enrich(self, emails: list[str]) -> list[EnrichmentResult]:
        """Enrich multiple emails"""
        results = []
        for email in emails:
            result = await self.enrich_email(email)
            results.append(result)
        return results

    async def _enrich_clearbit(self, email: str) -> EnrichmentResult:
        """Enrich via Clearbit API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://person.clearbit.com/v2/combined/find",
                    params={"email": email},
                    headers={"Authorization": f"Bearer {self.clearbit_key}"},
                    timeout=10.0,
                )

                if response.status_code == 200:
                    data = response.json()
                    person = data.get("person", {})
                    company = data.get("company", {})

                    enriched_company = None
                    if company:
                        enriched_company = EnrichedCompany(
                            name=company.get("name", ""),
                            domain=company.get("domain"),
                            industry=company.get("category", {}).get("industry"),
                            size=company.get("metrics", {}).get("employeesRange"),
                            revenue=company.get("metrics", {}).get("estimatedAnnualRevenue"),
                            founded=company.get("foundedYear"),
                            location=company.get("location"),
                            description=company.get("description"),
                            linkedin_url=company.get("linkedin", {}).get("handle"),
                            twitter_url=company.get("twitter", {}).get("handle"),
                            tech_stack=company.get("tech", []),
                            tags=company.get("tags", []),
                        )

                    enriched_contact = EnrichedContact(
                        email=email,
                        first_name=person.get("name", {}).get("givenName"),
                        last_name=person.get("name", {}).get("familyName"),
                        full_name=person.get("name", {}).get("fullName"),
                        title=person.get("employment", {}).get("title"),
                        seniority=person.get("employment", {}).get("seniority"),
                        linkedin_url=person.get("linkedin", {}).get("handle"),
                        twitter_url=person.get("twitter", {}).get("handle"),
                        location=person.get("location"),
                        bio=person.get("bio"),
                        avatar_url=person.get("avatar"),
                        company=enriched_company,
                    )

                    return EnrichmentResult(
                        success=True,
                        source="clearbit",
                        contact=enriched_contact,
                        company=enriched_company,
                        credits_used=1,
                    )
                elif response.status_code == 404:
                    return EnrichmentResult(
                        success=False, source="clearbit", error="Contact not found"
                    )
                else:
                    return EnrichmentResult(
                        success=False,
                        source="clearbit",
                        error=f"API error: {response.status_code}",
                    )
        except Exception as e:
            logger.error(f"Clearbit enrichment error: {e}")
            return EnrichmentResult(success=False, source="clearbit", error=str(e))

    async def _enrich_apollo(self, email: str) -> EnrichmentResult:
        """Enrich via Apollo API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.apollo.io/v1/people/match",
                    json={"email": email},
                    headers={"X-Api-Key": self.apollo_key},
                    timeout=10.0,
                )

                if response.status_code == 200:
                    data = response.json()
                    person = data.get("person", {})
                    org = person.get("organization", {})

                    enriched_company = None
                    if org:
                        enriched_company = EnrichedCompany(
                            name=org.get("name", ""),
                            domain=org.get("primary_domain"),
                            industry=org.get("industry"),
                            size=org.get("estimated_num_employees"),
                            location=f"{org.get('city', '')}, {org.get('state', '')}",
                            linkedin_url=org.get("linkedin_url"),
                            twitter_url=org.get("twitter_url"),
                        )

                    enriched_contact = EnrichedContact(
                        email=email,
                        first_name=person.get("first_name"),
                        last_name=person.get("last_name"),
                        full_name=person.get("name"),
                        title=person.get("title"),
                        seniority=person.get("seniority"),
                        department=(
                            person.get("departments", [""])[0]
                            if person.get("departments")
                            else None
                        ),
                        phone=(
                            person.get("phone_numbers", [{}])[0].get("sanitized_number")
                            if person.get("phone_numbers")
                            else None
                        ),
                        linkedin_url=person.get("linkedin_url"),
                        location=f"{person.get('city', '')}, {person.get('state', '')}",
                        company=enriched_company,
                    )

                    return EnrichmentResult(
                        success=True,
                        source="apollo",
                        contact=enriched_contact,
                        company=enriched_company,
                        credits_used=1,
                    )
                else:
                    return EnrichmentResult(
                        success=False,
                        source="apollo",
                        error=f"API error: {response.status_code}",
                    )
        except Exception as e:
            logger.error(f"Apollo enrichment error: {e}")
            return EnrichmentResult(success=False, source="apollo", error=str(e))

    async def _enrich_mock(self, email: str) -> EnrichmentResult:
        """Mock enrichment for development/testing"""
        # Extract domain and generate mock data
        domain = email.split("@")[1] if "@" in email else "example.com"
        name_part = email.split("@")[0]

        # Generate realistic mock data
        first_name = name_part.split(".")[0].title() if "." in name_part else name_part.title()
        last_name = name_part.split(".")[-1].title() if "." in name_part else "Smith"

        mock_titles = [
            "VP of Sales",
            "Director of Marketing",
            "Head of Growth",
            "CEO",
            "CTO",
            "Sales Manager",
        ]
        mock_industries = [
            "SaaS",
            "FinTech",
            "Healthcare",
            "E-commerce",
            "Enterprise Software",
        ]
        mock_sizes = ["11-50", "51-200", "201-500", "501-1000", "1000+"]

        import hashlib

        hash_val = int(hashlib.md5(email.encode()).hexdigest(), 16)

        enriched_company = EnrichedCompany(
            name=domain.split(".")[0].title() + " Inc.",
            domain=domain,
            industry=mock_industries[hash_val % len(mock_industries)],
            size=mock_sizes[hash_val % len(mock_sizes)],
            revenue="$10M-$50M",
            founded=2015 + (hash_val % 8),
            location="San Francisco, CA",
            description=f"A leading {mock_industries[hash_val % len(mock_industries)]} company",
            linkedin_url=f"https://linkedin.com/company/{domain.split('.')[0]}",
            tech_stack=["Salesforce", "HubSpot", "Slack", "AWS"],
            tags=["B2B", "Growth Stage", "Tech"],
        )

        enriched_contact = EnrichedContact(
            email=email,
            first_name=first_name,
            last_name=last_name,
            full_name=f"{first_name} {last_name}",
            title=mock_titles[hash_val % len(mock_titles)],
            seniority=(
                "VP" if "vp" in mock_titles[hash_val % len(mock_titles)].lower() else "Director"
            ),
            department=(
                "Sales"
                if "sales" in mock_titles[hash_val % len(mock_titles)].lower()
                else "Marketing"
            ),
            phone=f"+1 (555) {100 + hash_val % 900}-{1000 + hash_val % 9000}",
            linkedin_url=f"https://linkedin.com/in/{first_name.lower()}{last_name.lower()}",
            location="San Francisco, CA",
            avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={email}",
            company=enriched_company,
        )

        return EnrichmentResult(
            success=True,
            source="mock",
            contact=enriched_contact,
            company=enriched_company,
            credits_used=0,
        )

    async def _enrich_company_clearbit(self, domain: str) -> EnrichmentResult:
        """Enrich company via Clearbit"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"https://company.clearbit.com/v2/companies/find",
                    params={"domain": domain},
                    headers={"Authorization": f"Bearer {self.clearbit_key}"},
                    timeout=10.0,
                )

                if response.status_code == 200:
                    company = response.json()
                    enriched_company = EnrichedCompany(
                        name=company.get("name", ""),
                        domain=company.get("domain"),
                        industry=company.get("category", {}).get("industry"),
                        size=company.get("metrics", {}).get("employeesRange"),
                        revenue=company.get("metrics", {}).get("estimatedAnnualRevenue"),
                        founded=company.get("foundedYear"),
                        location=company.get("location"),
                        description=company.get("description"),
                        linkedin_url=company.get("linkedin", {}).get("handle"),
                        twitter_url=company.get("twitter", {}).get("handle"),
                        tech_stack=company.get("tech", []),
                        tags=company.get("tags", []),
                    )

                    return EnrichmentResult(
                        success=True,
                        source="clearbit",
                        company=enriched_company,
                        credits_used=1,
                    )
                else:
                    return EnrichmentResult(
                        success=False,
                        source="clearbit",
                        error=f"API error: {response.status_code}",
                    )
        except Exception as e:
            return EnrichmentResult(success=False, source="clearbit", error=str(e))

    async def _enrich_company_mock(self, domain: str) -> EnrichmentResult:
        """Mock company enrichment"""
        import hashlib

        hash_val = int(hashlib.md5(domain.encode()).hexdigest(), 16)

        mock_industries = [
            "SaaS",
            "FinTech",
            "Healthcare",
            "E-commerce",
            "Enterprise Software",
        ]
        mock_sizes = ["11-50", "51-200", "201-500", "501-1000", "1000+"]

        enriched_company = EnrichedCompany(
            name=domain.split(".")[0].title() + " Inc.",
            domain=domain,
            industry=mock_industries[hash_val % len(mock_industries)],
            size=mock_sizes[hash_val % len(mock_sizes)],
            revenue="$10M-$50M",
            founded=2015 + (hash_val % 8),
            location="San Francisco, CA",
            description=f"A leading {mock_industries[hash_val % len(mock_industries)]} company",
            linkedin_url=f"https://linkedin.com/company/{domain.split('.')[0]}",
            tech_stack=["Salesforce", "HubSpot", "Slack", "AWS"],
            tags=["B2B", "Growth Stage", "Tech"],
        )

        return EnrichmentResult(
            success=True, source="mock", company=enriched_company, credits_used=0
        )


# Singleton instance
enrichment_service = EnrichmentService()
