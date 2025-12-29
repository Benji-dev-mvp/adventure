"""
Advanced ML Features.
Churn prediction, next-best-action recommendation, sentiment analysis, and lookalike modeling.
"""

import logging
from datetime import datetime
from typing import Any, Dict, List

logger = logging.getLogger(__name__)


class ChurnPrediction:
    """Predict customer churn risk"""

    @staticmethod
    def predict_churn(customer_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict churn probability for customer.

        Features:
        - Days since last activity
        - Email engagement rate
        - Meeting attendance rate
        - Response time trend
        - Deal value trend
        """
        features = ChurnPrediction._extract_features(customer_data)

        # In production: load trained model
        # model = joblib.load('models/churn_model.pkl')
        # churn_prob = model.predict_proba([features])[0][1]

        # Simulate prediction
        churn_prob = ChurnPrediction._simulate_churn_score(features)

        risk_level = "high" if churn_prob > 0.7 else "medium" if churn_prob > 0.4 else "low"

        # Generate reasons
        reasons = ChurnPrediction._explain_churn_risk(features, customer_data)

        return {
            "churn_probability": round(churn_prob, 3),
            "risk_level": risk_level,
            "reasons": reasons,
            "recommended_actions": ChurnPrediction._recommend_actions(churn_prob, reasons),
            "predicted_at": datetime.now().isoformat(),
        }

    @staticmethod
    def _extract_features(data: Dict) -> List[float]:
        """Extract features for model"""
        return [
            data.get("days_since_last_activity", 30),
            data.get("email_open_rate", 0.2),
            data.get("email_click_rate", 0.1),
            data.get("meeting_attendance_rate", 0.5),
            data.get("response_time_days", 2),
            data.get("deal_value_trend", 0),  # -1 declining, 0 stable, 1 growing
            data.get("support_tickets_last_month", 0),
            data.get("feature_adoption_score", 0.5),
        ]

    @staticmethod
    def _simulate_churn_score(features: List[float]) -> float:
        """Simulate churn prediction"""
        days_inactive = features[0]
        engagement = (features[1] + features[2]) / 2

        # Simple heuristic
        base_score = min(days_inactive / 60, 1.0)  # Normalize days
        engagement_penalty = (1 - engagement) * 0.5

        return min(base_score + engagement_penalty, 1.0)

    @staticmethod
    def _explain_churn_risk(features: List[float], data: Dict) -> List[str]:
        """Generate human-readable reasons"""
        reasons = []

        if features[0] > 14:
            reasons.append(f"No activity for {int(features[0])} days")
        if features[1] < 0.2:
            reasons.append(f"Low email engagement ({features[1]:.1%})")
        if features[6] > 3:
            reasons.append(f"{int(features[6])} support tickets last month")
        if features[5] < 0:
            reasons.append("Deal value declining")

        return reasons or ["Normal engagement patterns"]

    @staticmethod
    def _recommend_actions(churn_prob: float, reasons: List[str]) -> List[str]:
        """Recommend retention actions"""
        if churn_prob < 0.3:
            return ["Continue regular nurturing"]

        actions = []
        if any("activity" in r.lower() for r in reasons):
            actions.append("Schedule re-engagement call")
        if any("engagement" in r.lower() for r in reasons):
            actions.append("Send personalized value content")
        if any("support" in r.lower() for r in reasons):
            actions.append("Executive check-in call")
        if any("declining" in r.lower() for r in reasons):
            actions.append("Discuss expansion opportunities")

        return actions or ["Schedule check-in meeting", "Review account health"]


class NextBestAction:
    """Recommend next-best action for lead/customer"""

    ACTION_TYPES = [
        "email",
        "call",
        "linkedin",
        "meeting",
        "demo",
        "proposal",
        "follow_up",
    ]

    @staticmethod
    def recommend(lead_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Recommend next best action based on lead state.

        Considers:
        - Current stage in funnel
        - Last interaction type and recency
        - Engagement history
        - Lead score
        - Industry/persona patterns
        """
        # Extract signals
        stage = lead_data.get("stage", "prospect")
        days_since_contact = lead_data.get("days_since_last_contact", 0)
        last_action = lead_data.get("last_action_type", None)
        lead_score = lead_data.get("score", 50)
        email_engagement = lead_data.get("email_open_rate", 0)

        # Decision logic
        if stage == "prospect":
            if days_since_contact == 0:
                action = "email"
                reason = "Initial outreach"
            elif days_since_contact < 3:
                action = "wait"
                reason = "Recently contacted, allow time to respond"
            else:
                action = "follow_up"
                reason = "Follow up on initial email"

        elif stage == "engaged":
            if email_engagement > 0.5 and lead_score > 70:
                action = "call"
                reason = "High engagement, ready for conversation"
            elif last_action == "email":
                action = "linkedin"
                reason = "Multi-channel approach"
            else:
                action = "meeting"
                reason = "Schedule discovery call"

        elif stage == "qualified":
            if last_action != "demo":
                action = "demo"
                reason = "Show product value"
            else:
                action = "proposal"
                reason = "Move to close"

        else:
            action = "email"
            reason = "Re-engage"

        # Calculate timing
        optimal_time = NextBestAction._calculate_optimal_time(lead_data)

        # Generate message template
        template = NextBestAction._get_message_template(action, lead_data)

        return {
            "recommended_action": action,
            "confidence": 0.85,
            "reason": reason,
            "optimal_timing": optimal_time,
            "message_template": template,
            "alternative_actions": NextBestAction._get_alternatives(action),
        }

    @staticmethod
    def _calculate_optimal_time(lead_data: Dict) -> Dict[str, Any]:
        """Calculate best time to take action"""
        # In production: analyze historical engagement patterns
        return {
            "recommended_day": "Tuesday",
            "recommended_hour": 10,
            "timezone": lead_data.get("timezone", "America/New_York"),
            "reasoning": "Highest response rates on Tuesday mornings",
        }

    @staticmethod
    def _get_message_template(action: str, lead_data: Dict) -> str:
        """Get template for action type"""
        templates = {
            "email": "Hi {name}, I noticed your company is working on {pain_point}...",
            "call": "Schedule 15-min call to discuss {value_prop}",
            "linkedin": "Connect on LinkedIn - shared interest in {topic}",
            "meeting": "Let's schedule a discovery call",
            "demo": "See {product} in action - personalized demo",
            "proposal": "Custom proposal for {company}",
            "follow_up": "Following up on our last conversation",
        }
        return templates.get(action, "Reach out to prospect")

    @staticmethod
    def _get_alternatives(primary_action: str) -> List[Dict[str, Any]]:
        """Get alternative actions"""
        alternatives = {
            "email": [
                {"action": "linkedin", "confidence": 0.75},
                {"action": "call", "confidence": 0.65},
            ],
            "call": [
                {"action": "email", "confidence": 0.80},
                {"action": "linkedin", "confidence": 0.70},
            ],
        }
        return alternatives.get(primary_action, [])


class SentimentAnalysis:
    """Analyze sentiment of email replies and messages"""

    @staticmethod
    def analyze(text: str) -> Dict[str, Any]:
        """
        Analyze sentiment and emotional tone.

        Returns:
        - Sentiment: positive, negative, neutral
        - Score: -1.0 to 1.0
        - Emotions: joy, anger, frustration, enthusiasm, etc.
        - Intent: interested, not_interested, needs_info, objection
        """
        # In production: use transformer model (BERT, RoBERTa)
        # or API (OpenAI, HuggingFace)

        # Simulate analysis
        text_lower = text.lower()

        # Simple keyword matching (production would use ML)
        positive_keywords = [
            "great",
            "interested",
            "excited",
            "love",
            "perfect",
            "yes",
            "definitely",
        ]
        negative_keywords = [
            "not interested",
            "no thanks",
            "busy",
            "unsubscribe",
            "stop",
            "never",
        ]
        question_keywords = ["how", "what", "when", "where", "why", "tell me", "?"]

        pos_count = sum(1 for word in positive_keywords if word in text_lower)
        neg_count = sum(1 for word in negative_keywords if word in text_lower)
        has_questions = any(word in text_lower for word in question_keywords)

        # Determine sentiment
        if neg_count > pos_count:
            sentiment = "negative"
            score = -0.7
            intent = "not_interested"
        elif pos_count > neg_count:
            sentiment = "positive"
            score = 0.8
            intent = "interested"
        elif has_questions:
            sentiment = "neutral"
            score = 0.3
            intent = "needs_info"
        else:
            sentiment = "neutral"
            score = 0.0
            intent = "neutral"

        return {
            "sentiment": sentiment,
            "score": score,
            "intent": intent,
            "confidence": 0.75,
            "key_phrases": SentimentAnalysis._extract_key_phrases(text),
            "recommended_response": SentimentAnalysis._suggest_response(intent),
        }

    @staticmethod
    def _extract_key_phrases(text: str) -> List[str]:
        """Extract important phrases"""
        # In production: use NLP extraction
        sentences = text.split(".")[:3]
        return [s.strip() for s in sentences if s.strip()]

    @staticmethod
    def _suggest_response(intent: str) -> str:
        """Suggest response strategy"""
        suggestions = {
            "interested": "Schedule follow-up meeting, share relevant case study",
            "not_interested": "Respectfully acknowledge, add to long-term nurture",
            "needs_info": "Provide detailed information, offer demo",
            "neutral": "Continue conversation, ask qualifying questions",
        }
        return suggestions.get(intent, "Continue engagement")


class LookalikeModeling:
    """Find similar leads based on successful conversions"""

    @staticmethod
    def find_lookalikes(
        source_lead_ids: List[int], candidate_pool: List[Dict], top_n: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Find lookalike leads similar to high-value customers.

        Uses features like:
        - Company size
        - Industry
        - Tech stack
        - Engagement patterns
        - Job title
        """
        # In production: use embeddings or ML similarity

        # Get source leads profile
        source_profile = LookalikeModeling._create_profile(source_lead_ids)

        # Score candidates
        scored_candidates = []
        for candidate in candidate_pool:
            similarity_score = LookalikeModeling._calculate_similarity(source_profile, candidate)
            scored_candidates.append({**candidate, "similarity_score": similarity_score})

        # Sort and return top N
        scored_candidates.sort(key=lambda x: x["similarity_score"], reverse=True)

        return scored_candidates[:top_n]

    @staticmethod
    def _create_profile(lead_ids: List[int]) -> Dict[str, Any]:
        """Create aggregate profile from source leads"""
        # In production: query database and aggregate
        return {
            "avg_company_size": 500,
            "common_industries": ["SaaS", "Technology"],
            "common_titles": ["VP", "Director", "Manager"],
            "tech_stack": ["Salesforce", "HubSpot"],
            "avg_engagement_score": 0.75,
        }

    @staticmethod
    def _calculate_similarity(profile: Dict, candidate: Dict) -> float:
        """Calculate similarity score"""
        score = 0.0

        # Company size similarity
        if "company_size" in candidate:
            size_diff = abs(profile["avg_company_size"] - candidate["company_size"])
            score += max(0, 1 - (size_diff / 1000)) * 0.3

        # Industry match
        if candidate.get("industry") in profile["common_industries"]:
            score += 0.3

        # Title match
        if any(title in candidate.get("title", "") for title in profile["common_titles"]):
            score += 0.2

        # Tech stack overlap
        candidate_stack = set(candidate.get("tech_stack", []))
        profile_stack = set(profile["tech_stack"])
        if candidate_stack and profile_stack:
            overlap = len(candidate_stack & profile_stack) / len(profile_stack)
            score += overlap * 0.2

        return min(score, 1.0)
