"""
A/B Testing Framework for campaigns, email templates, and landing pages
Provides statistical analysis and confidence intervals
"""

from dataclasses import dataclass
from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Tuple

import numpy as np
from scipy import stats


class VariantStatus(str, Enum):
    """Status of A/B test variant"""

    DRAFT = "draft"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    WINNER = "winner"


@dataclass
class Variant:
    """A/B test variant"""

    id: str
    name: str
    description: str
    content: Dict
    traffic_allocation: float  # 0.0 to 1.0
    status: VariantStatus

    # Metrics
    impressions: int = 0
    clicks: int = 0
    conversions: int = 0
    revenue: float = 0.0

    # Calculated metrics
    click_rate: float = 0.0
    conversion_rate: float = 0.0
    revenue_per_visitor: float = 0.0

    def update_metrics(self):
        """Calculate derived metrics"""
        if self.impressions > 0:
            self.click_rate = self.clicks / self.impressions
            self.conversion_rate = self.conversions / self.impressions
            self.revenue_per_visitor = self.revenue / self.impressions


@dataclass
class ABTest:
    """A/B Test configuration and results"""

    id: str
    name: str
    description: str
    hypothesis: str
    variants: List[Variant]

    # Test configuration
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    min_sample_size: int = 1000
    confidence_level: float = 0.95

    # Primary metric
    primary_metric: str = "conversion_rate"  # click_rate, conversion_rate, revenue_per_visitor

    # Test status
    status: str = "draft"
    winner: Optional[str] = None


class ABTestEngine:
    """A/B Testing engine with statistical analysis"""

    @staticmethod
    def calculate_z_score(
        control_conversions: int,
        control_total: int,
        variant_conversions: int,
        variant_total: int,
    ) -> float:
        """Calculate z-score for two proportions"""
        if control_total == 0 or variant_total == 0:
            return 0.0

        p1 = control_conversions / control_total
        p2 = variant_conversions / variant_total

        # Pooled proportion
        p_pool = (control_conversions + variant_conversions) / (control_total + variant_total)

        # Standard error
        se = np.sqrt(p_pool * (1 - p_pool) * (1 / control_total + 1 / variant_total))

        if se == 0:
            return 0.0

        z_score = (p2 - p1) / se
        return z_score

    @staticmethod
    def calculate_confidence_interval(
        conversions: int, total: int, confidence_level: float = 0.95
    ) -> Tuple[float, float]:
        """Calculate confidence interval for conversion rate"""
        if total == 0:
            return (0.0, 0.0)

        proportion = conversions / total
        z_critical = stats.norm.ppf((1 + confidence_level) / 2)

        se = np.sqrt(proportion * (1 - proportion) / total)
        margin = z_critical * se

        lower = max(0, proportion - margin)
        upper = min(1, proportion + margin)

        return (lower, upper)

    @staticmethod
    def calculate_statistical_significance(
        control: Variant, variant: Variant, confidence_level: float = 0.95
    ) -> Dict:
        """
        Calculate statistical significance between control and variant

        Returns:
            Dict with significance results
        """
        z_score = ABTestEngine.calculate_z_score(
            control.conversions,
            control.impressions,
            variant.conversions,
            variant.impressions,
        )

        # Two-tailed p-value
        p_value = 2 * (1 - stats.norm.cdf(abs(z_score)))

        # Is significant?
        is_significant = p_value < (1 - confidence_level)

        # Confidence intervals
        control_ci = ABTestEngine.calculate_confidence_interval(
            control.conversions, control.impressions, confidence_level
        )
        variant_ci = ABTestEngine.calculate_confidence_interval(
            variant.conversions, variant.impressions, confidence_level
        )

        # Relative lift
        control_rate = control.conversion_rate
        variant_rate = variant.conversion_rate

        if control_rate > 0:
            relative_lift = ((variant_rate - control_rate) / control_rate) * 100
        else:
            relative_lift = 0.0

        return {
            "z_score": z_score,
            "p_value": p_value,
            "is_significant": is_significant,
            "confidence_level": confidence_level,
            "control": {
                "conversion_rate": control_rate,
                "confidence_interval": control_ci,
            },
            "variant": {
                "conversion_rate": variant_rate,
                "confidence_interval": variant_ci,
            },
            "relative_lift": relative_lift,
            "absolute_difference": variant_rate - control_rate,
        }

    @staticmethod
    def calculate_sample_size(
        baseline_rate: float,
        minimum_detectable_effect: float,
        confidence_level: float = 0.95,
        power: float = 0.8,
    ) -> int:
        """
        Calculate required sample size per variant

        Args:
            baseline_rate: Current conversion rate (0.0 - 1.0)
            minimum_detectable_effect: Minimum lift to detect (e.g., 0.1 for 10%)
            confidence_level: Confidence level (default 0.95)
            power: Statistical power (default 0.8)

        Returns:
            Required sample size per variant
        """
        if baseline_rate <= 0 or baseline_rate >= 1:
            return 0

        z_alpha = stats.norm.ppf((1 + confidence_level) / 2)
        z_beta = stats.norm.ppf(power)

        p1 = baseline_rate
        p2 = baseline_rate * (1 + minimum_detectable_effect)

        p_avg = (p1 + p2) / 2

        numerator = (
            z_alpha * np.sqrt(2 * p_avg * (1 - p_avg))
            + z_beta * np.sqrt(p1 * (1 - p1) + p2 * (1 - p2))
        ) ** 2
        denominator = (p2 - p1) ** 2

        sample_size = int(np.ceil(numerator / denominator))

        return sample_size

    @staticmethod
    def determine_winner(test: ABTest) -> Optional[str]:
        """
        Determine winner of A/B test based on statistical significance

        Returns:
            ID of winning variant or None if no clear winner
        """
        if len(test.variants) < 2:
            return None

        control = test.variants[0]

        # Check if minimum sample size is met
        if control.impressions < test.min_sample_size:
            return None

        best_variant = control
        significant_winner = None

        for variant in test.variants[1:]:
            # Check sample size
            if variant.impressions < test.min_sample_size:
                continue

            # Calculate significance
            result = ABTestEngine.calculate_statistical_significance(
                control, variant, test.confidence_level
            )

            # Check if variant is significantly better
            if result["is_significant"] and result["relative_lift"] > 0:
                if test.primary_metric == "conversion_rate":
                    if variant.conversion_rate > best_variant.conversion_rate:
                        best_variant = variant
                        significant_winner = variant.id
                elif test.primary_metric == "revenue_per_visitor":
                    if variant.revenue_per_visitor > best_variant.revenue_per_visitor:
                        best_variant = variant
                        significant_winner = variant.id

        return significant_winner

    @staticmethod
    def get_test_report(test: ABTest) -> Dict:
        """Generate comprehensive test report"""
        control = test.variants[0]
        results = []

        for variant in test.variants[1:]:
            significance = ABTestEngine.calculate_statistical_significance(
                control, variant, test.confidence_level
            )

            results.append(
                {
                    "variant_id": variant.id,
                    "variant_name": variant.name,
                    "impressions": variant.impressions,
                    "conversions": variant.conversions,
                    "conversion_rate": variant.conversion_rate,
                    "significance": significance,
                    "status": variant.status.value,
                }
            )

        winner = ABTestEngine.determine_winner(test)

        return {
            "test_id": test.id,
            "test_name": test.name,
            "status": test.status,
            "start_date": test.start_date.isoformat() if test.start_date else None,
            "end_date": test.end_date.isoformat() if test.end_date else None,
            "control": {
                "variant_id": control.id,
                "variant_name": control.name,
                "impressions": control.impressions,
                "conversions": control.conversions,
                "conversion_rate": control.conversion_rate,
            },
            "variants": results,
            "winner": winner,
            "primary_metric": test.primary_metric,
            "confidence_level": test.confidence_level,
        }


class BayesianABTest:
    """Bayesian A/B testing (alternative to frequentist)"""

    @staticmethod
    def calculate_probability_b_beats_a(
        conversions_a: int,
        total_a: int,
        conversions_b: int,
        total_b: int,
        num_simulations: int = 100000,
    ) -> float:
        """
        Calculate probability that variant B beats variant A
        Using Beta distribution
        """
        # Prior: Beta(1, 1) - uniform
        alpha_prior = 1
        beta_prior = 1

        # Posterior for A
        alpha_a = alpha_prior + conversions_a
        beta_a = beta_prior + (total_a - conversions_a)

        # Posterior for B
        alpha_b = alpha_prior + conversions_b
        beta_b = beta_prior + (total_b - conversions_b)

        # Sample from posteriors
        samples_a = np.random.beta(alpha_a, beta_a, num_simulations)
        samples_b = np.random.beta(alpha_b, beta_b, num_simulations)

        # Probability B > A
        prob_b_beats_a = np.mean(samples_b > samples_a)

        return prob_b_beats_a

    @staticmethod
    def calculate_expected_loss(
        conversions_a: int,
        total_a: int,
        conversions_b: int,
        total_b: int,
        num_simulations: int = 100000,
    ) -> Tuple[float, float]:
        """
        Calculate expected loss for choosing each variant
        Returns: (loss_if_choose_a, loss_if_choose_b)
        """
        alpha_a = 1 + conversions_a
        beta_a = 1 + (total_a - conversions_a)

        alpha_b = 1 + conversions_b
        beta_b = 1 + (total_b - conversions_b)

        samples_a = np.random.beta(alpha_a, beta_a, num_simulations)
        samples_b = np.random.beta(alpha_b, beta_b, num_simulations)

        # Expected loss if we choose A
        loss_choose_a = np.mean(np.maximum(0, samples_b - samples_a))

        # Expected loss if we choose B
        loss_choose_b = np.mean(np.maximum(0, samples_a - samples_b))

        return (loss_choose_a, loss_choose_b)
