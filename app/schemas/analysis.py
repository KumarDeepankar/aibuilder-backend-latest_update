from pydantic import BaseModel
from typing import Optional, Dict, Any

class AnalysisMetadata(BaseModel):
    project_id: int
    # project_type: str
    # title: str
    # project_metadata: Optional[Dict[str, Any]] = None
    # github_repo_name: Optional[str] = Field(None, max_length=255)
    # github_repo_url: Optional[str] = Field(None, max_length=512)
    # github_repo_id: str
