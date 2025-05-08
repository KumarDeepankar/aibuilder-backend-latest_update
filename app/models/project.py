from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, Boolean
from datetime import datetime
from app.db.base import Base

class Project(Base):
    __tablename__ = "tbl_projects"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String(255),  nullable=False)
    project_type = Column(String(100), nullable=False)
    created_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    project_description = Column(Text)
    title = Column(String(255))
    project_metadata = Column(JSON)  # Renamed from 'metadata' to avoid conflict
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, onupdate=datetime.utcnow)
    github_repo_name = Column(String(255))
    github_repo_url = Column(String(512))
    github_repo_id = Column(String(100))
    github_last_sync = Column(DateTime)
    github_config = Column(JSON)