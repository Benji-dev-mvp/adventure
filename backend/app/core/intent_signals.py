"""
Intent Signal Engine - Track job postings, funding, tech stack changes
Real-time monitoring and alerting for sales triggers
"""

import asyncio
import logging
from datetime import datetime, timedelta
from enum import Enum
from typing import Dict, List, Optional, Set

import httpx

logger = logging.getLogger(__name__)


class IntentSignalType(str, Enum):
    """Types of intent signals"""

    JOB_POSTING = "job_posting"
    FUNDING_ROUND = "funding_round"
    TECH_STACK_CHANGE = "tech_stack_change"
    LEADERSHIP_CHANGE = "leadership_change"
    PRODUCT_LAUNCH = "product_launch"
    EXPANSION = "expansion"
    PARTNERSHIP = "partnership"
    AWARD = "award"
    MEDIA_MENTION = "media_mention"
    WEBSITE_VISITOR = "website_visitor"


class IntentSignal:
    """Represents a single intent signal"""

    def __init__(
        self,
        signal_type: IntentSignalType,
        company_name: str,
        company_domain: str,
        description: str,
        source_url: str,
        confidence: float,
        metadata: Optional[Dict] = None,
    ):
        self.signal_type = signal_type
        self.company_name = company_name
        self.company_domain = company_domain
        self.description = description
        self.source_url = source_url
        self.confidence = confidence
        self.metadata = metadata or {}
        self.detected_at = datetime.utcnow()
        self.intent_score = self._calculate_intent_score()

    def _calculate_intent_score(self) -> int:
        """Calculate intent score (0-100) based on signal type and recency"""
        base_scores = {
            IntentSignalType.FUNDING_ROUND: 90,
            IntentSignalType.JOB_POSTING: 80,
            IntentSignalType.LEADERSHIP_CHANGE: 75,
            IntentSignalType.TECH_STACK_CHANGE: 70,
            IntentSignalType.PRODUCT_LAUNCH: 65,
            IntentSignalType.EXPANSION: 60,
            IntentSignalType.PARTNERSHIP: 55,
            IntentSignalType.AWARD: 50,
            IntentSignalType.MEDIA_MENTION: 45,
            IntentSignalType.WEBSITE_VISITOR: 40,
        }

        base_score = base_scores.get(self.signal_type, 50)

        # Adjust for confidence
        score = base_score * self.confidence

        # Decay based on time (signals lose value over time)
        age_days = (datetime.utcnow() - self.detected_at).days
        decay_factor = max(0.5, 1.0 - (age_days / 90))  # 50% value after 90 days

        return int(score * decay_factor)

    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "signal_type": self.signal_type,
            "company_name": self.company_name,
            "company_domain": self.company_domain,
            "description": self.description,
            "source_url": self.source_url,
            "confidence": self.confidence,
            "intent_score": self.intent_score,
            "detected_at": self.detected_at.isoformat(),
            "metadata": self.metadata,
        }


class IntentSignalEngine:
    """
    Intent Signal Engine - Monitors multiple sources for buying signals

    In production, you'd integrate with:
    - LinkedIn API (job postings)
    - Crunchbase API (funding)
    - BuiltWith API (tech stack)
    - News APIs (TechCrunch, PR Newswire)
    - Web scraping (company career pages)
    """

    def __init__(self):
        self.signals_cache: Dict[str, List[IntentSignal]] = {}
        self.tracked_companies: Set[str] = set()
        self.http_client = httpx.AsyncClient(timeout=30.0)

    async def track_company(self, company_domain: str, company_name: str):
        """Start tracking a company for intent signals"""
        self.tracked_companies.add(company_domain)
        logger.info(f"Now tracking intent signals for {company_name} ({company_domain})")

    async def get_signals(self, company_domain: str, min_score: int = 0) -> List[IntentSignal]:
        """Get all intent signals for a company"""
        signals = self.signals_cache.get(company_domain, [])
        return [s for s in signals if s.intent_score >= min_score]

    async def scan_job_postings(self, company_domain: str, company_name: str) -> List[IntentSignal]:
        """
        Scan for job postings (indicates growth/hiring)

        Production implementation would:
        - Use LinkedIn Jobs API
        - Scrape company career pages
        - Monitor Indeed, Greenhouse, Lever
        """
        signals = []

        # Mock implementation - replace with real API calls
        # Example: LinkedIn Jobs API
        # url = f"https://api.linkedin.com/v2/jobs?company={company_name}"

        # Simulated job posting detection
        mock_job_titles = [
            "VP of Sales",
            "Sales Development Representative",
            "Account Executive",
            "Head of Growth",
            "Chief Revenue Officer",
        ]

        for title in mock_job_titles[:2]:  # Simulate finding 2 jobs
            signal = IntentSignal(
                signal_type=IntentSignalType.JOB_POSTING,
                company_name=company_name,
                company_domain=company_domain,
                description=f"Hiring for {title} position - indicates sales team expansion",
                source_url=f"https://linkedin.com/jobs/{company_domain}",
                confidence=0.9,
                metadata={
                    "job_title": title,
                    "department": "Sales",
                    "posted_date": (datetime.utcnow() - timedelta(days=3)).isoformat(),
                },
            )
            signals.append(signal)

        logger.info(f"Found {len(signals)} job posting signals for {company_name}")
        return signals

    async def scan_funding_rounds(
        self, company_domain: str, company_name: str
    ) -> List[IntentSignal]:
        """
        Monitor funding announcements (high intent signal)

        Production sources:
        - Crunchbase API
        - TechCrunch RSS
        - AngelList
        - Company press releases
        """
        signals = []

        # Mock implementation - replace with Crunchbase API
        # Example: GET https://api.crunchbase.com/v4/entities/organizations/{company}?card_ids=funding_rounds

        # Simulated funding detection
        funding_data = {
            "round_type": "Series B",
            "amount": "$25M",
            "lead_investor": "Sequoia Capital",
            "announced_date": (datetime.utcnow() - timedelta(days=7)).isoformat(),
        }

        signal = IntentSignal(
            signal_type=IntentSignalType.FUNDING_ROUND,
            company_name=company_name,
            company_domain=company_domain,
            description=f"Raised {funding_data['amount']} {funding_data['round_type']} led by {funding_data['lead_investor']}",
            source_url=f"https://crunchbase.com/organization/{company_domain}",
            confidence=0.95,
            metadata=funding_data,
        )
        signals.append(signal)

        logger.info(f"Found {len(signals)} funding signals for {company_name}")
        return signals

    async def scan_tech_stack_changes(
        self, company_domain: str, company_name: str
    ) -> List[IntentSignal]:
        """
        Detect technology stack changes (adding/removing tools)

        Production sources:
        - BuiltWith API
        - Wappalyzer
        - Datanyze
        - Website scraping
        """
        signals = []

        # Mock implementation - replace with BuiltWith API
        # Example: GET https://api.builtwith.com/v20/api.json?KEY={key}&LOOKUP={domain}

        # Simulated tech stack change
        changes = [
            {
                "technology": "Salesforce",
                "change_type": "added",
                "category": "CRM",
                "detected_date": (datetime.utcnow() - timedelta(days=14)).isoformat(),
            },
            {
                "technology": "HubSpot",
                "change_type": "removed",
                "category": "Marketing Automation",
                "detected_date": (datetime.utcnow() - timedelta(days=30)).isoformat(),
            },
        ]

        for change in changes:
            signal = IntentSignal(
                signal_type=IntentSignalType.TECH_STACK_CHANGE,
                company_name=company_name,
                company_domain=company_domain,
                description=f"{change['change_type'].title()} {change['technology']} ({change['category']})",
                source_url=f"https://builtwith.com/{company_domain}",
                confidence=0.85,
                metadata=change,
            )
            signals.append(signal)

        logger.info(f"Found {len(signals)} tech stack signals for {company_name}")
        return signals

    async def scan_leadership_changes(
        self, company_domain: str, company_name: str
    ) -> List[IntentSignal]:
        """
        Track leadership changes (new C-level hires often mean new initiatives)

        Production sources:
        - LinkedIn API (job changes)
        - Company press releases
        - News APIs
        """
        signals = []

        # Mock implementation
        change = {
            "person_name": "Jane Smith",
            "new_title": "Chief Revenue Officer",
            "previous_company": "Salesforce",
            "start_date": (datetime.utcnow() - timedelta(days=21)).isoformat(),
        }

        signal = IntentSignal(
            signal_type=IntentSignalType.LEADERSHIP_CHANGE,
            company_name=company_name,
            company_domain=company_domain,
            description=f"New {change['new_title']}: {change['person_name']} (from {change['previous_company']})",
            source_url=f"https://linkedin.com/company/{company_domain}/posts",
            confidence=0.88,
            metadata=change,
        )
        signals.append(signal)

        return signals

    async def scan_all_signals(self, company_domain: str, company_name: str) -> List[IntentSignal]:
        """Scan all signal sources for a company"""
        # Run all scanners in parallel
        results = await asyncio.gather(
            self.scan_job_postings(company_domain, company_name),
            self.scan_funding_rounds(company_domain, company_name),
            self.scan_tech_stack_changes(company_domain, company_name),
            self.scan_leadership_changes(company_domain, company_name),
            return_exceptions=True,
        )

        # Flatten results
        all_signals = []
        for result in results:
            if isinstance(result, list):
                all_signals.extend(result)
            elif isinstance(result, Exception):
                logger.error(f"Error scanning signals: {result}")

        # Cache signals
        self.signals_cache[company_domain] = all_signals

        return all_signals

    def calculate_company_intent_score(self, company_domain: str) -> Dict:
        """
        Calculate overall intent score for a company (0-100)
        Based on all detected signals
        """
        signals = self.signals_cache.get(company_domain, [])

        if not signals:
            return {
                "company_domain": company_domain,
                "intent_score": 0,
                "signal_count": 0,
                "top_signals": [],
            }

        # Weighted average of signal scores
        total_score = sum(s.intent_score for s in signals)
        max_possible = len(signals) * 100
        intent_score = int((total_score / max_possible) * 100) if max_possible > 0 else 0

        # Boost score if multiple high-value signals
        if len([s for s in signals if s.intent_score >= 70]) >= 2:
            intent_score = min(100, intent_score + 15)

        # Get top 3 signals
        top_signals = sorted(signals, key=lambda s: s.intent_score, reverse=True)[:3]

        return {
            "company_domain": company_domain,
            "intent_score": intent_score,
            "signal_count": len(signals),
            "top_signals": [s.to_dict() for s in top_signals],
            "breakdown": {
                "job_postings": len(
                    [s for s in signals if s.signal_type == IntentSignalType.JOB_POSTING]
                ),
                "funding": len(
                    [s for s in signals if s.signal_type == IntentSignalType.FUNDING_ROUND]
                ),
                "tech_changes": len(
                    [s for s in signals if s.signal_type == IntentSignalType.TECH_STACK_CHANGE]
                ),
                "leadership": len(
                    [s for s in signals if s.signal_type == IntentSignalType.LEADERSHIP_CHANGE]
                ),
            },
        }

    async def get_high_intent_companies(self, min_score: int = 70) -> List[Dict]:
        """Get all companies with high intent scores"""
        results = []

        for domain in self.tracked_companies:
            score_data = self.calculate_company_intent_score(domain)
            if score_data["intent_score"] >= min_score:
                results.append(score_data)

        return sorted(results, key=lambda x: x["intent_score"], reverse=True)

    async def close(self):
        """Clean up resources"""
        await self.http_client.aclose()


# Global instance
intent_engine = IntentSignalEngine()


async def track_company_intent(company_domain: str, company_name: str) -> Dict:
    """Track a company and get initial intent signals"""
    await intent_engine.track_company(company_domain, company_name)
    await intent_engine.scan_all_signals(company_domain, company_name)
    return intent_engine.calculate_company_intent_score(company_domain)


async def get_company_intent_score(company_domain: str) -> Dict:
    """Get cached intent score for a company"""
    return intent_engine.calculate_company_intent_score(company_domain)


async def get_high_intent_accounts(min_score: int = 70) -> List[Dict]:
    """Get all accounts showing high buying intent"""
    return await intent_engine.get_high_intent_companies(min_score)
