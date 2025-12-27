"""
Advanced analytics and machine learning features
Includes predictive analytics, lead scoring ML, and recommendation engine
"""
import numpy as np
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum


class PredictionModel(Enum):
    """Available ML models"""
    LINEAR_REGRESSION = "linear_regression"
    RANDOM_FOREST = "random_forest"
    GRADIENT_BOOSTING = "gradient_boosting"
    NEURAL_NETWORK = "neural_network"


@dataclass
class PredictionResult:
    """Result from prediction model"""
    value: float
    confidence: float
    model: str
    features_used: List[str]
    timestamp: datetime


class LeadScoringML:
    """Machine learning-based lead scoring"""
    
    def __init__(self):
        self.feature_weights = {
            'company_size': 0.20,
            'industry_match': 0.15,
            'engagement_score': 0.25,
            'email_opens': 0.10,
            'link_clicks': 0.15,
            'response_time': 0.10,
            'title_seniority': 0.05
        }
    
    def calculate_score(self, lead_data: Dict) -> int:
        """
        Calculate ML-based lead score (0-100)
        
        In production, this would use a trained model (sklearn, tensorflow, etc.)
        For now, using weighted features
        """
        score = 0.0
        
        # Company size factor
        company_size = lead_data.get('company_size', 0)
        if company_size > 1000:
            score += self.feature_weights['company_size'] * 100
        elif company_size > 100:
            score += self.feature_weights['company_size'] * 70
        elif company_size > 10:
            score += self.feature_weights['company_size'] * 40
        
        # Industry match
        target_industries = lead_data.get('target_industries', [])
        if lead_data.get('industry') in target_industries:
            score += self.feature_weights['industry_match'] * 100
        
        # Engagement score
        engagement = lead_data.get('engagement_score', 0)
        score += self.feature_weights['engagement_score'] * engagement
        
        # Email behavior
        email_opens = min(lead_data.get('email_opens', 0), 10) / 10
        score += self.feature_weights['email_opens'] * email_opens * 100
        
        link_clicks = min(lead_data.get('link_clicks', 0), 5) / 5
        score += self.feature_weights['link_clicks'] * link_clicks * 100
        
        # Response time (faster is better)
        avg_response_hours = lead_data.get('avg_response_hours', 48)
        if avg_response_hours < 2:
            score += self.feature_weights['response_time'] * 100
        elif avg_response_hours < 24:
            score += self.feature_weights['response_time'] * 50
        
        # Title seniority
        title = lead_data.get('title', '').lower()
        senior_titles = ['ceo', 'cto', 'cfo', 'vp', 'director', 'head']
        if any(t in title for t in senior_titles):
            score += self.feature_weights['title_seniority'] * 100
        
        return min(int(score), 100)
    
    def predict_conversion_probability(self, lead_data: Dict) -> float:
        """Predict probability of conversion (0.0-1.0)"""
        score = self.calculate_score(lead_data)
        # Simple sigmoid transformation
        return 1 / (1 + np.exp(-((score - 50) / 15)))
    
    def recommend_next_action(self, lead_data: Dict) -> str:
        """Recommend next best action for a lead"""
        score = self.calculate_score(lead_data)
        engagement = lead_data.get('engagement_score', 0)
        last_contact = lead_data.get('last_contacted')
        
        if score > 80:
            return "schedule_call"
        elif score > 60:
            if engagement > 50:
                return "send_personalized_demo"
            else:
                return "send_case_study"
        elif score > 40:
            if last_contact and (datetime.now() - last_contact).days > 7:
                return "send_followup_email"
            else:
                return "nurture_with_content"
        else:
            return "continue_nurturing"


class PredictiveAnalytics:
    """Predictive analytics for campaigns and revenue"""
    
    @staticmethod
    def forecast_campaign_performance(
        historical_data: List[Dict],
        days_ahead: int = 30
    ) -> Dict:
        """
        Forecast campaign performance
        
        Args:
            historical_data: List of past campaign metrics
            days_ahead: Number of days to forecast
        
        Returns:
            Dictionary with predictions
        """
        if not historical_data:
            return {
                'predicted_sends': 0,
                'predicted_opens': 0,
                'predicted_clicks': 0,
                'predicted_conversions': 0,
                'confidence': 0.0
            }
        
        # Calculate averages (simplified - would use time series model in production)
        avg_sends = np.mean([d.get('sends', 0) for d in historical_data])
        avg_open_rate = np.mean([d.get('open_rate', 0) for d in historical_data])
        avg_click_rate = np.mean([d.get('click_rate', 0) for d in historical_data])
        avg_conversion_rate = np.mean([d.get('conversion_rate', 0) for d in historical_data])
        
        # Apply growth factor
        growth_factor = 1.0 + (days_ahead / 365) * 0.1  # Assume 10% annual growth
        
        predicted_sends = int(avg_sends * growth_factor)
        predicted_opens = int(predicted_sends * avg_open_rate)
        predicted_clicks = int(predicted_opens * avg_click_rate)
        predicted_conversions = int(predicted_clicks * avg_conversion_rate)
        
        # Confidence based on data volume
        confidence = min(len(historical_data) / 10, 1.0)
        
        return {
            'predicted_sends': predicted_sends,
            'predicted_opens': predicted_opens,
            'predicted_clicks': predicted_clicks,
            'predicted_conversions': predicted_conversions,
            'predicted_open_rate': avg_open_rate,
            'predicted_click_rate': avg_click_rate,
            'predicted_conversion_rate': avg_conversion_rate,
            'confidence': confidence,
            'forecast_period_days': days_ahead
        }
    
    @staticmethod
    def predict_revenue(
        historical_revenue: List[float],
        days_ahead: int = 90
    ) -> PredictionResult:
        """
        Predict future revenue using linear regression
        
        In production, would use more sophisticated models like ARIMA, Prophet, or LSTM
        """
        if len(historical_revenue) < 2:
            return PredictionResult(
                value=0.0,
                confidence=0.0,
                model="insufficient_data",
                features_used=[],
                timestamp=datetime.now()
            )
        
        # Simple linear regression
        x = np.arange(len(historical_revenue))
        y = np.array(historical_revenue)
        
        # Calculate slope and intercept
        slope = np.polyfit(x, y, 1)[0]
        intercept = np.mean(y) - slope * np.mean(x)
        
        # Predict
        future_x = len(historical_revenue) + (days_ahead / 30)  # Convert days to months
        predicted_value = slope * future_x + intercept
        
        # Calculate confidence (R-squared)
        y_pred = slope * x + intercept
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - np.mean(y)) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot > 0 else 0
        
        return PredictionResult(
            value=max(predicted_value, 0),
            confidence=r_squared,
            model=PredictionModel.LINEAR_REGRESSION.value,
            features_used=['historical_revenue', 'time_period'],
            timestamp=datetime.now()
        )


class AnomalyDetector:
    """Detect anomalies in campaign and lead data"""
    
    @staticmethod
    def detect_performance_anomalies(
        metrics: List[Dict],
        threshold_std: float = 2.0
    ) -> List[Dict]:
        """
        Detect anomalies using statistical methods
        
        Args:
            metrics: List of metric dictionaries
            threshold_std: Number of standard deviations for anomaly threshold
        
        Returns:
            List of detected anomalies
        """
        anomalies = []
        
        if len(metrics) < 5:
            return anomalies
        
        # Extract values for each metric type
        metric_types = set()
        for m in metrics:
            metric_types.update(m.keys())
        
        for metric_type in metric_types:
            if metric_type in ['date', 'timestamp', 'id']:
                continue
            
            values = [m.get(metric_type, 0) for m in metrics]
            mean = np.mean(values)
            std = np.std(values)
            
            if std == 0:
                continue
            
            # Check for anomalies
            for i, value in enumerate(values):
                z_score = abs((value - mean) / std)
                if z_score > threshold_std:
                    anomalies.append({
                        'index': i,
                        'metric': metric_type,
                        'value': value,
                        'expected_range': (mean - threshold_std * std, mean + threshold_std * std),
                        'z_score': z_score,
                        'severity': 'high' if z_score > 3 else 'medium'
                    })
        
        return anomalies
    
    @staticmethod
    def detect_sudden_changes(
        time_series: List[Tuple[datetime, float]],
        change_threshold: float = 0.5
    ) -> List[Dict]:
        """
        Detect sudden changes in time series data
        
        Args:
            time_series: List of (timestamp, value) tuples
            change_threshold: Minimum percentage change to flag (0.5 = 50%)
        
        Returns:
            List of detected changes
        """
        changes = []
        
        for i in range(1, len(time_series)):
            prev_value = time_series[i-1][1]
            curr_value = time_series[i][1]
            
            if prev_value == 0:
                continue
            
            change_pct = abs((curr_value - prev_value) / prev_value)
            
            if change_pct > change_threshold:
                changes.append({
                    'timestamp': time_series[i][0],
                    'previous_value': prev_value,
                    'current_value': curr_value,
                    'change_percent': change_pct * 100,
                    'direction': 'increase' if curr_value > prev_value else 'decrease'
                })
        
        return changes


class RecommendationEngine:
    """Recommendation engine for campaigns and content"""
    
    @staticmethod
    def recommend_best_send_time(
        lead_timezone: str,
        historical_opens: List[Dict]
    ) -> Dict:
        """Recommend best time to send email to a lead"""
        # Analyze historical open times
        if not historical_opens:
            # Default to Tuesday 10 AM
            return {
                'day_of_week': 'Tuesday',
                'hour': 10,
                'confidence': 0.5,
                'reason': 'Industry best practice'
            }
        
        # Extract hours from opens
        hours = [datetime.fromisoformat(o['opened_at']).hour for o in historical_opens]
        
        # Find most common hour
        hour_counts = {}
        for hour in hours:
            hour_counts[hour] = hour_counts.get(hour, 0) + 1
        
        best_hour = max(hour_counts, key=hour_counts.get)
        confidence = hour_counts[best_hour] / len(hours)
        
        return {
            'day_of_week': 'Tuesday',  # Would analyze day patterns in production
            'hour': best_hour,
            'confidence': confidence,
            'reason': f'Based on {len(historical_opens)} historical opens'
        }
    
    @staticmethod
    def recommend_email_subject(
        lead_data: Dict,
        campaign_objective: str
    ) -> List[str]:
        """Recommend email subject lines based on lead data and campaign"""
        recommendations = []
        
        company = lead_data.get('company', '')
        industry = lead_data.get('industry', '')
        name = lead_data.get('name', '').split()[0]
        
        if campaign_objective == 'demo':
            recommendations = [
                f"{name}, see how {company} can boost revenue by 30%",
                f"Quick question about {company}'s growth strategy",
                f"{company} + Our Platform = Success Story"
            ]
        elif campaign_objective == 'nurture':
            recommendations = [
                f"{name}, thought this would interest you",
                f"Resources for {industry} leaders like you",
                f"{company}'s guide to {industry} success"
            ]
        else:
            recommendations = [
                f"Partnership opportunity for {company}",
                f"{name}, let's discuss {company}'s goals",
                f"How we can help {company} succeed"
            ]
        
        return recommendations


# Global instances
lead_scorer = LeadScoringML()
predictor = PredictiveAnalytics()
anomaly_detector = AnomalyDetector()
recommender = RecommendationEngine()
