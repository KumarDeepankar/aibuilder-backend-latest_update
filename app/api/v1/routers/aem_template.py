from sqlalchemy import Column, Integer, String, Text, Boolean
from app.db.base import Base

class AEMTemplate(Base):
    __tablename__ = "aem_template"
    
    id = Column(Integer, primary_key=True, index=True)
    aem_template_name = Column(String(100), nullable=False, unique=True)
    aem_template_description = Column(Text)
    aem_template_type = Column(String(50), nullable=False)  # e.g., 'page', 'component', 'form'
    active = Column(Boolean, default=True, nullable=False)