"""
PostgreSQL Setup and Migration Script
Sets up production PostgreSQL database and seeds with initial data
"""
import asyncio
import logging
from typing import List
import random
from datetime import datetime, timedelta

from sqlmodel import SQLModel, Session, select
from sqlalchemy import text

from app.core.db import engine
from app.models.schemas import Lead, Campaign
from app.core.ml_lead_scoring import generate_synthetic_training_data, train_lead_scoring_model

logger = logging.getLogger(__name__)


def setup_database():
    """Create all tables"""
    logger.info("Creating database tables...")
    SQLModel.metadata.create_all(engine)
    logger.info("Database tables created successfully")


def seed_leads(session: Session, count: int = 10000):
    """Seed database with realistic leads"""
    logger.info(f"Seeding {count} leads...")
    
    # Company data pools
    companies = [
        "TechCorp", "DataScale", "CloudFirst", "SaaSify", "GrowthLabs",
        "EnterpriseHub", "InnovateCo", "ScaleUp", "VentureStack", "BuildFast",
        "AgileWorks", "DevTools Inc", "MarketPro", "SalesForce Plus", "AnalyticsHub"
    ]
    
    industries = ["SaaS", "E-commerce", "FinTech", "HealthTech", "EdTech", "MarTech"]
    titles = ["CEO", "CTO", "VP Sales", "VP Marketing", "Director of Revenue", "Head of Growth"]
    locations = ["San Francisco, CA", "New York, NY", "Austin, TX", "Boston, MA", "Seattle, WA"]
    
    batch_size = 1000
    for batch_start in range(0, count, batch_size):
        leads = []
        for i in range(batch_size):
            if batch_start + i >= count:
                break
            
            first_names = ["Sarah", "Michael", "Emily", "David", "Jessica", "James", "Jennifer", "John"]
            last_names = ["Johnson", "Chen", "Smith", "Brown", "Garcia", "Wilson", "Taylor", "Anderson"]
            
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            company = random.choice(companies)
            
            lead = Lead(
                name=f"{first_name} {last_name}",
                email=f"{first_name.lower()}.{last_name.lower()}@{company.lower().replace(' ', '')}.com",
                company=company,
                title=random.choice(titles),
                industry=random.choice(industries),
                location=random.choice(locations),
                phone=f"+1-555-{random.randint(100, 999)}-{random.randint(1000, 9999)}",
                linkedin_url=f"https://linkedin.com/in/{first_name.lower()}{last_name.lower()}",
                company_size=random.choice([50, 100, 500, 1000, 5000]),
                score=random.randint(0, 100),
                status=random.choice(["new", "contacted", "qualified", "unqualified"]),
                email_opens=random.randint(0, 10),
                link_clicks=random.randint(0, 5),
                website_visits=random.randint(0, 8)
            )
            leads.append(lead)
        
        session.add_all(leads)
        session.commit()
        logger.info(f"Seeded {batch_start + len(leads)} / {count} leads")
    
    logger.info(f"Successfully seeded {count} leads")


def seed_campaigns(session: Session, count: int = 20):
    """Seed database with sample campaigns"""
    logger.info(f"Seeding {count} campaigns...")
    
    campaign_names = [
        "Q1 Enterprise Outreach",
        "Product Launch - SaaS Segment",
        "Re-engagement Campaign",
        "New Feature Announcement",
        "End of Quarter Push",
        "Partner Outreach",
        "Industry Leaders Campaign",
        "Competitor Switch Campaign"
    ]
    
    objectives = [
        "Book 50 demos",
        "Generate 100 SQLs",
        "Re-engage cold leads",
        "Launch new product",
        "Close Q4 pipeline",
        "Build partnerships"
    ]
    
    for i in range(count):
        campaign = Campaign(
            name=random.choice(campaign_names) + f" #{i+1}",
            objective=random.choice(objectives),
            status=random.choice(["draft", "active", "paused", "completed"]),
            emails_sent=random.randint(0, 5000),
            opens=random.randint(0, 2000),
            clicks=random.randint(0, 500),
            replies=random.randint(0, 200)
        )
        session.add(campaign)
    
    session.commit()
    logger.info(f"Successfully seeded {count} campaigns")


def train_ml_model():
    """Train lead scoring ML model with synthetic data"""
    logger.info("Training ML lead scoring model...")
    
    # Generate training data
    training_data, labels = generate_synthetic_training_data(n_samples=5000)
    
    # Train model
    from app.core.ml_lead_scoring import lead_scorer
    metrics = lead_scorer.train(training_data, labels)
    
    logger.info(f"Model training complete!")
    logger.info(f"Accuracy: {metrics['accuracy']:.3f}")
    logger.info(f"AUC-ROC: {metrics['auc_roc']:.3f}")
    logger.info(f"F1 Score: {metrics['f1_score']:.3f}")
    
    # Save model
    lead_scorer.save_model('models/lead_scoring_model.pkl')
    logger.info("Model saved to models/lead_scoring_model.pkl")
    
    return metrics


def verify_postgresql_connection():
    """Verify PostgreSQL connection"""
    try:
        with Session(engine) as session:
            result = session.execute(text("SELECT version();"))
            version = result.scalar()
            logger.info(f"PostgreSQL connected successfully: {version}")
            return True
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL: {e}")
        return False


def main():
    """Main setup function"""
    print("=" * 60)
    print("PostgreSQL Database Setup")
    print("=" * 60)
    
    # Step 1: Verify connection
    print("\n[1/5] Verifying PostgreSQL connection...")
    if not verify_postgresql_connection():
        print("❌ PostgreSQL connection failed. Please check DATABASE_URL in .env")
        return
    print("✅ PostgreSQL connected")
    
    # Step 2: Create tables
    print("\n[2/5] Creating database tables...")
    setup_database()
    print("✅ Tables created")
    
    # Step 3: Seed leads
    print("\n[3/5] Seeding leads (this may take a minute)...")
    with Session(engine) as session:
        # Check if already seeded
        existing = session.exec(select(Lead)).first()
        if existing:
            print("⚠️  Database already contains leads. Skipping...")
        else:
            seed_leads(session, count=10000)
            print("✅ 10,000 leads seeded")
    
    # Step 4: Seed campaigns
    print("\n[4/5] Seeding campaigns...")
    with Session(engine) as session:
        existing = session.exec(select(Campaign)).first()
        if existing:
            print("⚠️  Database already contains campaigns. Skipping...")
        else:
            seed_campaigns(session, count=20)
            print("✅ 20 campaigns seeded")
    
    # Step 5: Train ML model
    print("\n[5/5] Training ML lead scoring model...")
    try:
        metrics = train_ml_model()
        print(f"✅ Model trained (Accuracy: {metrics['accuracy']:.1%}, AUC: {metrics['auc_roc']:.3f})")
    except Exception as e:
        print(f"⚠️  Model training failed: {e}")
        print("    You may need to install: pip install xgboost scikit-learn")
    
    print("\n" + "=" * 60)
    print("✅ Database setup complete!")
    print("=" * 60)
    print("\nNext steps:")
    print("1. Start backend: uvicorn app.main:app --reload")
    print("2. Test leads API: curl http://localhost:8000/api/leads")
    print("3. Check admin panel: http://localhost:8000/admin")


if __name__ == "__main__":
    main()
