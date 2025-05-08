from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PageBase(BaseModel):
    page_name: str = Field(..., max_length=255)
    page_url: str = Field(..., max_length=255)
    page_body: Optional[str] = None
    sort_order: Optional[int] = 0

class PageCreate(PageBase):
    project_id: int

class PageUpdate(BaseModel):
    page_name: Optional[str] = Field(None, max_length=255)
    page_url: Optional[str] = Field(None, max_length=255)
    page_body: Optional[str] = None
    sort_order: Optional[int] = None

class PageInDB(PageBase):
    id: int
    project_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 1,
                "project_id": 1,
                "page_name": "Homepage",
                "page_url": "home",
                "created_at": "2023-08-01T12:00:00",
                "updated_at": "2023-08-01T12:00:00"
            }
        }