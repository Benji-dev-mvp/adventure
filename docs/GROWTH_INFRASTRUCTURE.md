# Growth Infrastructure & Strategic Features

## Overview

This document provides detailed information about the new growth infrastructure and strategic features added to the Artisan platform.

## Growth Infrastructure

### 1. Usage Metering & Billing

**Backend Models:**
- `Subscription`: Manages user/team subscriptions with Stripe integration
- `UsageMetrics`: Tracks metered usage (emails sent, leads created, API calls, etc.)
- `Invoice`: Stores billing history and invoice records

**API Endpoints:**
- `GET /api/billing/subscriptions/current` - Get current subscription
- `POST /api/billing/subscriptions` - Create/upgrade subscription
- `PUT /api/billing/subscriptions/{id}` - Update subscription
- `POST /api/billing/subscriptions/{id}/trial` - Start trial
- `DELETE /api/billing/subscriptions/{id}` - Cancel subscription
- `GET /api/billing/usage/current` - Get current usage metrics
- `POST /api/billing/usage/track` - Track usage metric
- `GET /api/billing/invoices` - List invoices
- `GET /api/billing/pricing-plans` - Get pricing plans

**Pricing Tiers:**
| Tier | Price | Emails/month | Leads | Campaigns | Key Features |
|------|-------|--------------|-------|-----------|--------------|
| Free | $0 | 100 | 50 | 1 | Basic AI, Email support |
| Starter | $49 | 5,000 | 1,000 | 10 | Multi-channel, Priority support |
| Professional | $299 | 50,000 | 10,000 | 100 | AI Salesboard, Knowledge Fusion, Workflows, 24/7 support |
| Enterprise | $999 | 500,000 | 100,000 | Unlimited | AI Safety, Voice-to-Action, Custom integrations, Dedicated success manager |

**Frontend Pages:**
- `/billing` - Full billing and usage management page

### 2. Team Plans & Workspace Management

**Backend Models:**
- `Workspace`: Team collaboration spaces
- `TeamMember`: Role-based team membership
- `Invitation`: Secure invitation system with token-based acceptance

**API Endpoints:**
- `GET /api/workspaces/workspaces` - List workspaces
- `GET /api/workspaces/workspaces/{id}` - Get workspace details
- `POST /api/workspaces/workspaces` - Create workspace
- `PUT /api/workspaces/workspaces/{id}` - Update workspace
- `DELETE /api/workspaces/workspaces/{id}` - Delete workspace
- `GET /api/workspaces/workspaces/{id}/members` - List members
- `DELETE /api/workspaces/workspaces/{id}/members/{member_id}` - Remove member
- `POST /api/workspaces/workspaces/{id}/invitations` - Create invitation
- `GET /api/workspaces/invitations` - List invitations
- `POST /api/workspaces/invitations/accept` - Accept invitation
- `DELETE /api/workspaces/invitations/{id}` - Revoke invitation

**Roles:**
- Owner: Full access and workspace management
- Admin: Can invite members and manage settings
- Member: Standard access to workspace features
- Viewer: Read-only access

### 3. Growth Analytics

**Backend Models:**
- `ActivationMetrics`: Track user activation milestones
- `RetentionMetrics`: Monitor engagement and churn risk
- `ExpansionMetrics`: Identify upsell opportunities

**API Endpoints:**
- `GET /api/growth/analytics/activation` - Get activation metrics
- `POST /api/growth/analytics/activation/milestone` - Complete milestone
- `GET /api/growth/analytics/retention` - Get retention metrics
- `GET /api/growth/analytics/expansion` - Get expansion opportunities
- `POST /api/growth/analytics/expansion/{id}/present` - Mark opportunity as presented
- `POST /api/growth/analytics/expansion/{id}/convert` - Mark opportunity as converted

**Activation Milestones:**
- Account created
- Profile completed
- Onboarding completed
- First lead added
- First campaign created
- First campaign launched
- First email sent
- Email account connected
- CRM connected
- Team member invited

### 4. Release Center & Changelog

**Backend Model:**
- `ReleaseNote`: Versioned release notes with categorization

**API Endpoints:**
- `GET /api/growth/releases` - List published releases
- `GET /api/growth/releases/{id}` - Get release details

**Frontend Page:**
- `/releases` - Release center with changelog

**Categories:**
- Feature: New functionality
- Bugfix: Bug fixes
- Improvement: Enhancements
- Security: Security updates

### 5. NPS & Feedback Loop

**Backend Models:**
- `NPSResponse`: Net Promoter Score responses (0-10 scale)
- `FeedbackSubmission`: User feedback and feature requests

**API Endpoints:**
- `POST /api/growth/feedback/nps` - Submit NPS response
- `GET /api/growth/feedback/nps/score` - Calculate NPS score
- `POST /api/growth/feedback` - Submit feedback
- `GET /api/growth/feedback` - List feedback
- `GET /api/growth/feedback/{id}` - Get feedback details
- `PUT /api/growth/feedback/{id}` - Update feedback (admin)
- `POST /api/growth/feedback/{id}/upvote` - Upvote feedback

**Frontend Components:**
- `NPSModal` - NPS survey modal
- `FeedbackWidget` - Fixed feedback button widget
- `useNPSSurvey` - Hook for triggering surveys based on conditions

**NPS Categories:**
- Detractor (0-6): Unhappy customers
- Passive (7-8): Satisfied but unenthusiastic
- Promoter (9-10): Loyal enthusiasts

## Strategic Features

### 1. Adaptive Outbound AI

Learn messaging patterns and Ideal Customer Profile (ICP) characteristics to outperform static sequences.

**Backend Model:**
- `AdaptiveAIConfig`: Configuration and learned patterns

**API Endpoints:**
- `GET /api/strategic/adaptive-ai/config` - Get configuration
- `PUT /api/strategic/adaptive-ai/config` - Update configuration
- `GET /api/strategic/adaptive-ai/insights` - Get AI-learned insights

**Key Capabilities:**
- ICP attribute learning with confidence scoring
- Messaging pattern optimization
- Best-performing template tracking
- Success rate improvement tracking

### 2. AI Salesboard

Real-time performance insights and personalized coaching for sales reps.

**Backend Model:**
- `AISalesboardMetric`: Daily performance metrics

**API Endpoints:**
- `GET /api/strategic/salesboard` - Get salesboard metrics
- `POST /api/strategic/salesboard/sync` - Sync/refresh metrics

**Frontend Page:**
- `/ai-salesboard` - AI-powered sales performance dashboard

**Features:**
- Overall performance score (0-100)
- Pipeline value tracking
- Conversion rate monitoring
- Activity tracking (calls, emails, meetings)
- AI-powered insights (strengths, opportunities, trends)
- Personalized coaching recommendations
- Conversion funnel visualization

### 3. Knowledge Fusion

Auto-generate documentation from calls, emails, and meetings to reduce onboarding burden.

**Backend Model:**
- `KnowledgeDocument`: AI-generated and manual documents

**API Endpoints:**
- `GET /api/strategic/knowledge` - List documents
- `GET /api/strategic/knowledge/{id}` - Get document
- `POST /api/strategic/knowledge` - Create document
- `POST /api/strategic/knowledge/generate-from-call` - Generate from transcript

**Frontend Page:**
- `/knowledge-fusion` - Knowledge management interface

**Document Types:**
- Battle Cards: Competitive intelligence
- Playbooks: Sales processes and strategies
- Objection Handlers: Common objections and responses
- FAQs: Frequently asked questions

**Features:**
- AI-powered document generation from call transcripts
- Confidence scoring for AI-generated content
- View count tracking
- Search and filtering
- Document categorization

### 4. Workflow Map Builder (Coming Soon)

Visual automation canvas for RevOps teams to build complex workflows.

**Backend Model:**
- `WorkflowMap`: Visual workflow configurations

**API Endpoints:**
- `GET /api/strategic/workflows` - List workflows
- `GET /api/strategic/workflows/{id}` - Get workflow
- `POST /api/strategic/workflows` - Create workflow
- `PUT /api/strategic/workflows/{id}` - Update workflow
- `POST /api/strategic/workflows/{id}/execute` - Execute workflow

**Planned Features:**
- Drag-and-drop canvas
- Node-based workflow builder
- Conditional logic
- Multi-channel actions
- Trigger configuration
- Execution history

### 5. Voice-to-Action Agent (Coming Soon)

Automatically create tasks, tickets, and follow-ups from call recordings.

**Backend Model:**
- `VoiceAction`: Call transcripts and extracted actions

**API Endpoints:**
- `POST /api/strategic/voice-actions/process` - Process transcript
- `GET /api/strategic/voice-actions` - List voice actions

**Planned Features:**
- Automatic transcription
- Action extraction (tasks, tickets, follow-ups)
- CRM integration
- Calendar integration
- Confidence scoring
- Manual review and editing

### 6. AI Safety Console (Coming Soon)

Admin guardrails and compliance monitoring for enterprise deployments.

**Backend Model:**
- `AISafetyLog`: Violation tracking and compliance logs

**API Endpoints:**
- `GET /api/strategic/safety/logs` - List safety logs
- `GET /api/strategic/safety/stats` - Get safety statistics
- `PUT /api/strategic/safety/logs/{id}/review` - Review log

**Planned Features:**
- Content filtering (spam, profanity, PII)
- Compliance monitoring (GDPR, CAN-SPAM)
- Violation severity levels
- Automated actions (block, flag, modify)
- Admin review workflow
- Audit trail

## Integration Guide

### Frontend Integration

1. **Import components:**
```jsx
import { NPSModal, FeedbackWidget } from './components/feedback/NPSFeedback';
```

2. **Use billing page:**
```jsx
import BillingAndUsage from './pages/BillingAndUsage';
// Route: /billing
```

3. **Use strategic feature pages:**
```jsx
import AISalesboard from './pages/AISalesboard';
import KnowledgeFusion from './pages/KnowledgeFusion';
import ReleaseCenter from './pages/ReleaseCenter';
// Routes: /ai-salesboard, /knowledge-fusion, /releases
```

### Backend Integration

1. **Import models:**
```python
from app.models.growth_models import (
    Subscription, UsageMetrics, Workspace, 
    ActivationMetrics, NPSResponse, KnowledgeDocument
)
```

2. **Import routers:**
```python
from app.api.routes.billing import router as billing_router
from app.api.routes.workspace import router as workspace_router
from app.api.routes.growth_analytics import router as growth_analytics_router
from app.api.routes.strategic_features import router as strategic_features_router
```

3. **Register routers:**
```python
app.include_router(billing_router, prefix="/api/billing", tags=["billing"])
app.include_router(workspace_router, prefix="/api/workspaces", tags=["workspaces"])
app.include_router(growth_analytics_router, prefix="/api/growth", tags=["growth-analytics"])
app.include_router(strategic_features_router, prefix="/api/strategic", tags=["strategic-features"])
```

## Database Migrations

After adding the new models, run migrations:

```bash
cd backend
alembic revision --autogenerate -m "Add growth infrastructure and strategic features"
alembic upgrade head
```

## Environment Variables

No additional environment variables required for basic functionality. For Stripe integration (future):

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Testing

### Backend Tests
```bash
cd backend
pytest -v tests/test_billing.py
pytest -v tests/test_workspace.py
pytest -v tests/test_growth_analytics.py
pytest -v tests/test_strategic_features.py
```

### Frontend Tests
```bash
npm test -- --testPathPattern="BillingAndUsage|AISalesboard|KnowledgeFusion"
```

## Performance Considerations

- Usage metrics are aggregated per subscription period for efficiency
- Knowledge documents support pagination (default: 20 per page)
- Salesboard metrics are cached for 5 minutes
- NPS surveys are rate-limited to once per 30 days per user

## Security Considerations

- Workspace invitations use secure tokens with 7-day expiration
- API keys are hashed before storage
- Subscription changes require authentication
- Admin endpoints require elevated permissions
- AI Safety Console logs all potentially harmful content

## Future Enhancements

- Stripe payment integration
- Real-time usage tracking with WebSockets
- Advanced workflow builder with visual editor
- Voice-to-text transcription service integration
- Machine learning model for churn prediction
- Advanced A/B testing for pricing
- Multi-currency support
- Custom enterprise plans
- API rate limiting based on subscription tier

## Support

For questions or issues, contact the development team or refer to the main README.md.
