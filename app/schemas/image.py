from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ImageBase(BaseModel):
    filename: str = Field(..., max_length=255)
    filepath: str = Field(..., max_length=512)
    content_type: str = Field(..., max_length=100)
    project_id: int

class ImageCreate(ImageBase):
    file_size: Optional[int] = None
    width: Optional[int] = None
    height: Optional[int] = None
    alt_text: Optional[str] = Field(None, max_length=255)

class ImageUpdate(BaseModel):
    alt_text: Optional[str] = Field(None, max_length=255)

class ImageInDB(ImageBase):
    id: int
    upload_date: datetime
    file_size: Optional[int]
    width: Optional[int]
    height: Optional[int]
    
    class Config:
        orm_mode = True