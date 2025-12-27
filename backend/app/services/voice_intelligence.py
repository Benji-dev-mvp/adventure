"""
Voice Intelligence Service

Real-time voice/call features:
- WebSocket streaming
- Speech-to-text (STT)
- Real-time assistant suggestions
- Post-call summarization
- Action item extraction
"""

from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, Any, Optional, List
from datetime import datetime
from sqlmodel import Session, select
from ..models.ai_enterprise import VoiceSession, VoiceTranscriptChunk
import asyncio
import json
import logging

logger = logging.getLogger(__name__)


class VoiceStreamManager:
    """Manage active voice streaming sessions"""
    
    def __init__(self):
        self.active_sessions: Dict[str, Dict[str, Any]] = {}
    
    async def create_session(
        self,
        session_id: str,
        tenant_id: str,
        user_id: str,
        websocket: WebSocket,
        db: Session,
    ) -> VoiceSession:
        """Create new voice session"""
        
        # Create DB record
        session = VoiceSession(
            session_id=session_id,
            tenant_id=tenant_id,
            user_id=user_id,
            channel="websocket",
            status="active",
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        
        # Store in active sessions
        self.active_sessions[session_id] = {
            "websocket": websocket,
            "tenant_id": tenant_id,
            "user_id": user_id,
            "transcript_chunks": [],
            "started_at": datetime.utcnow(),
        }
        
        logger.info(f"Voice session created: {session_id}")
        
        return session
    
    async def handle_audio_chunk(
        self,
        session_id: str,
        audio_data: bytes,
        db: Session,
    ) -> Optional[Dict[str, Any]]:
        """
        Process incoming audio chunk
        
        Returns partial transcript if available
        """
        if session_id not in self.active_sessions:
            return None
        
        session = self.active_sessions[session_id]
        
        try:
            # In real implementation, would call STT service (Deepgram, Whisper, etc.)
            # For now, simulate response
            transcript_text = "[Transcribed audio]"
            
            # Store transcript chunk
            chunk = VoiceTranscriptChunk(
                session_id=session_id,
                sequence_number=len(session["transcript_chunks"]),
                text=transcript_text,
                confidence=0.95,
            )
            db.add(chunk)
            db.commit()
            
            session["transcript_chunks"].append(transcript_text)
            
            # Generate real-time suggestions
            suggestions = await self._generate_suggestions(
                session["transcript_chunks"],
                session["tenant_id"],
            )
            
            return {
                "type": "transcript",
                "text": transcript_text,
                "confidence": 0.95,
                "suggestions": suggestions,
            }
        
        except Exception as e:
            logger.error(f"Failed to process audio chunk: {e}")
            return {
                "type": "error",
                "message": str(e),
            }
    
    async def _generate_suggestions(
        self,
        transcript_chunks: List[str],
        tenant_id: str,
    ) -> List[str]:
        """Generate real-time assistant suggestions"""
        
        # Combine recent transcript
        recent_transcript = " ".join(transcript_chunks[-5:])
        
        # In real implementation, would use LLM to generate suggestions
        # For now, return placeholder suggestions
        suggestions = [
            "Ask about their current solution",
            "Mention the ROI case study",
            "Schedule a demo for next week",
        ]
        
        return suggestions
    
    async def end_session(
        self,
        session_id: str,
        db: Session,
    ) -> Dict[str, Any]:
        """End voice session and generate summary"""
        
        if session_id not in self.active_sessions:
            return {"error": "Session not found"}
        
        session_data = self.active_sessions[session_id]
        
        # Get full transcript
        statement = (
            select(VoiceTranscriptChunk)
            .where(VoiceTranscriptChunk.session_id == session_id)
            .order_by(VoiceTranscriptChunk.sequence_number)
        )
        chunks = db.exec(statement).all()
        
        full_transcript = " ".join([chunk.text for chunk in chunks])
        
        # Generate summary and actions
        summary_result = await self._generate_summary(full_transcript)
        
        # Update session record
        statement = select(VoiceSession).where(VoiceSession.session_id == session_id)
        session = db.exec(statement).first()
        
        if session:
            session.status = "completed"
            session.transcript = full_transcript
            session.summary = summary_result["summary"]
            session.set_actions(summary_result["actions"])
            session.sentiment = summary_result["sentiment"]
            session.ended_at = datetime.utcnow()
            session.duration_seconds = (
                datetime.utcnow() - session.started_at
            ).total_seconds()
            session.words_spoken = len(full_transcript.split())
            
            db.commit()
        
        # Remove from active sessions
        del self.active_sessions[session_id]
        
        logger.info(f"Voice session ended: {session_id}")
        
        return {
            "session_id": session_id,
            "transcript": full_transcript,
            "summary": summary_result["summary"],
            "actions": summary_result["actions"],
            "sentiment": summary_result["sentiment"],
            "duration_seconds": session.duration_seconds,
        }
    
    async def _generate_summary(self, transcript: str) -> Dict[str, Any]:
        """Generate call summary and action items"""
        
        # In real implementation, would use LLM
        # For now, return placeholder
        
        summary = "Call discussion covered product features and pricing."
        actions = [
            {
                "action": "Send pricing proposal",
                "assignee": "Sales Rep",
                "due_date": "2024-01-10",
            },
            {
                "action": "Schedule technical demo",
                "assignee": "Sales Engineer",
                "due_date": "2024-01-15",
            },
        ]
        sentiment = "positive"
        
        return {
            "summary": summary,
            "actions": actions,
            "sentiment": sentiment,
        }


class VoiceIntelligenceService:
    """High-level voice intelligence service"""
    
    def __init__(self, db: Session):
        self.db = db
        self.stream_manager = VoiceStreamManager()
    
    async def handle_websocket_connection(
        self,
        websocket: WebSocket,
        session_id: str,
        tenant_id: str,
        user_id: str,
    ):
        """
        Handle WebSocket voice streaming connection
        
        Protocol:
        - Client sends: {"type": "audio", "data": base64_audio}
        - Server sends: {"type": "transcript", "text": "...", "suggestions": [...]}
        - Client sends: {"type": "end"}
        - Server sends: {"type": "summary", ...}
        """
        await websocket.accept()
        
        # Create session
        session = await self.stream_manager.create_session(
            session_id=session_id,
            tenant_id=tenant_id,
            user_id=user_id,
            websocket=websocket,
            db=self.db,
        )
        
        try:
            await websocket.send_json({
                "type": "connected",
                "session_id": session_id,
                "message": "Voice streaming started",
            })
            
            while True:
                # Receive audio chunks
                message = await websocket.receive_json()
                
                if message.get("type") == "audio":
                    # Process audio chunk
                    audio_data = message.get("data", b"")
                    
                    result = await self.stream_manager.handle_audio_chunk(
                        session_id=session_id,
                        audio_data=audio_data,
                        db=self.db,
                    )
                    
                    if result:
                        await websocket.send_json(result)
                
                elif message.get("type") == "end":
                    # End session
                    summary = await self.stream_manager.end_session(
                        session_id=session_id,
                        db=self.db,
                    )
                    
                    await websocket.send_json({
                        "type": "summary",
                        **summary,
                    })
                    
                    break
        
        except WebSocketDisconnect:
            logger.info(f"WebSocket disconnected: {session_id}")
            # Clean up session
            await self.stream_manager.end_session(session_id, self.db)
        
        except Exception as e:
            logger.error(f"WebSocket error: {e}")
            await websocket.send_json({
                "type": "error",
                "message": str(e),
            })
    
    async def get_session_summary(
        self,
        session_id: str,
    ) -> Optional[Dict[str, Any]]:
        """Get summary for completed session"""
        
        statement = select(VoiceSession).where(VoiceSession.session_id == session_id)
        session = self.db.exec(statement).first()
        
        if not session:
            return None
        
        return {
            "session_id": session.session_id,
            "status": session.status,
            "transcript": session.transcript,
            "summary": session.summary,
            "actions": session.get_actions(),
            "sentiment": session.sentiment,
            "duration_seconds": session.duration_seconds,
            "words_spoken": session.words_spoken,
            "started_at": session.started_at.isoformat(),
            "ended_at": session.ended_at.isoformat() if session.ended_at else None,
        }
    
    async def get_session_actions(
        self,
        session_id: str,
    ) -> List[Dict[str, Any]]:
        """Get action items from session"""
        
        statement = select(VoiceSession).where(VoiceSession.session_id == session_id)
        session = self.db.exec(statement).first()
        
        if not session:
            return []
        
        return session.get_actions()
    
    async def list_sessions(
        self,
        tenant_id: str,
        user_id: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 50,
    ) -> List[VoiceSession]:
        """List voice sessions"""
        
        statement = (
            select(VoiceSession)
            .where(VoiceSession.tenant_id == tenant_id)
            .order_by(VoiceSession.started_at.desc())
            .limit(limit)
        )
        
        if user_id:
            statement = statement.where(VoiceSession.user_id == user_id)
        if status:
            statement = statement.where(VoiceSession.status == status)
        
        return list(self.db.exec(statement).all())
