from app.db.base import Base
from app.db.session import engine
from sqlalchemy.orm import Session

def init_db(db: Session):
    """Initialize database tables"""
    # Import all models here so they're registered with SQLAlchemy
    from app.models.project import Project
    from app.models.page import Page
    from app.models.image import Image
    
    Base.metadata.create_all(bind=engine)