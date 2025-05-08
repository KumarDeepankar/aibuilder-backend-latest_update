from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, validator, AnyUrl, Field,field_validator
from typing import Optional, Dict, Any, List, Union
from pathlib import Path
import os

class Settings(BaseSettings):
    # ===== Application Configuration =====
    PROJECT_NAME: str = Field("AI Builder", env="PROJECT_NAME")
    API_V1_STR: str = Field("/api/v1", env="API_V1_STR")
    ENVIRONMENT: str = Field("development", env="ENVIRONMENT")  # development|staging|production
    
    # ===== Database Configuration =====
    DB_ENGINE: str = Field("mysql", env="DB_ENGINE")
    DB_HOST: str = Field("localhost", env="DB_HOST")
    DB_PORT: str = Field("3306", env="DB_PORT")
    DB_USER: str = Field(..., env="DB_USER")
    DB_PASSWORD: str = Field(..., env="DB_PASSWORD")
    DB_NAME: str = Field(..., env="DB_NAME")
    SQLALCHEMY_DATABASE_URI: Optional[str] = None
    
    @validator("SQLALCHEMY_DATABASE_URI", pre=True)
    def assemble_db_connection(cls, v: Optional[str], values: Dict[str, Any]) -> Any:
        if isinstance(v, str):
            return v
        if values.get("DB_ENGINE") == "mysql":
            return f"mysql+pymysql://{values['DB_USER']}:{values['DB_PASSWORD']}@{values['DB_HOST']}:{values['DB_PORT']}/{values['DB_NAME']}"
        return PostgresDsn.build(
            scheme=values.get("DB_ENGINE"),
            user=values.get("DB_USER"),
            password=values.get("DB_PASSWORD"),
            host=values.get("DB_HOST"),
            port=values.get("DB_PORT"),
            path=f"/{values.get('DB_NAME') or ''}",
        )
    
    # ===== Security Configuration =====
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60 * 24 * 8, env="ACCESS_TOKEN_EXPIRE_MINUTES")  # 8 days
    JWT_ALGORITHM: str = Field("HS256", env="JWT_ALGORITHM")
    
    # ===== CORS Configuration =====
   
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    
    @field_validator("CORS_ORIGINS", mode='before')
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")] if v != "*" else ["*"]
        return v
    
    
    # ===== AI Providers =====
    OPENAI_API_KEY: Optional[str] = Field(None, env="OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = Field(None, env="ANTHROPIC_API_KEY")
    GEMINI_API_KEY: Optional[str] = Field(None, env="GEMINI_API_KEY")
    
    # ===== Integration Keys =====
    GITHUB_ACCESS_TOKEN: Optional[str] = Field(None, env="GITHUB_ACCESS_TOKEN")
    FIGMA_ACCESS_TOKEN: Optional[str] = Field(None, env="FIGMA_ACCESS_TOKEN")
    FIGMA_TEAM_ID: Optional[str] = Field(None, env="FIGMA_TEAM_ID")
    JIRA_BASE_URL: Optional[AnyUrl] = Field(None, env="JIRA_BASE_URL")
    JIRA_USER_EMAIL: Optional[str] = Field(None, env="JIRA_USER_EMAIL")
    JIRA_API_TOKEN: Optional[str] = Field(None, env="JIRA_API_TOKEN")
    
    # ===== File Storage =====
    UPLOAD_DIR: Path = Field(Path("static/images"), env="UPLOAD_DIR")
    MAX_FILE_SIZE: int = Field(5 * 1024 * 1024, env="MAX_FILE_SIZE")  # 5MB
    ALLOWED_FILE_TYPES: List[str] = Field(
        ["image/jpeg", "image/png", "application/pdf"],
        env="ALLOWED_FILE_TYPES"
    )
  
    # ===== Logging Configuration =====
    LOG_LEVEL: str = Field("INFO", env="LOG_LEVEL")  # DEBUG|INFO|WARNING|ERROR|CRITICAL
    
    class Config:
        case_sensitive = True
        env_file = f".env.{os.getenv('ENVIRONMENT', 'development')}"
        env_file_encoding = 'utf-8'

settings = Settings()