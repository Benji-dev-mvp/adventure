"""
Time-Series Forecasting Engine for Revenue Prediction and Trend Analysis.
Uses statistical models (ARIMA, Exponential Smoothing) and ML (Prophet-like decomposition).
"""
import logging
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
import math
from collections import defaultdict
import numpy as np
from scipy import stats
from scipy.signal import find_peaks

logger = logging.getLogger(__name__)


@dataclass
class TimeSeriesPoint:
    """Single time-series data point"""
    timestamp: datetime
    value: float
    metadata: Optional[Dict[str, Any]] = None


@dataclass
class Forecast:
    """Forecast result with confidence intervals"""
    timestamp: datetime
    predicted_value: float
    lower_bound: float  # 95% confidence
    upper_bound: float  # 95% confidence
    trend: float
    seasonal: float
    residual: float


@dataclass
class SeasonalityPattern:
    """Detected seasonality pattern"""
    period: int  # Period in time units (e.g., 7 for weekly)
    strength: float  # 0-1, how strong the pattern is
    peaks: List[int]  # Peak positions in the cycle
    pattern_type: str  # "weekly", "monthly", "yearly"


class TimeSeriesDecomposer:
    """
    Decompose time-series into trend, seasonal, and residual components.
    Similar to STL decomposition.
    """
    
    def __init__(self, period: Optional[int] = None):
        self.period = period
        self.trend: Optional[List[float]] = None
        self.seasonal: Optional[List[float]] = None
        self.residual: Optional[List[float]] = None
    
    def decompose(self, values: List[float]) -> Dict[str, List[float]]:
        """
        Additive decomposition: Y = Trend + Seasonal + Residual
        """
        if len(values) < 10:
            raise ValueError("Need at least 10 data points for decomposition")
        
        # 1. Extract trend using moving average
        self.trend = self._extract_trend(values)
        
        # 2. Detrend
        detrended = [v - t for v, t in zip(values, self.trend)]
        
        # 3. Extract seasonal component
        if self.period:
            self.seasonal = self._extract_seasonal(detrended, self.period)
        else:
            # Auto-detect period
            detected_period = self._detect_period(detrended)
            if detected_period:
                self.seasonal = self._extract_seasonal(detrended, detected_period)
            else:
                self.seasonal = [0.0] * len(values)
        
        # 4. Calculate residual
        self.residual = [
            v - t - s
            for v, t, s in zip(values, self.trend, self.seasonal)
        ]
        
        return {
            "trend": self.trend,
            "seasonal": self.seasonal,
            "residual": self.residual
        }
    
    def _extract_trend(self, values: List[float]) -> List[float]:
        """Extract trend using centered moving average"""
        window = min(len(values) // 4, 30)  # Adaptive window
        if window % 2 == 0:
            window += 1  # Ensure odd for centering
        
        trend = []
        half_window = window // 2
        
        for i in range(len(values)):
            start = max(0, i - half_window)
            end = min(len(values), i + half_window + 1)
            window_values = values[start:end]
            trend.append(sum(window_values) / len(window_values))
        
        return trend
    
    def _extract_seasonal(self, detrended: List[float], period: int) -> List[float]:
        """Extract seasonal component with given period"""
        # Calculate average for each position in period
        seasonal_averages = defaultdict(list)
        
        for i, value in enumerate(detrended):
            position = i % period
            seasonal_averages[position].append(value)
        
        # Average each position
        seasonal_pattern = [
            np.mean(seasonal_averages[i]) if seasonal_averages[i] else 0.0
            for i in range(period)
        ]
        
        # Normalize to sum to zero
        mean_seasonal = np.mean(seasonal_pattern)
        seasonal_pattern = [v - mean_seasonal for v in seasonal_pattern]
        
        # Repeat pattern for full length
        seasonal = []
        for i in range(len(detrended)):
            seasonal.append(seasonal_pattern[i % period])
        
        return seasonal
    
    def _detect_period(self, values: List[float]) -> Optional[int]:
        """Auto-detect seasonality period using autocorrelation"""
        if len(values) < 20:
            return None
        
        # Calculate autocorrelation for different lags
        max_lag = min(len(values) // 2, 30)
        autocorr = []
        
        for lag in range(1, max_lag):
            corr = np.corrcoef(values[:-lag], values[lag:])[0, 1]
            autocorr.append(corr)
        
        # Find peaks in autocorrelation (potential periods)
        peaks, _ = find_peaks(autocorr, height=0.3, distance=2)
        
        if len(peaks) > 0:
            # Return first significant peak
            return peaks[0] + 1
        
        return None


class ExponentialSmoothingForecaster:
    """
    Triple Exponential Smoothing (Holt-Winters).
    Good for data with trend and seasonality.
    """
    
    def __init__(self, alpha: float = 0.3, beta: float = 0.1, gamma: float = 0.1):
        """
        Args:
            alpha: Level smoothing parameter
            beta: Trend smoothing parameter
            gamma: Seasonal smoothing parameter
        """
        self.alpha = alpha
        self.beta = beta
        self.gamma = gamma
        
        self.level: Optional[float] = None
        self.trend: Optional[float] = None
        self.seasonal: List[float] = []
        self.period: Optional[int] = None
    
    def fit(self, values: List[float], period: int = 7):
        """Fit the model to historical data"""
        if len(values) < period * 2:
            raise ValueError(f"Need at least {period * 2} data points")
        
        self.period = period
        
        # Initialize level (average of first period)
        self.level = np.mean(values[:period])
        
        # Initialize trend (difference between first two periods)
        first_period_avg = np.mean(values[:period])
        second_period_avg = np.mean(values[period:period*2])
        self.trend = (second_period_avg - first_period_avg) / period
        
        # Initialize seasonal components (first period)
        self.seasonal = []
        for i in range(period):
            self.seasonal.append(values[i] - self.level)
        
        # Update parameters through all data
        for i, value in enumerate(values):
            self._update(value, i)
    
    def _update(self, value: float, index: int):
        """Update model with new observation"""
        seasonal_idx = index % self.period
        
        # Update level
        new_level = (
            self.alpha * (value - self.seasonal[seasonal_idx]) +
            (1 - self.alpha) * (self.level + self.trend)
        )
        
        # Update trend
        new_trend = (
            self.beta * (new_level - self.level) +
            (1 - self.beta) * self.trend
        )
        
        # Update seasonal
        new_seasonal = (
            self.gamma * (value - new_level) +
            (1 - self.gamma) * self.seasonal[seasonal_idx]
        )
        
        self.level = new_level
        self.trend = new_trend
        self.seasonal[seasonal_idx] = new_seasonal
    
    def forecast(self, steps: int) -> List[float]:
        """Forecast next N steps"""
        forecasts = []
        
        for i in range(steps):
            seasonal_idx = i % self.period
            forecast = self.level + (i + 1) * self.trend + self.seasonal[seasonal_idx]
            forecasts.append(forecast)
        
        return forecasts
    
    def forecast_with_confidence(
        self,
        steps: int,
        confidence: float = 0.95
    ) -> List[Dict[str, float]]:
        """Forecast with confidence intervals"""
        forecasts = self.forecast(steps)
        
        # Simple confidence interval (wider as we go further)
        z_score = stats.norm.ppf((1 + confidence) / 2)
        
        results = []
        for i, forecast in enumerate(forecasts):
            # Error grows with forecast horizon
            std_error = 10.0 * math.sqrt(i + 1)  # Simplified
            margin = z_score * std_error
            
            results.append({
                "forecast": forecast,
                "lower": forecast - margin,
                "upper": forecast + margin
            })
        
        return results


class TrendAnalyzer:
    """
    Analyze trends and detect change points.
    """
    
    @staticmethod
    def detect_trend(values: List[float]) -> Dict[str, Any]:
        """
        Detect overall trend using linear regression.
        Returns trend direction, strength, and slope.
        """
        if len(values) < 3:
            return {"direction": "insufficient_data", "strength": 0.0}
        
        # Linear regression
        x = np.arange(len(values))
        slope, intercept, r_value, p_value, std_err = stats.linregress(x, values)
        
        # Determine direction
        if abs(slope) < 0.01:
            direction = "flat"
        elif slope > 0:
            direction = "upward"
        else:
            direction = "downward"
        
        # Strength is R²
        strength = r_value ** 2
        
        return {
            "direction": direction,
            "strength": strength,
            "slope": slope,
            "r_squared": strength,
            "p_value": p_value,
            "significant": p_value < 0.05
        }
    
    @staticmethod
    def detect_change_points(values: List[float], threshold: float = 2.0) -> List[int]:
        """
        Detect abrupt changes (anomalies) in the series.
        Returns indices of change points.
        """
        if len(values) < 10:
            return []
        
        # Calculate rolling mean and std
        window = min(len(values) // 5, 20)
        change_points = []
        
        for i in range(window, len(values) - window):
            before = values[i-window:i]
            after = values[i:i+window]
            
            mean_before = np.mean(before)
            mean_after = np.mean(after)
            std = np.std(values[max(0, i-window*2):min(len(values), i+window*2)])
            
            if std > 0:
                z_score = abs(mean_after - mean_before) / std
                
                if z_score > threshold:
                    change_points.append(i)
        
        return change_points
    
    @staticmethod
    def calculate_momentum(values: List[float], window: int = 10) -> List[float]:
        """
        Calculate momentum (rate of change).
        Positive = accelerating growth, Negative = decelerating.
        """
        if len(values) < window + 1:
            return [0.0] * len(values)
        
        momentum = []
        
        for i in range(len(values)):
            if i < window:
                momentum.append(0.0)
            else:
                # Rate of change over window
                change = values[i] - values[i - window]
                momentum.append(change / window)
        
        return momentum


class RevenueForecaster:
    """
    Complete revenue forecasting system.
    Combines decomposition, exponential smoothing, and trend analysis.
    """
    
    def __init__(self):
        self.decomposer = TimeSeriesDecomposer()
        self.smoother = ExponentialSmoothingForecaster()
        self.historical_data: List[TimeSeriesPoint] = []
    
    def add_data_point(self, timestamp: datetime, revenue: float, metadata: Optional[Dict] = None):
        """Add historical revenue data"""
        self.historical_data.append(TimeSeriesPoint(timestamp, revenue, metadata))
    
    def analyze(self) -> Dict[str, Any]:
        """
        Comprehensive analysis of revenue data.
        Returns trends, seasonality, forecasts.
        """
        if len(self.historical_data) < 14:
            return {"error": "Need at least 14 days of data"}
        
        values = [dp.value for dp in self.historical_data]
        
        # 1. Decompose
        try:
            decomposition = self.decomposer.decompose(values)
        except Exception as e:
            logger.error(f"Decomposition failed: {e}")
            decomposition = None
        
        # 2. Trend analysis
        trend_analysis = TrendAnalyzer.detect_trend(values)
        change_points = TrendAnalyzer.detect_change_points(values)
        momentum = TrendAnalyzer.calculate_momentum(values)
        
        # 3. Forecast next 30 days
        try:
            self.smoother.fit(values, period=7)  # Weekly seasonality
            forecast = self.smoother.forecast_with_confidence(30)
        except Exception as e:
            logger.error(f"Forecast failed: {e}")
            forecast = []
        
        # 4. Summary statistics
        current_revenue = values[-1]
        avg_revenue = np.mean(values)
        total_revenue = sum(values)
        
        # Growth rate
        if len(values) >= 7:
            last_week = values[-7:]
            prev_week = values[-14:-7] if len(values) >= 14 else values[:-7]
            growth_rate = (np.mean(last_week) - np.mean(prev_week)) / np.mean(prev_week) * 100
        else:
            growth_rate = 0.0
        
        return {
            "summary": {
                "current_revenue": current_revenue,
                "average_revenue": avg_revenue,
                "total_revenue": total_revenue,
                "growth_rate_7d": growth_rate,
                "data_points": len(values)
            },
            "trend": trend_analysis,
            "change_points": change_points,
            "momentum": momentum[-1] if momentum else 0.0,
            "decomposition": decomposition,
            "forecast": forecast,
            "recommendations": self._generate_recommendations(
                trend_analysis, growth_rate, change_points
            )
        }
    
    def _generate_recommendations(
        self,
        trend: Dict[str, Any],
        growth_rate: float,
        change_points: List[int]
    ) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        # Trend-based
        if trend["direction"] == "downward" and trend["significant"]:
            recommendations.append("⚠️ Significant downward trend detected. Review campaign performance.")
        elif trend["direction"] == "upward" and growth_rate > 20:
            recommendations.append("📈 Strong growth! Consider scaling successful campaigns.")
        
        # Growth rate based
        if abs(growth_rate) < 5:
            recommendations.append("📊 Revenue flat. Test new outreach strategies.")
        
        # Change points
        if len(change_points) > 0:
            recommendations.append(
                f"🔄 {len(change_points)} abrupt changes detected. "
                "Investigate campaign launches or external factors."
            )
        
        # Seasonality
        if self.decomposer.seasonal and max(self.decomposer.seasonal) > 0:
            recommendations.append("📅 Seasonal patterns detected. Plan campaigns around high-performing periods.")
        
        return recommendations


# Example usage

async def forecast_campaign_revenue(campaign_id: int) -> Dict[str, Any]:
    """Example: Forecast revenue for specific campaign"""
    forecaster = RevenueForecaster()
    
    # Mock historical data (replace with actual DB query)
    base_date = datetime.now() - timedelta(days=30)
    for i in range(30):
        # Simulate daily revenue with trend + seasonality + noise
        trend = i * 100
        seasonal = 500 * math.sin(i * 2 * math.pi / 7)  # Weekly
        noise = np.random.normal(0, 200)
        revenue = 5000 + trend + seasonal + noise
        
        forecaster.add_data_point(
            base_date + timedelta(days=i),
            max(0, revenue),
            {"campaign_id": campaign_id}
        )
    
    return forecaster.analyze()


def detect_best_send_times(engagement_data: List[Tuple[datetime, float]]) -> Dict[int, float]:
    """
    Analyze historical engagement to find best send times.
    Returns: {hour: avg_engagement_score}
    """
    hourly_engagement = defaultdict(list)
    
    for timestamp, engagement in engagement_data:
        hour = timestamp.hour
        hourly_engagement[hour].append(engagement)
    
    # Calculate average for each hour
    best_times = {
        hour: np.mean(scores)
        for hour, scores in hourly_engagement.items()
    }
    
    # Sort by engagement
    sorted_times = dict(sorted(best_times.items(), key=lambda x: x[1], reverse=True))
    
    return sorted_times
