from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, Dict, Any

class ProjectBase(BaseModel):
    project_name: str = Field(..., max_length=255)
    project_type: str = Field(..., max_length=100)
    project_description: Optional[str] = None
    title: Optional[str] = Field(None, max_length=255)
    project_metadata: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = True
    github_repo_name: Optional[str] = Field(None, max_length=255)
    github_repo_url: Optional[str] = Field(None, max_length=512)
    github_repo_id: Optional[str] = Field(None, max_length=100)
    github_config: Optional[Dict[str, Any]] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    project_name: Optional[str] = Field(None, max_length=255)
    project_type: Optional[str] = Field(None, max_length=100)
    project_description: Optional[str] = None
    title: Optional[str] = Field(None, max_length=255)
    project_metadata: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    github_repo_name: Optional[str] = Field(None, max_length=255)
    github_repo_url: Optional[str] = Field(None, max_length=512)
    github_repo_id: Optional[str] = Field(None, max_length=100)
    github_config: Optional[Dict[str, Any]] = None

class ProjectInDB(ProjectBase):
    id: int
    created_date: datetime
    updated_at: Optional[datetime] = None
    github_last_sync: Optional[datetime] = None
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 1,
                "project_name": "ecommerce-platform",
                "project_type": "web",
                "created_date": "2023-08-01T12:00:00",
                "title": "E-Commerce Platform",
                "is_active": True,
                "github_repo_name": "ecommerce-platform",
                "github_repo_url": "https://github.com/username/ecommerce-platform"
            }
        }