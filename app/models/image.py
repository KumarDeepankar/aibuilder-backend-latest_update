from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from app.db.base import Base

class Image(Base):
    __tablename__ = "tbl_images"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(
        Integer, 
        ForeignKey(
            "tbl_projects.id", 
            name="fk_image_project",  # Explicit constraint naming
            ondelete="CASCADE"
        ),
        nullable=False
    )
    filename = Column(String(255), nullable=False)
    filepath = Column(String(512), nullable=False)
    content_type = Column(String(100), nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    file_size = Column(Integer)
    width = Column(Integer)
    height = Column(Integer)
    alt_text = Column(String(255))