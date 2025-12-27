"""Add enterprise AI tables

Revision ID: 002_enterprise_ai
Revises: 001_initial_migration
Create Date: 2024-12-27 23:47:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '002_enterprise_ai'
down_revision = '001_initial_migration'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Model policies
    op.create_table(
        'model_policies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('workspace_id', sa.String(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('rules', sa.String(), nullable=False, server_default='[]'),
        sa.Column('fallback_strategy', sa.String(), nullable=False, server_default='latency'),
        sa.Column('auto_fallback_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_model_policies_workspace_id', 'model_policies', ['workspace_id'])
    op.create_index('ix_model_policies_tenant_id', 'model_policies', ['tenant_id'])
    
    # Model health metrics
    op.create_table(
        'model_health_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('provider', sa.String(), nullable=False),
        sa.Column('model', sa.String(), nullable=False),
        sa.Column('status', sa.String(), nullable=False, server_default='healthy'),
        sa.Column('avg_latency_ms', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('error_rate', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('last_checked', sa.DateTime(), nullable=False),
        sa.Column('metadata', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_model_health_metrics_provider', 'model_health_metrics', ['provider'])
    op.create_index('ix_model_health_metrics_model', 'model_health_metrics', ['model'])
    
    # Memory policies
    op.create_table(
        'memory_policies',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('ttl_days', sa.Integer(), nullable=True, server_default='90'),
        sa.Column('pii_scrub_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('auto_purge_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('compliance_mode', sa.String(), nullable=False, server_default='standard'),
        sa.Column('retention_categories', sa.String(), nullable=False, server_default='[]'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tenant_id')
    )
    op.create_index('ix_memory_policies_tenant_id', 'memory_policies', ['tenant_id'])
    
    # Memory audit logs
    op.create_table(
        'memory_audit_logs',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('operation', sa.String(), nullable=False),
        sa.Column('memory_id', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('reason', sa.String(), nullable=True),
        sa.Column('metadata', sa.String(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_memory_audit_logs_tenant_id', 'memory_audit_logs', ['tenant_id'])
    op.create_index('ix_memory_audit_logs_user_id', 'memory_audit_logs', ['user_id'])
    op.create_index('ix_memory_audit_logs_timestamp', 'memory_audit_logs', ['timestamp'])
    
    # Knowledge graph entities
    op.create_table(
        'kg_entities',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('entity_id', sa.String(), nullable=False),
        sa.Column('entity_type', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('properties', sa.String(), nullable=False, server_default='{}'),
        sa.Column('embedding', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('entity_id')
    )
    op.create_index('ix_kg_entities_tenant_id', 'kg_entities', ['tenant_id'])
    op.create_index('ix_kg_entities_entity_id', 'kg_entities', ['entity_id'])
    op.create_index('ix_kg_entities_entity_type', 'kg_entities', ['entity_type'])
    
    # Knowledge graph relations
    op.create_table(
        'kg_relations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('source_entity_id', sa.String(), nullable=False),
        sa.Column('target_entity_id', sa.String(), nullable=False),
        sa.Column('relation_type', sa.String(), nullable=False),
        sa.Column('properties', sa.String(), nullable=False, server_default='{}'),
        sa.Column('weight', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_kg_relations_tenant_id', 'kg_relations', ['tenant_id'])
    op.create_index('ix_kg_relations_source_entity_id', 'kg_relations', ['source_entity_id'])
    op.create_index('ix_kg_relations_target_entity_id', 'kg_relations', ['target_entity_id'])
    op.create_index('ix_kg_relations_relation_type', 'kg_relations', ['relation_type'])
    
    # Usage metering
    op.create_table(
        'usage_metering',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('workspace_id', sa.String(), nullable=True),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('endpoint', sa.String(), nullable=False),
        sa.Column('request_id', sa.String(), nullable=False),
        sa.Column('model_provider', sa.String(), nullable=False),
        sa.Column('model_name', sa.String(), nullable=False),
        sa.Column('tokens_in', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('tokens_out', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('total_tokens', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('latency_ms', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('success', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('cost_usd', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('metadata', sa.String(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_usage_metering_tenant_id', 'usage_metering', ['tenant_id'])
    op.create_index('ix_usage_metering_workspace_id', 'usage_metering', ['workspace_id'])
    op.create_index('ix_usage_metering_user_id', 'usage_metering', ['user_id'])
    op.create_index('ix_usage_metering_request_id', 'usage_metering', ['request_id'])
    op.create_index('ix_usage_metering_timestamp', 'usage_metering', ['timestamp'])
    
    # Tenant usage quotas
    op.create_table(
        'tenant_usage_quotas',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('monthly_token_limit', sa.Integer(), nullable=True),
        sa.Column('monthly_cost_limit_usd', sa.Float(), nullable=True),
        sa.Column('requests_per_minute', sa.Integer(), nullable=False, server_default='100'),
        sa.Column('current_tokens_used', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('current_cost_usd', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('hard_cap_enabled', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('soft_cap_enabled', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('soft_cap_threshold', sa.Float(), nullable=False, server_default='0.8'),
        sa.Column('stripe_subscription_id', sa.String(), nullable=True),
        sa.Column('billing_cycle_start', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('tenant_id')
    )
    op.create_index('ix_tenant_usage_quotas_tenant_id', 'tenant_usage_quotas', ['tenant_id'])
    
    # Voice sessions
    op.create_table(
        'voice_sessions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.String(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('channel', sa.String(), nullable=False, server_default='websocket'),
        sa.Column('status', sa.String(), nullable=False, server_default='active'),
        sa.Column('transcript', sa.String(), nullable=True),
        sa.Column('summary', sa.String(), nullable=True),
        sa.Column('actions', sa.String(), nullable=False, server_default='[]'),
        sa.Column('sentiment', sa.String(), nullable=True),
        sa.Column('duration_seconds', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('words_spoken', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('started_at', sa.DateTime(), nullable=False),
        sa.Column('ended_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('session_id')
    )
    op.create_index('ix_voice_sessions_session_id', 'voice_sessions', ['session_id'])
    op.create_index('ix_voice_sessions_tenant_id', 'voice_sessions', ['tenant_id'])
    op.create_index('ix_voice_sessions_user_id', 'voice_sessions', ['user_id'])
    
    # Voice transcript chunks
    op.create_table(
        'voice_transcript_chunks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('session_id', sa.String(), nullable=False),
        sa.Column('sequence_number', sa.Integer(), nullable=False),
        sa.Column('text', sa.String(), nullable=False),
        sa.Column('speaker', sa.String(), nullable=True),
        sa.Column('confidence', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_voice_transcript_chunks_session_id', 'voice_transcript_chunks', ['session_id'])
    
    # Analytics tables
    op.create_table(
        'vector_search_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('query', sa.String(), nullable=False),
        sa.Column('top_k', sa.Integer(), nullable=False),
        sa.Column('results_returned', sa.Integer(), nullable=False),
        sa.Column('clicked_position', sa.Integer(), nullable=True),
        sa.Column('relevant', sa.Boolean(), nullable=True),
        sa.Column('recall_score', sa.Float(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_vector_search_metrics_tenant_id', 'vector_search_metrics', ['tenant_id'])
    op.create_index('ix_vector_search_metrics_timestamp', 'vector_search_metrics', ['timestamp'])
    
    op.create_table(
        'email_performance_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('campaign_id', sa.String(), nullable=False),
        sa.Column('email_id', sa.String(), nullable=False),
        sa.Column('model_used', sa.String(), nullable=False),
        sa.Column('generation_method', sa.String(), nullable=False),
        sa.Column('sent', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('opened', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('clicked', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('replied', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('open_rate', sa.Float(), nullable=True),
        sa.Column('click_rate', sa.Float(), nullable=True),
        sa.Column('reply_rate', sa.Float(), nullable=True),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_email_performance_metrics_tenant_id', 'email_performance_metrics', ['tenant_id'])
    op.create_index('ix_email_performance_metrics_campaign_id', 'email_performance_metrics', ['campaign_id'])
    op.create_index('ix_email_performance_metrics_email_id', 'email_performance_metrics', ['email_id'])
    
    op.create_table(
        'lead_score_accuracy_metrics',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('lead_id', sa.String(), nullable=False),
        sa.Column('predicted_score', sa.Integer(), nullable=False),
        sa.Column('predicted_tier', sa.String(), nullable=False),
        sa.Column('model_used', sa.String(), nullable=False),
        sa.Column('actual_converted', sa.Boolean(), nullable=True),
        sa.Column('actual_value', sa.Float(), nullable=True),
        sa.Column('days_to_conversion', sa.Integer(), nullable=True),
        sa.Column('score_error', sa.Float(), nullable=True),
        sa.Column('tier_correct', sa.Boolean(), nullable=True),
        sa.Column('predicted_at', sa.DateTime(), nullable=False),
        sa.Column('outcome_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_lead_score_accuracy_metrics_tenant_id', 'lead_score_accuracy_metrics', ['tenant_id'])
    op.create_index('ix_lead_score_accuracy_metrics_lead_id', 'lead_score_accuracy_metrics', ['lead_id'])
    
    op.create_table(
        'ai_response_quality_feedback',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('tenant_id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('endpoint', sa.String(), nullable=False),
        sa.Column('request_id', sa.String(), nullable=False),
        sa.Column('model_used', sa.String(), nullable=False),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('helpful', sa.Boolean(), nullable=False),
        sa.Column('feedback_text', sa.String(), nullable=True),
        sa.Column('issues', sa.String(), nullable=False, server_default='[]'),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_ai_response_quality_feedback_tenant_id', 'ai_response_quality_feedback', ['tenant_id'])
    op.create_index('ix_ai_response_quality_feedback_user_id', 'ai_response_quality_feedback', ['user_id'])


def downgrade() -> None:
    op.drop_table('ai_response_quality_feedback')
    op.drop_table('lead_score_accuracy_metrics')
    op.drop_table('email_performance_metrics')
    op.drop_table('vector_search_metrics')
    op.drop_table('voice_transcript_chunks')
    op.drop_table('voice_sessions')
    op.drop_table('tenant_usage_quotas')
    op.drop_table('usage_metering')
    op.drop_table('kg_relations')
    op.drop_table('kg_entities')
    op.drop_table('memory_audit_logs')
    op.drop_table('memory_policies')
    op.drop_table('model_health_metrics')
    op.drop_table('model_policies')
