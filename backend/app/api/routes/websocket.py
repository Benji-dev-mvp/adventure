"""WebSocket routes for real-time updates."""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.core.websocket import manager
from app.core.security import get_current_user_ws
from app.models.user import User

router = APIRouter(prefix="/ws", tags=["websocket"])


@router.websocket("/updates")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = None
):
    """WebSocket endpoint for real-time updates."""
    # Validate token and get user
    # user = await get_current_user_ws(token)
    user_id = 1  # Placeholder - extract from token
    
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            # Receive messages from client
            data = await websocket.receive_json()
            
            # Echo back or process
            await websocket.send_json({
                "type": "ack",
                "message": "Message received"
            })
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)


@router.websocket("/notifications/{user_id}")
async def user_notifications(
    websocket: WebSocket,
    user_id: int
):
    """User-specific notification channel."""
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_text(f"Received: {data}")
    
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
