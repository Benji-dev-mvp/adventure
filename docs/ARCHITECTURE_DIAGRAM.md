# Architecture Diagram: Growth Infrastructure & Strategic Features

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Pages:                          Components:                     │
│  ├─ /billing                     ├─ NPSModal                    │
│  ├─ /ai-salesboard               ├─ FeedbackWidget              │
│  ├─ /knowledge-fusion            └─ Toast System                │
│  ├─ /releases                                                    │
│  └─ /settings (billing tab)                                     │
│                                                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTP/REST API
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   Backend (FastAPI)                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  API Routes:                                                      │
│  ├─ /api/billing/*              ├─ /api/strategic/*             │
│  │  ├─ subscriptions            │  ├─ adaptive-ai               │
│  │  ├─ usage                    │  ├─ salesboard                │
│  │  ├─ invoices                 │  ├─ knowledge                 │
│  │  └─ pricing-plans            │  ├─ workflows                 │
│  │                               │  ├─ voice-actions             │
│  ├─ /api/workspaces/*           │  └─ safety                    │
│  │  ├─ workspaces               │                                │
│  │  ├─ members                  └─ /api/growth/*                │
│  │  └─ invitations                 ├─ analytics/activation      │
│  │                                  ├─ analytics/retention       │
│  │                                  ├─ analytics/expansion       │
│  │                                  ├─ feedback/nps             │
│  │                                  ├─ feedback                  │
│  │                                  └─ releases                  │
│                                                                   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                  Database (PostgreSQL/SQLite)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Growth Infrastructure Tables (9):                               │
│  ├─ subscriptions              ├─ nps_responses                 │
│  ├─ usage_metrics              ├─ feedback_submissions          │
│  ├─ invoices                   ├─ release_notes                 │
│  ├─ workspaces                 ├─ activation_metrics            │
│  ├─ team_members               ├─ retention_metrics             │
│  ├─ invitations                └─ expansion_metrics             │
│                                                                   │
│  Strategic Features Tables (6):                                  │
│  ├─ adaptive_ai_configs        ├─ workflow_maps                 │
│  ├─ ai_salesboard_metrics      ├─ voice_actions                 │
│  ├─ knowledge_documents         └─ ai_safety_logs               │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Subscription & Billing Flow

```
User visits /billing
       │
       ▼
┌─────────────────┐
│ GET /api/billing│
│ /subscriptions/ │
│    current      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ GET /api/billing│
│ /usage/current  │
└────────┬────────┘
         │
         ▼
   Display usage bars
   & subscription info
         │
         ▼
   User clicks "Upgrade"
         │
         ▼
┌─────────────────┐
│ POST /api/      │
│ billing/        │
│ subscriptions   │
└────────┬────────┘
         │
         ▼
  Update subscription
  Create invoice
  Track usage metrics
```

### 2. Team Invitation Flow

```
Owner creates invite
       │
       ▼
┌─────────────────┐
│ POST /api/      │
│ workspaces/{id}/│
│ invitations     │
└────────┬────────┘
         │
         ▼
  Generate secure token
  Send email (external)
         │
         ▼
Invitee clicks link
       │
       ▼
┌─────────────────┐
│ POST /api/      │
│ invitations/    │
│ accept          │
└────────┬────────┘
         │
         ▼
  Create team_member
  Update invitation status
  Grant workspace access
```

### 3. AI Salesboard Data Flow

```
User visits /ai-salesboard
       │
       ▼
┌─────────────────┐
│ GET /api/       │
│ strategic/      │
│ salesboard      │
└────────┬────────┘
         │
         ▼
  Aggregate metrics
  Calculate insights
  Generate coaching tips
         │
         ▼
   Display dashboard
         │
         ▼
User clicks "Sync Now"
       │
       ▼
┌─────────────────┐
│ POST /api/      │
│ strategic/      │
│ salesboard/sync │
└────────┬────────┘
         │
         ▼
  Pull from CRM
  Update metrics
  Recalculate scores
  Refresh insights
```

### 4. Knowledge Fusion Flow

```
User uploads transcript
       │
       ▼
┌─────────────────┐
│ POST /api/      │
│ strategic/      │
│ knowledge/      │
│ generate-from-  │
│ call            │
└────────┬────────┘
         │
         ▼
  AI analyzes content
  Extracts key points
  Structures document
  Scores confidence
         │
         ▼
┌─────────────────┐
│ Create knowledge│
│ _document       │
│ (ai_generated=  │
│  true)          │
└────────┬────────┘
         │
         ▼
  Display in library
  Track view count
  Enable search
```

### 5. NPS Feedback Loop

```
User triggers survey
(time-based or event)
       │
       ▼
  Show NPSModal
  (0-10 scale)
       │
       ▼
User selects score
       │
       ├─ 0-6: Detractor
       ├─ 7-8: Passive
       └─ 9-10: Promoter
       │
       ▼
Request feedback text
  (optional)
       │
       ▼
┌─────────────────┐
│ POST /api/      │
│ growth/feedback/│
│ nps             │
└────────┬────────┘
         │
         ▼
  Store response
  Categorize user
  Calculate NPS
  Flag for follow-up
```

## Component Relationships

### Frontend Components

```
App.jsx
├── ThemeProvider
├── ToastProvider
└── Router
    ├── BillingAndUsage
    │   ├── Card (subscription info)
    │   ├── UsageMetrics
    │   │   └── ProgressBar
    │   ├── PlanCard (x4)
    │   └── InvoiceList
    │
    ├── AISalesboard
    │   ├── PerformanceScore
    │   ├── MetricCard (x4)
    │   ├── InsightCard (x3)
    │   ├── ActivityItem (x3)
    │   └── Charts
    │       ├── AreaChart (pipeline)
    │       └── BarChart (funnel)
    │
    ├── KnowledgeFusion
    │   ├── StatsCard (x4)
    │   ├── SearchBar
    │   ├── FilterButtons
    │   ├── DocumentCard (grid)
    │   ├── CreateDocumentModal
    │   ├── GenerateFromCallModal
    │   └── ViewDocumentModal
    │
    ├── ReleaseCenter
    │   └── ReleaseCard (list)
    │       ├── CategoryBadge
    │       ├── TagList
    │       └── ChangelogContent
    │
    └── NPSModal (global)
        ├── ScoreSelector (0-10)
        ├── FeedbackInput
        └── ThankYou
```

### Backend Models Relationships

```
User
├─ has many Subscriptions
├─ has many Workspaces (owner)
├─ belongs to many Workspaces (member)
├─ has many ActivationMetrics
├─ has many RetentionMetrics
├─ has many ExpansionMetrics
├─ has many NPSResponses
├─ has many FeedbackSubmissions
├─ has many KnowledgeDocuments
├─ has many WorkflowMaps
├─ has many VoiceActions
└─ has many AISalesboardMetrics

Subscription
├─ belongs to User
├─ belongs to Team
├─ has many UsageMetrics
└─ has many Invoices

Workspace
├─ belongs to User (owner)
├─ belongs to Team
├─ has many TeamMembers
└─ has many Invitations

Team
├─ has one Subscription
├─ has many Workspaces
├─ has many TeamMembers
└─ has many Users
```

## Security Architecture

```
┌─────────────────────────────────────────┐
│         Request Layer                    │
├─────────────────────────────────────────┤
│  Middleware Stack:                       │
│  1. CORS                                 │
│  2. SecurityHeaders                      │
│  3. RequestSizeLimit (10MB)              │
│  4. RequestID                            │
│  5. RateLimit (100 req/min)              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Authentication Layer                │
├─────────────────────────────────────────┤
│  - JWT Token Validation                  │
│  - User Session Management               │
│  - API Key Authentication                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Authorization Layer                 │
├─────────────────────────────────────────┤
│  RBAC (Role-Based Access Control):       │
│  - Owner: Full access                    │
│  - Admin: Manage + Invite                │
│  - Member: Read + Write                  │
│  - Viewer: Read only                     │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Business Logic Layer                │
├─────────────────────────────────────────┤
│  - Input Validation (Pydantic)           │
│  - Business Rules                        │
│  - Data Transformation                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      Data Access Layer                   │
├─────────────────────────────────────────┤
│  - SQL Injection Prevention (ORM)        │
│  - Prepared Statements                   │
│  - Query Optimization                    │
│  - Transaction Management                │
└──────────────┬──────────────────────────┘
               │
               ▼
        ┌──────────┐
        │ Database │
        └──────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────┐
│               Load Balancer (Nginx)              │
└──────────┬─────────────────────┬─────────────────┘
           │                     │
           ▼                     ▼
┌──────────────────┐   ┌──────────────────┐
│  Frontend App    │   │  Backend API     │
│  (React + Vite)  │   │  (FastAPI)       │
│  Port: 3004      │   │  Port: 8000      │
└──────────────────┘   └────────┬─────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  PostgreSQL Database  │
                    │  (Primary)            │
                    └───────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │  Redis Cache          │
                    │  (Session + Metrics)  │
                    └───────────────────────┘
```

## Integration Points

### External Services (Future)

```
Artisan Platform
       │
       ├─► Stripe API
       │   └─ Payments, Subscriptions, Webhooks
       │
       ├─► SendGrid/AWS SES
       │   └─ Email delivery, Invitations
       │
       ├─► Twilio
       │   └─ SMS, Voice calls
       │
       ├─► OpenAI/Anthropic
       │   └─ AI content generation, Analysis
       │
       ├─► Transcription Service
       │   └─ Voice-to-text (Whisper, AssemblyAI)
       │
       └─► CRM Systems
           └─ Salesforce, HubSpot, Pipedrive
```

## Performance Optimization

```
┌─────────────────────────────────────────┐
│          Caching Strategy                │
├─────────────────────────────────────────┤
│                                          │
│  Layer 1: Browser Cache                 │
│  ├─ Static assets (24h)                 │
│  ├─ API responses (5min)                │
│  └─ User preferences (localStorage)     │
│                                          │
│  Layer 2: Redis Cache                   │
│  ├─ Session data (30min)                │
│  ├─ Salesboard metrics (5min)           │
│  ├─ Pricing plans (1h)                  │
│  └─ Release notes (15min)               │
│                                          │
│  Layer 3: Database                       │
│  ├─ Indexed queries                     │
│  ├─ Materialized views                  │
│  └─ Query result cache                  │
│                                          │
└─────────────────────────────────────────┘
```

This architecture supports:
- ✅ Horizontal scaling (multiple backend instances)
- ✅ High availability (load balancing)
- ✅ Fast response times (multi-layer caching)
- ✅ Secure by design (layered security)
- ✅ Extensible (modular architecture)
- ✅ Maintainable (clear separation of concerns)
