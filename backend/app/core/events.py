"""
Real-time event streaming via WebSocket.
Provides live updates for campaigns, lead scores, and system alerts.
"""
import json
import logging
from typing import Dict, Set, Optional
from fastapi import WebSocket, WebSocketDisconnect, Depends
from datetime import datetime
from app.core.security import get_current_user_ws
from app.models.user import User

logger = logging.getLogger(__name__)


class ConnectionManager:
    """Manage WebSocket connections and broadcasts"""
    
    def __init__(self):
        # Track active connections by type
        self.active_connections: Dict[str, Set[WebSocket]] = {
            "campaign": set(),
            "leads": set(),
            "system": set(),
            "all": set()
        }
        # Track user -> connection mapping
        self.user_connections: Dict[int, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, channel: str = "all", user_id: Optional[int] = None):
        """Register new WebSocket connection"""
        await websocket.accept()
        
        if channel not in self.active_connections:
            self.active_connections[channel] = set()
        
        self.active_connections[channel].add(websocket)
        self.active_connections["all"].add(websocket)
        
        if user_id:
            if user_id not in self.user_connections:
                self.user_connections[user_id] = set()
            self.user_connections[user_id].add(websocket)
        
        logger.info(f"WebSocket connected to channel: {channel}, total: {len(self.active_connections[channel])}")
    
    def disconnect(self, websocket: WebSocket, channel: str = "all", user_id: Optional[int] = None):
        """Remove WebSocket connection"""
        if channel in self.active_connections:
            self.active_connections[channel].discard(websocket)
        self.active_connections["all"].discard(websocket)
        
        if user_id and user_id in self.user_connections:
            self.user_connections[user_id].discard(websocket)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]
        
        logger.info(f"WebSocket disconnected from channel: {channel}")
    
    async def send_personal_message(self, message: dict, websocket: WebSocket):
        """Send message to specific connection"""
        try:
            await websocket.send_json(message)
        except Exception as e:
            logger.error(f"Failed to send personal message: {e}")
    
    async def broadcast(self, message: dict, channel: str = "all"):
        """Broadcast message to all connections in channel"""
        if channel not in self.active_connections:
            return
        
        disconnected = set()
        for connection in self.active_connections[channel].copy():
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to broadcast to connection: {e}")
                disconnected.add(connection)
        
        # Clean up disconnected clients
        for conn in disconnected:
            self.disconnect(conn, channel)
    
    async def broadcast_to_user(self, message: dict, user_id: int):
        """Broadcast message to all connections of specific user"""
        if user_id not in self.user_connections:
            return
        
        for connection in self.user_connections[user_id].copy():
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Failed to send to user {user_id}: {e}")


# Global connection manager
manager = ConnectionManager()


class EventBroadcaster:
    """
    Broadcast events to WebSocket clients.
    Called from various parts of the application.
    """
    
    @staticmethod
    async def campaign_progress(campaign_id: int, data: dict):
        """Broadcast campaign progress update"""
        message = {
            "type": "campaign_progress",
            "campaign_id": campaign_id,
            "timestamp": datetime.now().isoformat(),
            "data": data
        }
        await manager.broadcast(message, channel="campaign")
    
    @staticmethod
    async def lead_score_update(lead_id: int, old_score: float, new_score: float):
        """Broadcast lead score change"""
        message = {
            "type": "lead_score_update",
            "lead_id": lead_id,
            "old_score": old_score,
            "new_score": new_score,
            "timestamp": datetime.now().isoformat()
        }
        await manager.broadcast(message, channel="leads")
    
    @staticmethod
    async def system_alert(severity: str, message: str, details: Optional[dict] = None):
        """Broadcast system alert"""
        alert = {
            "type": "system_alert",
            "severity": severity,  # info, warning, error, critical
            "message": message,
            "details": details or {},
            "timestamp": datetime.now().isoformat()
        }
        await manager.broadcast(alert, channel="system")
    
    @staticmethod
    async def team_activity(user_id: int, action: str, resource: str, resource_id: int):
        """Broadcast team collaboration event"""
        event = {
            "type": "team_activity",
            "user_id": user_id,
            "action": action,  # viewing, editing, commenting
            "resource": resource,  # campaign, lead, etc.
            "resource_id": resource_id,
            "timestamp": datetime.now().isoformat()
        }
        await manager.broadcast(event, channel="all")
    
    @staticmethod
    async def email_sent(campaign_id: int, lead_id: int, status: str):
        """Broadcast email sent notification"""
        event = {
            "type": "email_sent",
            "campaign_id": campaign_id,
            "lead_id": lead_id,
            "status": status,
            "timestamp": datetime.now().isoformat()
        }
        await manager.broadcast(event, channel="campaign")
    
    @staticmethod
    async def reply_received(campaign_id: int, lead_id: int, preview: str):
        """Broadcast reply notification"""
        event = {
            "type": "reply_received",
            "campaign_id": campaign_id,
            "lead_id": lead_id,
            "preview": preview[:100],
            "timestamp": datetime.now().isoformat()
        }
        await manager.broadcast(event, channel="campaign")


# Export broadcaster for use in other modules
broadcaster = EventBroadcaster()


async def handle_websocket_commands(websocket: WebSocket, data: dict, user: User):
    """
    Handle incoming commands from WebSocket client.
    
    Supported commands:
    - {"command": "subscribe", "channel": "campaign"}
    - {"command": "unsubscribe", "channel": "campaign"}
    - {"command": "ping"}
    """
    command = data.get("command")
    
    if command == "subscribe":
        channel = data.get("channel", "all")
        await manager.connect(websocket, channel, user.id)
        await manager.send_personal_message({
            "type": "subscribed",
            "channel": channel,
            "timestamp": datetime.now().isoformat()
        }, websocket)
    
    elif command == "unsubscribe":
        channel = data.get("channel", "all")
        manager.disconnect(websocket, channel, user.id)
        await manager.send_personal_message({
            "type": "unsubscribed",
            "channel": channel,
            "timestamp": datetime.now().isoformat()
        }, websocket)
    
    elif command == "ping":
        await manager.send_personal_message({
            "type": "pong",
            "timestamp": datetime.now().isoformat()
        }, websocket)
    
    else:
        await manager.send_personal_message({
            "type": "error",
            "message": f"Unknown command: {command}"
        }, websocket)
