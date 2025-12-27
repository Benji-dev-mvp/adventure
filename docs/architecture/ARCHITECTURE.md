# Enterprise Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FRONTEND (React)                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Landing Page │ Dashboard │ Campaigns │ Leads │ AI Assistant         │  │
│  │  Analytics │ Settings │ Templates │ Admin Dashboard                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    │ HTTP/REST                               │
│                                    ▼                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FASTAPI BACKEND                                      │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                     API ROUTES                                      │    │
│  │  /leads  /campaigns  /analytics  /auth  /ai  /admin  /health      │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                     MIDDLEWARE                                      │    │
│  │  • CORS  • Security Headers  • Request Size Limit                  │    │
│  │  • Rate Limiting  • Request ID  • Trusted Host                     │    │
│  └────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                   CORE MODULES                                      │    │
│  │  ┌─────────────┐  ┌──────────┐  ┌─────────────┐  ┌──────────┐    │    │
│  │  │   Security  │  │  Audit   │  │   Sentry    │  │  Celery  │    │    │
│  │  │   (RBAC)    │  │  Logging │  │   (Errors)  │  │  (Tasks) │    │    │
│  │  └─────────────┘  └──────────┘  └─────────────┘  └──────────┘    │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
         │              │              │              │
         │              │              │              │
         ▼              ▼              ▼              ▼
┌───────────────┐ ┌───────────┐ ┌───────────┐ ┌──────────────────┐
│   Database    │ │   Redis   │ │  Sentry   │ │  Celery Workers  │
│  (PostgreSQL) │ │  (Cache & │ │  (Error   │ │  ┌────────────┐  │
│               │ │   Broker) │ │  Tracking)│ │  │ Email Queue│  │
│  • Users      │ │           │ │           │ │  │ Camp Queue │  │
│  • Campaigns  │ │  • Tasks  │ │  • Errors │ │  │ Analytics  │  │
│  • Leads      │ │  • Cache  │ │  • Perf   │ │  └────────────┘  │
│  • Audit Logs │ │  • Queues │ │  • Users  │ │                  │
└───────────────┘ └───────────┘ └───────────┘ └──────────────────┘
```

## Request Flow Diagrams

### 1. User Authentication & Authorization

```
┌──────┐                                 ┌─────────┐
│Client│                                 │ Backend │
└───┬──┘                                 └────┬────┘
    │                                         │
    │ POST /api/auth/login                   │
    │ {email, password}                      │
    ├────────────────────────────────────────▶
    │                                         │
    │                                    ┌────▼────┐
    │                                    │Validate │
    │                                    │Password │
    │                                    └────┬────┘
    │                                         │
    │                                    ┌────▼────┐
    │                                    │Get User │
    │                                    │Role +   │
    │                                    │Perms    │
    │                                    └────┬────┘
    │                                         │
    │                                    ┌────▼────┐
    │                                    │Generate │
    │                                    │JWT      │
    │                                    └────┬────┘
    │                                         │
    │ {token, user, permissions}             │
    │◀────────────────────────────────────────┤
    │                                         │
    │ GET /api/admin/users                   │
    │ Authorization: Bearer {token}          │
    ├────────────────────────────────────────▶
    │                                         │
    │                                    ┌────▼────┐
    │                                    │Validate │
    │                                    │JWT      │
    │                                    └────┬────┘
    │                                         │
    │                                    ┌────▼────┐
    │                                    │Check    │
    │                                    │Role/    │
    │                                    │Perms    │
    │                                    └────┬────┘
    │                                         │
    │                                    ┌────▼────┐
    │                                    │Execute  │
    │                                    │Request  │
    │                                    └────┬────┘
    │                                         │
    │                                    ┌────▼────┐
    │                                    │Log to   │
    │                                    │Audit    │
    │                                    └────┬────┘
    │                                         │
    │ {users: [...]}                         │
    │◀────────────────────────────────────────┤
    │                                         │
```

### 2. Background Job Processing

```
┌──────┐         ┌─────────┐         ┌───────┐         ┌────────┐
│Client│         │ Backend │         │ Redis │         │Worker  │
└───┬──┘         └────┬────┘         └───┬───┘         └───┬────┘
    │                 │                  │                 │
    │ POST /campaigns │                  │                 │
    │ {campaign_data} │                  │                 │
    ├─────────────────▶                  │                 │
    │                 │                  │                 │
    │            ┌────▼────┐             │                 │
    │            │ Create  │             │                 │
    │            │Campaign │             │                 │
    │            │ in DB   │             │                 │
    │            └────┬────┘             │                 │
    │                 │                  │                 │
    │                 │ Queue Task       │                 │
    │                 ├──────────────────▶                 │
    │                 │ send_campaign_   │                 │
    │                 │ emails.delay()   │                 │
    │                 │                  │                 │
    │ {success}       │                  │                 │
    │◀────────────────┤                  │                 │
    │                 │                  │                 │
    │                 │                  │  Fetch Task     │
    │                 │                  │◀────────────────┤
    │                 │                  │                 │
    │                 │                  │  Task Data      │
    │                 │                  ├─────────────────▶
    │                 │                  │                 │
    │                 │                  │            ┌────▼────┐
    │                 │                  │            │ Process │
    │                 │                  │            │ Task:   │
    │                 │                  │            │ Send    │
    │                 │                  │            │ Emails  │
    │                 │                  │            └────┬────┘
    │                 │                  │                 │
    │                 │                  │  Task Complete  │
    │                 │                  │◀────────────────┤
    │                 │                  │                 │
```

### 3. Audit Logging Flow

```
┌──────┐         ┌─────────┐         ┌────────┐         ┌──────────┐
│Client│         │ Backend │         │Database│         │Admin     │
└───┬──┘         └────┬────┘         └───┬────┘         │Dashboard │
    │                 │                  │               └────┬─────┘
    │ DELETE          │                  │                    │
    │ /campaigns/123  │                  │                    │
    ├─────────────────▶                  │                    │
    │                 │                  │                    │
    │            ┌────▼────┐             │                    │
    │            │@audit_  │             │                    │
    │            │action   │             │                    │
    │            │decorator│             │                    │
    │            └────┬────┘             │                    │
    │                 │                  │                    │
    │            ┌────▼────┐             │                    │
    │            │Execute  │             │                    │
    │            │Delete   │             │                    │
    │            └────┬────┘             │                    │
    │                 │                  │                    │
    │                 │ Write Audit Log  │                    │
    │                 ├──────────────────▶                    │
    │                 │ • User ID        │                    │
    │                 │ • Action         │                    │
    │                 │ • Resource       │                    │
    │                 │ • IP Address     │                    │
    │                 │ • Timestamp      │                    │
    │                 │ • Success/Error  │                    │
    │                 │                  │                    │
    │ {success}       │                  │                    │
    │◀────────────────┤                  │                    │
    │                 │                  │                    │
    │                 │                  │  GET /admin/       │
    │                 │                  │  audit-logs        │
    │                 │◀────────────────────────────────────┤
    │                 │                  │                    │
    │                 │ Query Audit Logs │                    │
    │                 ├──────────────────▶                    │
    │                 │                  │                    │
    │                 │ Audit Log Data   │                    │
    │                 │◀─────────────────┤                    │
    │                 │                  │                    │
    │                 │ {logs: [...]}    │                    │
    │                 ├──────────────────────────────────────▶
    │                 │                  │                    │
```

### 4. Health Check Monitoring

```
┌──────────┐         ┌─────────┐         ┌─────────┐
│Load      │         │ Backend │         │Services │
│Balancer  │         │         │         │         │
└────┬─────┘         └────┬────┘         └────┬────┘
     │                    │                   │
     │ GET /api/health    │                   │
     ├────────────────────▶                   │
     │                    │                   │
     │               ┌────▼────┐              │
     │               │Check    │              │
     │               │Status   │              │
     │               └────┬────┘              │
     │                    │                   │
     │ {status: "healthy"}│                   │
     │◀───────────────────┤                   │
     │                    │                   │
     │ GET /api/health/   │                   │
     │ detailed           │                   │
     ├────────────────────▶                   │
     │                    │                   │
     │               ┌────▼────┐              │
     │               │Check CPU│              │
     │               │Memory   │              │
     │               │Disk     │              │
     │               └────┬────┘              │
     │                    │                   │
     │                    │  Check DB         │
     │                    ├───────────────────▶
     │                    │                   │
     │                    │  DB Status        │
     │                    │◀──────────────────┤
     │                    │                   │
     │                    │  Check Redis      │
     │                    ├───────────────────▶
     │                    │                   │
     │                    │  Redis Status     │
     │                    │◀──────────────────┤
     │                    │                   │
     │               ┌────▼────┐              │
     │               │Aggregate│              │
     │               │Metrics  │              │
     │               └────┬────┘              │
     │                    │                   │
     │ {system: {...},    │                   │
     │  services: {...}}  │                   │
     │◀───────────────────┤                   │
     │                    │                   │
```

## Data Flow

### Campaign Creation with Full Enterprise Features

```
1. User Action
   └─▶ React Admin Dashboard

2. API Request
   └─▶ POST /api/campaigns
       └─▶ Middleware Chain
           ├─▶ CORS Check
           ├─▶ Security Headers
           ├─▶ Rate Limit Check
           ├─▶ Request Size Check
           └─▶ Request ID Assignment

3. Authentication & Authorization
   └─▶ JWT Validation
       └─▶ Get Current User
           └─▶ Check Permissions
               ├─▶ require_permission(CAMPAIGN_CREATE)
               └─▶ user.has_permission() ✓

4. Business Logic
   └─▶ Create Campaign in Database
       └─▶ Success

5. Audit Logging
   └─▶ @audit_action decorator
       └─▶ Write Audit Log
           ├─▶ User ID: 123
           ├─▶ Action: CAMPAIGN_CREATED
           ├─▶ Resource: campaign/456
           ├─▶ IP: 192.168.1.1
           ├─▶ Success: true
           └─▶ Timestamp: 2024-01-15T10:30:00Z

6. Background Jobs
   └─▶ Queue Email Tasks
       └─▶ send_bulk_campaign_emails.delay()
           └─▶ Redis Queue (emails)
               └─▶ Celery Worker
                   ├─▶ Task 1: Send to lead@example.com
                   ├─▶ Task 2: Send to lead2@example.com
                   └─▶ Task N: Send to leadN@example.com

7. Error Tracking (if error occurs)
   └─▶ Sentry Capture
       ├─▶ Error Details
       ├─▶ User Context
       ├─▶ Breadcrumb Trail
       └─▶ Send to Sentry Dashboard

8. Response
   └─▶ {
         "id": 456,
         "status": "created",
         "emails_queued": 1000
       }
```

## Component Interaction Matrix

| Component | Interacts With | Purpose |
|-----------|---------------|---------|
| **Frontend** | Backend API | User interface, data display |
| **Backend API** | Database, Redis, Sentry | Request handling, business logic |
| **RBAC System** | Database (Users), API Routes | Access control |
| **Audit Logging** | Database, All API Routes | Compliance tracking |
| **Celery Workers** | Redis, Database, Email Service | Background processing |
| **Redis** | Backend, Celery | Cache + message broker |
| **Sentry** | Backend, Celery | Error tracking |
| **Health Checks** | All Services | System monitoring |

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  React 18 + Vite + Tailwind CSS + React Router             │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                        BACKEND                               │
│  FastAPI + Uvicorn + Pydantic + SQLModel                    │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                    ENTERPRISE FEATURES                       │
│  • RBAC: Custom roles + permissions system                  │
│  • Audit: In-memory → PostgreSQL (production)               │
│  • Tasks: Celery 5.3 + Redis 6+                             │
│  • Errors: Sentry SDK with FastAPI integration              │
│  • Health: psutil + custom service checks                   │
└─────────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                       INFRASTRUCTURE                         │
│  • Database: PostgreSQL 14+ / SQLite (dev)                  │
│  • Cache/Broker: Redis 6+                                   │
│  • Monitoring: Sentry + Health Endpoints                    │
│  • Deployment: Docker + Kubernetes ready                    │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Topology

### Development
```
┌─────────────┐
│ Developer   │
│ Machine     │
│             │
│ ┌─────────┐ │
│ │Frontend │ │ :3004
│ │(Vite)   │ │
│ └─────────┘ │
│             │
│ ┌─────────┐ │
│ │Backend  │ │ :8000
│ │(Uvicorn)│ │
│ └─────────┘ │
│             │
│ ┌─────────┐ │
│ │Celery   │ │
│ │Worker   │ │
│ └─────────┘ │
│             │
│ ┌─────────┐ │
│ │Redis    │ │ :6379
│ └─────────┘ │
└─────────────┘
```

### Production (Kubernetes)
```
┌──────────────────────────────────────────────────────────────┐
│                      Load Balancer                           │
│                     (Ingress Controller)                     │
└────────────┬────────────────────────┬─────────────────────────┘
             │                        │
    ┌────────▼────────┐      ┌────────▼────────┐
    │  Frontend Pod   │      │  Frontend Pod   │
    │  (NGINX + React)│      │  (NGINX + React)│
    └────────┬────────┘      └────────┬────────┘
             │                        │
             └───────────┬────────────┘
                         │
              ┌──────────▼───────────┐
              │   Backend Service    │
              │   (Load Balanced)    │
              └──────────┬───────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼──────┐ ┌───────▼──────┐ ┌──────▼───────┐
│ Backend Pod 1│ │ Backend Pod 2│ │Backend Pod 3 │
│ (FastAPI)    │ │ (FastAPI)    │ │ (FastAPI)    │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │
       └────────────────┼────────────────┘
                        │
       ┌────────────────┼────────────────┐
       │                │                │
┌──────▼──────┐  ┌──────▼──────┐  ┌─────▼──────┐
│ PostgreSQL  │  │   Redis     │  │  Celery    │
│ (StatefulSet│  │ (StatefulSet│  │  Workers   │
│  + Volume)  │  │  + Volume)  │  │ (Deployment│
└─────────────┘  └─────────────┘  └────────────┘
```

## Monitoring Dashboard View

```
┌──────────────────────────────────────────────────────────────────┐
│                      ADMIN DASHBOARD                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  System Health:                     Active Users: 1,234          │
│  ● Healthy                          Active Campaigns: 87         │
│                                     API Calls Today: 45.2K       │
│  ┌─────────────────┐                                            │
│  │ CPU:  35% ████  │                Background Jobs Queue:      │
│  │ MEM:  47% █████ │                • Emails: 234 pending       │
│  │ DISK: 36% ████  │                • Campaigns: 12 pending     │
│  └─────────────────┘                • Analytics: 5 pending      │
│                                                                   │
│  Services:                          Recent Audit Logs:           │
│  ✓ Database: Healthy                ┌──────────────────────────┐│
│  ✓ Redis: Healthy                   │user@example.com          ││
│  ✓ Email: Healthy                   │CAMPAIGN_CREATED          ││
│  ⚠ Backup: Warning                  │2024-01-15 10:30:00      ││
│                                     ├──────────────────────────┤│
│  Error Rate (24h): 0.02%            │admin@example.com         ││
│  Avg Response Time: 145ms           │USER_UPDATED              ││
│                                     │2024-01-15 10:25:00      ││
│  Uptime: 99.98%                     └──────────────────────────┘│
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

**This architecture provides:**
- ✅ Scalability (horizontal scaling, background jobs)
- ✅ Security (RBAC, audit logging, middleware)
- ✅ Reliability (error tracking, health checks)
- ✅ Observability (monitoring, logging, metrics)
- ✅ Compliance (audit trails, user tracking)
- ✅ Performance (caching, async tasks, optimized queries)
