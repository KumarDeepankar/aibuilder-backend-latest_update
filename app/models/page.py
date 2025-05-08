from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from datetime import datetime
from app.db.base import Base

class Page(Base):
    __tablename__ = "tbl_pages"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("tbl_projects.id"), nullable=False)
    page_name = Column(String(255), nullable=False)
    page_url = Column(String(255), unique=True, nullable=False)
    page_body = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    sort_order = Column(Integer, default=0)