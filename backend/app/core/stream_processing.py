"""
AsyncIO Streaming Analytics with backpressure handling.
Real-time data pipelines using async generators and streaming responses.
"""

import asyncio
import json
import logging
from collections import deque
from dataclasses import dataclass
from datetime import datetime, timedelta
from typing import Any, AsyncIterator, Callable, Dict, List, Optional

logger = logging.getLogger(__name__)


@dataclass
class StreamEvent:
    """Event in data stream"""

    timestamp: datetime
    type: str
    data: Dict[str, Any]


class BackpressureBuffer:
    """
    Smart buffer with backpressure handling.
    Prevents memory overflow from fast producers.
    """

    def __init__(self, max_size: int = 1000, strategy: str = "drop_oldest"):
        self.buffer: deque = deque(maxlen=max_size)
        self.max_size = max_size
        self.strategy = strategy  # drop_oldest, drop_newest, block
        self.dropped_count = 0
        self._lock = asyncio.Lock()

    async def put(self, item: Any) -> bool:
        """
        Add item to buffer with backpressure handling.
        Returns True if added, False if dropped.
        """
        async with self._lock:
            if len(self.buffer) >= self.max_size:
                if self.strategy == "drop_oldest":
                    self.buffer.popleft()
                    self.buffer.append(item)
                    self.dropped_count += 1
                    return True
                elif self.strategy == "drop_newest":
                    self.dropped_count += 1
                    return False
                elif self.strategy == "block":
                    # Wait for space (with timeout)
                    await asyncio.sleep(0.1)
                    return await self.put(item)
            else:
                self.buffer.append(item)
                return True

    async def get(self) -> Optional[Any]:
        """Get item from buffer"""
        async with self._lock:
            if self.buffer:
                return self.buffer.popleft()
            return None

    def size(self) -> int:
        """Current buffer size"""
        return len(self.buffer)

    def get_stats(self) -> Dict[str, Any]:
        """Get buffer statistics"""
        return {
            "current_size": len(self.buffer),
            "max_size": self.max_size,
            "dropped_count": self.dropped_count,
            "utilization": len(self.buffer) / self.max_size if self.max_size > 0 else 0,
        }


class StreamProcessor:
    """
    Process data streams with operators (map, filter, reduce, window).
    Inspired by reactive programming (RxPY) but async-native.
    """

    def __init__(self, source: AsyncIterator[StreamEvent]):
        self.source = source

    async def map(self, func: Callable[[StreamEvent], StreamEvent]) -> AsyncIterator[StreamEvent]:
        """Transform each event"""
        async for event in self.source:
            yield func(event)

    async def filter(self, predicate: Callable[[StreamEvent], bool]) -> AsyncIterator[StreamEvent]:
        """Filter events by predicate"""
        async for event in self.source:
            if predicate(event):
                yield event

    async def buffer_time(self, seconds: int) -> AsyncIterator[List[StreamEvent]]:
        """Buffer events for time window"""
        buffer = []
        last_emit = datetime.now()

        async for event in self.source:
            buffer.append(event)

            if (datetime.now() - last_emit).total_seconds() >= seconds:
                if buffer:
                    yield buffer
                    buffer = []
                    last_emit = datetime.now()

    async def buffer_count(self, count: int) -> AsyncIterator[List[StreamEvent]]:
        """Buffer events until count reached"""
        buffer = []

        async for event in self.source:
            buffer.append(event)

            if len(buffer) >= count:
                yield buffer
                buffer = []

    async def debounce(self, seconds: float) -> AsyncIterator[StreamEvent]:
        """
        Emit only after silence period.
        Useful for rate-limiting or coalescing rapid events.
        """
        last_event: Optional[StreamEvent] = None
        last_time = datetime.now()

        async for event in self.source:
            last_event = event
            last_time = datetime.now()

            # Wait for silence
            await asyncio.sleep(seconds)

            # If no new event arrived, emit
            if (datetime.now() - last_time).total_seconds() >= seconds:
                if last_event:
                    yield last_event
                    last_event = None

    async def throttle(self, seconds: float) -> AsyncIterator[StreamEvent]:
        """
        Limit emission rate.
        Emit at most one event per time period.
        """
        last_emit = datetime.now() - timedelta(seconds=seconds)

        async for event in self.source:
            now = datetime.now()
            if (now - last_emit).total_seconds() >= seconds:
                yield event
                last_emit = now

    async def sliding_window(
        self, window_size: int, slide: int = 1
    ) -> AsyncIterator[List[StreamEvent]]:
        """
        Sliding window over events.
        Example: window_size=5, slide=1 gives overlapping windows.
        """
        buffer = deque(maxlen=window_size)
        count = 0

        async for event in self.source:
            buffer.append(event)
            count += 1

            if len(buffer) == window_size and count % slide == 0:
                yield list(buffer)

    async def reduce(
        self, func: Callable[[Any, StreamEvent], Any], initial: Any
    ) -> AsyncIterator[Any]:
        """
        Running reduction (fold).
        Emits accumulated value after each event.
        """
        accumulator = initial

        async for event in self.source:
            accumulator = func(accumulator, event)
            yield accumulator


class RealTimeAnalytics:
    """
    Real-time analytics engine using streaming.
    Calculates metrics on live data without storing everything.
    """

    def __init__(self):
        self.metrics: Dict[str, Any] = {}
        self.windows: Dict[str, deque] = {}

    async def calculate_moving_average(
        self, stream: AsyncIterator[float], window_size: int
    ) -> AsyncIterator[float]:
        """Calculate moving average over stream"""
        window = deque(maxlen=window_size)

        async for value in stream:
            window.append(value)
            avg = sum(window) / len(window)
            yield avg

    async def detect_anomalies(
        self,
        stream: AsyncIterator[float],
        window_size: int = 100,
        threshold_std: float = 3.0,
    ) -> AsyncIterator[Dict[str, Any]]:
        """
        Detect anomalies using z-score.
        Yields anomaly events when value deviates significantly.
        """
        window = deque(maxlen=window_size)

        async for value in stream:
            window.append(value)

            if len(window) >= window_size:
                mean = sum(window) / len(window)
                variance = sum((x - mean) ** 2 for x in window) / len(window)
                std_dev = variance**0.5

                if std_dev > 0:
                    z_score = (value - mean) / std_dev

                    if abs(z_score) > threshold_std:
                        yield {
                            "value": value,
                            "mean": mean,
                            "std_dev": std_dev,
                            "z_score": z_score,
                            "is_anomaly": True,
                            "timestamp": datetime.now().isoformat(),
                        }

    async def calculate_percentiles(
        self,
        stream: AsyncIterator[float],
        percentiles: List[float] = [50, 75, 90, 95, 99],
    ) -> AsyncIterator[Dict[str, float]]:
        """Calculate percentiles over sliding window"""
        window = deque(maxlen=1000)

        async for value in stream:
            window.append(value)

            if len(window) >= 100:  # Wait for minimum data
                sorted_values = sorted(window)
                result = {}

                for p in percentiles:
                    idx = int(len(sorted_values) * p / 100)
                    result[f"p{int(p)}"] = sorted_values[min(idx, len(sorted_values) - 1)]

                yield result

    async def session_window(
        self, stream: AsyncIterator[StreamEvent], gap_seconds: int = 300
    ) -> AsyncIterator[List[StreamEvent]]:
        """
        Session window: group events with gaps > threshold.
        Useful for user sessions, conversation threads.
        """
        session = []
        last_event_time: Optional[datetime] = None

        async for event in stream:
            if (
                last_event_time
                and (event.timestamp - last_event_time).total_seconds() > gap_seconds
            ):
                # Gap detected - emit session and start new one
                if session:
                    yield session
                    session = []

            session.append(event)
            last_event_time = event.timestamp

        # Emit final session
        if session:
            yield session


class StreamingResponse:
    """
    FastAPI streaming response generator.
    Sends Server-Sent Events (SSE) for real-time updates.
    """

    @staticmethod
    async def generate_sse(
        data_stream: AsyncIterator[Dict[str, Any]],
    ) -> AsyncIterator[str]:
        """
        Generate Server-Sent Events format.

        Usage in FastAPI:
            @app.get("/stream/analytics")
            async def stream_analytics():
                return StreamingResponse(
                    StreamingResponse.generate_sse(analytics_stream),
                    media_type="text/event-stream"
                )
        """
        try:
            async for data in data_stream:
                # SSE format: data: {json}\n\n
                json_data = json.dumps(data)
                yield f"data: {json_data}\n\n"

                # Allow client to process
                await asyncio.sleep(0)
        except asyncio.CancelledError:
            logger.info("Client disconnected from stream")
            yield "event: close\ndata: Stream closed\n\n"

    @staticmethod
    async def generate_json_lines(
        data_stream: AsyncIterator[Dict[str, Any]],
    ) -> AsyncIterator[str]:
        """
        Generate JSON Lines format (newline-delimited JSON).
        More efficient than SSE for API-to-API streaming.
        """
        async for data in data_stream:
            json_line = json.dumps(data) + "\n"
            yield json_line


class DataPipeline:
    """
    Complete data pipeline with stages.
    Processes data through transformation, enrichment, and aggregation.
    """

    def __init__(self, name: str):
        self.name = name
        self.stages: List[Callable] = []
        self.buffer = BackpressureBuffer(max_size=5000)

    def add_stage(self, func: Callable) -> "DataPipeline":
        """Add processing stage"""
        self.stages.append(func)
        return self

    async def process(self, input_stream: AsyncIterator[Any]) -> AsyncIterator[Any]:
        """Process stream through all stages"""
        current_stream = input_stream

        for stage in self.stages:
            current_stream = stage(current_stream)

        async for item in current_stream:
            # Apply backpressure
            await self.buffer.put(item)
            yield item

    async def run(self, input_stream: AsyncIterator[Any]) -> None:
        """Run pipeline without yielding (fire-and-forget)"""
        async for _ in self.process(input_stream):
            pass


# Example: Lead engagement stream processor
async def lead_engagement_stream(lead_id: str) -> AsyncIterator[StreamEvent]:
    """
    Stream of lead engagement events.
    In production, connect to Redis pub/sub or Kafka.
    """
    # Simulate real-time events
    for i in range(100):
        yield StreamEvent(
            timestamp=datetime.now(),
            type="email_opened" if i % 3 == 0 else "page_viewed",
            data={"lead_id": lead_id, "score_delta": 5 if i % 3 == 0 else 2},
        )
        await asyncio.sleep(0.1)


async def process_engagement_analytics(lead_id: str) -> AsyncIterator[Dict[str, Any]]:
    """
    Process engagement events and yield real-time analytics.

    This is a complete streaming pipeline:
    1. Ingest events
    2. Calculate running score
    3. Detect engagement spikes
    4. Emit insights
    """
    stream = lead_engagement_stream(lead_id)
    processor = StreamProcessor(stream)

    # Extract score deltas
    async def extract_score(event: StreamEvent) -> float:
        return event.data.get("score_delta", 0)

    # Calculate running total
    async def accumulate_score(total: float, event: StreamEvent) -> float:
        return total + event.data.get("score_delta", 0)

    # Process stream
    score_stream = processor.map(lambda e: extract_score(e))
    running_total = processor.reduce(accumulate_score, 0)

    async for score in running_total:
        yield {
            "lead_id": lead_id,
            "current_score": score,
            "timestamp": datetime.now().isoformat(),
        }


# Example: Real-time campaign metrics
async def campaign_metrics_stream(campaign_id: str) -> AsyncIterator[Dict[str, Any]]:
    """
    Stream real-time campaign metrics.
    Aggregates events in 10-second windows.
    """
    from app.core.event_sourcing import EventType, event_store

    # Get event stream
    event_stream = event_store.get_event_stream(
        event_types=[
            EventType.EMAIL_SENT,
            EventType.EMAIL_OPENED,
            EventType.EMAIL_CLICKED,
        ]
    )

    # Convert to StreamEvent format
    async def to_stream_event(event):
        return StreamEvent(timestamp=event.timestamp, type=event.event_type.value, data=event.data)

    stream_events = (to_stream_event(e) async for e in event_stream)
    processor = StreamProcessor(stream_events)

    # Buffer events in 10-second windows
    async for window in processor.buffer_time(10):
        # Aggregate metrics for window
        metrics = {
            "campaign_id": campaign_id,
            "window_start": window[0].timestamp.isoformat() if window else None,
            "window_end": window[-1].timestamp.isoformat() if window else None,
            "events_count": len(window),
            "sent": sum(1 for e in window if "sent" in e.type),
            "opened": sum(1 for e in window if "opened" in e.type),
            "clicked": sum(1 for e in window if "clicked" in e.type),
        }

        if metrics["sent"] > 0:
            metrics["open_rate"] = metrics["opened"] / metrics["sent"]
            metrics["click_rate"] = metrics["clicked"] / metrics["sent"]

        yield metrics
