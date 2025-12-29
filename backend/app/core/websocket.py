"""WebSocket support for real-time updates."""

import asyncio
import json
from datetime import datetime
from typing import Dict, List, Set

from fastapi import Depends, WebSocket, WebSocketDisconnect

from app.core.security import get_current_user_ws
from app.models.user import User


class ConnectionManager:
    """Manage WebSocket connections."""

    def __init__(self):
        self.active_connections: Dict[int, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Connect a new WebSocket client."""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        """Disconnect a WebSocket client."""
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: int):
        """Send message to specific user."""
        if user_id in self.active_connections:
            disconnected = set()
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except:
                    disconnected.add(connection)

            # Clean up disconnected connections
            for conn in disconnected:
                self.active_connections[user_id].discard(conn)

    async def broadcast(self, message: dict, exclude_user: int = None):
        """Broadcast message to all connected users."""
        for user_id, connections in self.active_connections.items():
            if exclude_user and user_id == exclude_user:
                continue
            await self.send_personal_message(message, user_id)

    async def send_to_role(self, message: dict, role: str):
        """Send message to all users with specific role."""
        # Implementation depends on user role tracking
        pass


manager = ConnectionManager()


class WebSocketEvent:
    """WebSocket event types."""

    CAMPAIGN_UPDATED = "campaign_updated"
    LEAD_ADDED = "lead_added"
    ANALYTICS_UPDATE = "analytics_update"
    NOTIFICATION = "notification"
    USER_ACTIVITY = "user_activity"


async def notify_campaign_update(campaign_id: int, user_id: int = None):
    """Notify users about campaign update."""
    message = {
        "event": WebSocketEvent.CAMPAIGN_UPDATED,
        "data": {"campaign_id": campaign_id},
        "timestamp": datetime.utcnow().isoformat(),
    }

    if user_id:
        await manager.send_personal_message(message, user_id)
    else:
        await manager.broadcast(message)


async def notify_lead_added(lead_id: int, campaign_id: int = None):
    """Notify users about new lead."""
    message = {
        "event": WebSocketEvent.LEAD_ADDED,
        "data": {"lead_id": lead_id, "campaign_id": campaign_id},
        "timestamp": datetime.utcnow().isoformat(),
    }
    await manager.broadcast(message)


async def send_notification(user_id: int, title: str, message: str, type: str = "info"):
    """Send notification to specific user."""
    notification = {
        "event": WebSocketEvent.NOTIFICATION,
        "data": {"title": title, "message": message, "type": type},
        "timestamp": datetime.utcnow().isoformat(),
    }
    await manager.send_personal_message(notification, user_id)
