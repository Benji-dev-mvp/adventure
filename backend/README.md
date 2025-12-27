# Python Backend (FastAPI)

A lightweight FastAPI backend to support the React frontend.

## Quick Start

1. Create a virtual environment and install dependencies:

```bash
cd backend
python3 -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
```

2. Run the server:

```bash
uvicorn app.main:app --reload --port 8001
```

3. Test endpoints:
- Health: http://localhost:8001/health
- Leads: http://localhost:8001/api/leads
- Campaigns: http://localhost:8001/api/campaigns
- Analytics: http://localhost:8001/api/analytics

## Security Hardening

The backend includes multiple layers of security protection:

### Middleware Stack
- **CORS**: Enabled for Vite dev server origins (`http://localhost:5173`, `http://127.0.0.1:5173`)
- **Trusted Host**: Restricts Host header to prevent Host header attacks
- **HTTPS Redirect**: Optional toggle for production TLS deployments
- **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **Request Size Limit**: Blocks requests exceeding 1MB (configurable via `MAX_REQUEST_BODY_SIZE`)

### Input Validation
- Length constraints on all text fields
- Email validation using `EmailStr`
- Text sanitization for campaign inputs
- Pydantic models with strict type checking

### Configuration
Security settings can be tuned in [`app/core/config.py`](app/core/config.py):
- `allowed_hosts`: List of permitted Host header values
- `max_request_body_size`: Maximum request body size in bytes
- `enable_https_redirect`: Toggle HTTPS-only mode

## Project Structure
```
backend/
  app/
    main.py
    core/
      config.py
    api/
      routes/
        leads.py
        campaigns.py
        analytics.py
        auth.py
    models/
      schemas.py
  requirements.txt
  README.md
```
