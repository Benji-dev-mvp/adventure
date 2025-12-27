# PostgreSQL Configuration Guide

## Setup PostgreSQL Database

### Option 1: Local PostgreSQL (Development)

1. **Install PostgreSQL**:
```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib

# macOS
brew install postgresql@15

# Start PostgreSQL
sudo service postgresql start  # Linux
brew services start postgresql@15  # macOS
```

2. **Create Database**:
```bash
# Login as postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE artisan_db;
CREATE USER artisan_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE artisan_db TO artisan_user;
\q
```

3. **Update .env file**:
```bash
DATABASE_URL=postgresql://artisan_user:your_secure_password@localhost:5432/artisan_db
```

### Option 2: Docker PostgreSQL (Recommended for Development)

1. **Start PostgreSQL with Docker Compose**:
```bash
cd backend
docker-compose up -d postgres
```

2. **Connection string** (already configured in docker-compose.yml):
```
DATABASE_URL=postgresql://artisan_user:artisan_password@localhost:5432/artisan_db
```

### Option 3: Cloud PostgreSQL (Production)

#### AWS RDS:
```bash
DATABASE_URL=postgresql://username:password@your-db.region.rds.amazonaws.com:5432/artisan_db
```

#### Supabase (Free tier available):
```bash
DATABASE_URL=postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres
```

#### Heroku Postgres:
```bash
DATABASE_URL=postgres://user:pass@ec2-xx-xxx-xxx-xxx.compute-1.amazonaws.com:5432/dbname
```

## Run Database Setup

1. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Run setup script**:
```bash
python setup_postgres.py
```

This will:
- ✅ Create all tables
- ✅ Seed 10,000 realistic leads
- ✅ Seed 20 sample campaigns
- ✅ Train ML lead scoring model (85%+ accuracy)

3. **Verify setup**:
```bash
# Start backend
uvicorn app.main:app --reload --port 8000

# Test in another terminal
curl http://localhost:8000/api/leads | python -m json.tool
```

## Run Migrations (After Schema Changes)

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Add new field"

# Apply migration
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Database Maintenance

### Backup:
```bash
pg_dump -U artisan_user -d artisan_db > backup.sql
```

### Restore:
```bash
psql -U artisan_user -d artisan_db < backup.sql
```

### Monitor Performance:
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Check slow queries
SELECT query, mean_exec_time 
FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;
```

## Troubleshooting

### Connection refused:
```bash
# Check if PostgreSQL is running
sudo service postgresql status  # Linux
brew services list  # macOS

# Check port
sudo lsof -i :5432
```

### Permission denied:
```bash
# Grant all privileges
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE artisan_db TO artisan_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO artisan_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO artisan_user;
```

### SSL errors:
```bash
# Add to connection string
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

## Next Steps

After PostgreSQL is set up:
1. ✅ Test ML model predictions: `POST /api/ai/lead-score`
2. ✅ Test intent signals: `POST /api/intent/track`
3. ✅ Connect OAuth integrations: `GET /api/oauth/gmail/authorize`
4. ✅ Start autonomous campaigns: `POST /api/autonomous/start`
