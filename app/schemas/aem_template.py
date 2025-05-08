from pydantic import BaseModel, Field
from typing import Optional

class AEMTemplateBase(BaseModel):
    aem_template_name: str = Field(..., max_length=100)
    aem_template_description: Optional[str] = None
    aem_template_type: str = Field(..., max_length=50)
    active: Optional[bool] = True

class AEMTemplateCreate(AEMTemplateBase):
    pass

class AEMTemplateUpdate(BaseModel):
    aem_template_name: Optional[str] = Field(None, max_length=100)
    aem_template_description: Optional[str] = None
    aem_template_type: Optional[str] = Field(None, max_length=50)
    active: Optional[bool] = None

class AEMTemplateInDB(AEMTemplateBase):
    id: int
    
    class Config:
        orm_mode = True