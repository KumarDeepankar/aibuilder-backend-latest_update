from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List, Optional

# Import your database and models
from app.db.deps import get_db
from app.models.project import  Project
from app.models.page import Page
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectInDB
)

from app.schemas.page import (
    PageBase,
    PageUpdate,
    PageCreate,
    PageInDB
)
from app.core.config import settings
from app.schemas.image import ImageInDB, ImageCreate
from app.crud.image import create_image, get_images_by_project
from app.services.file_upload import file_upload_service


from app.schemas.aem_template import AEMTemplateInDB, AEMTemplateCreate
from app.crud.aem_template import (
    get_active_aem_templates,
    create_aem_template,
    get_aem_template_by_name,
    get_aem_template
)


router = APIRouter()

# ===== Project Routes =====
@router.post("/projects/", response_model=ProjectInDB, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """Create a new project"""
    # Check for existing project with the same name
    existing_project = db.query(Project).filter(Project.project_name == project.project_name).first()
    if existing_project:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project with name '{project.project_name}' already exists"
        )
    
    # Validate GitHub URL format if provided
    if project.github_repo_url:
        import re
        github_pattern = r'^https?:\/\/github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+\/?$'
        if not re.match(github_pattern, project.github_repo_url):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid GitHub repository URL format. Expected: https://github.com/owner/repository"
            )
        
        # Check if another project is already using this GitHub URL
        github_project = db.query(Project).filter(Project.github_repo_url == project.github_repo_url).first()
        if github_project:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"GitHub repository URL is already linked to project"
            )
 
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.get("/projects/", response_model=List[ProjectInDB])
def read_projects(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Retrieve all projects with pagination"""
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects

@router.get("/projects/{project_id}", response_model=ProjectInDB)
def read_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific project by ID"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    return project

# ===== Page Routes =====
@router.post("/projects/{project_id}/pages/", response_model=PageInDB, status_code=status.HTTP_201_CREATED)
def create_page(
    project_id: int,
    page: PageCreate,
    db: Session = Depends(get_db)
):
    """Create a page within a project"""
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Check for duplicate page URL
    existing_page = db.query(Page).filter(Page.page_url == page.page_url).first()
    if existing_page:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Page with this URL already exists"
        )
    
    db_page = Page(**page.dict(), project_id=project_id)
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

@router.post("/projects/{project_id}/images/", response_model=ImageInDB)
async def upload_project_image(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    try:
        # Save file and get metadata
        file_metadata = await file_upload_service.save_uploaded_file(file, project_id)
        
        # Create database record
        image_data = ImageCreate(
            filename=file_metadata["filename"],
            filepath=file_metadata["filepath"],
            content_type=file.content_type,
            project_id=project_id,
            file_size=file_metadata["file_size"]
        )
        return create_image(db=db, image=image_data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/projects/{project_id}/images/", response_model=List[ImageInDB])
def read_project_images(
    project_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    return get_images_by_project(db, project_id=project_id, skip=skip, limit=limit)


@router.post("/pages/{page_id}/upload-image/")
async def upload_page_image(
    page_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload an image for a specific page"""
    # Verify page exists
    page = db.query(Page).filter(Page.id == page_id).first()
    if not page:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page not found"
        )
    
    try:
        file_url = await upload_file_to_server(file, settings.UPLOAD_DIR)
        # Here you would typically save the file metadata to your database
        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message": "File uploaded successfully", "file_url": file_url}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

# ===== AI Integration Routes =====
@router.post("/ai/generate-text")
def generate_text_with_ai(
    prompt: str,
    provider: str = "openai",
    db: Session = Depends(get_db)
):
    """Generate text using configured AI provider"""
    try:
        # In a real implementation, you would call your AI service here
        # For example:
        # ai_response = ai_service.generate_text(prompt, provider)
        return {"result": f"Generated text for: {prompt} using {provider}"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"AI generation failed: {str(e)}"
        )

# ===== GitHub Integration Routes =====
@router.post("/projects/{project_id}/deploy-to-github")
def deploy_to_github(
    project_id: int,
    repo_name: str,
    db: Session = Depends(get_db)
):
    """Deploy project to GitHub"""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    try:
        # In a real implementation, you would call GitHub API here
        return {"message": f"Project {project.project_name} deployed to GitHub as {repo_name}"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"GitHub deployment failed: {str(e)}"
        )

# ===== AEM tamplates list =====
@router.post("/aem-templates/", response_model=AEMTemplateInDB)
def create_new_aem_template(
    template: AEMTemplateCreate,
    db: Session = Depends(get_db)
):
    if get_aem_template_by_name(db, template_name=template.aem_template_name):
        raise HTTPException(
            status_code=400,
            detail="AEM Template with this name already exists"
        )
    return create_aem_template(db=db, template=template)

@router.get("/aem-templates/", response_model=List[AEMTemplateInDB])
def read_active_aem_templates(
    template_type: str = None,
    db: Session = Depends(get_db)
):
    """Get all active AEM templates, optionally filtered by type"""
    return get_active_aem_templates(db, template_type=template_type)

@router.get("/aem-templates/{template_id}", response_model=AEMTemplateInDB)
def read_aem_template(
    template_id: int,
    db: Session = Depends(get_db)
):
    template = get_aem_template(db, template_id=template_id)
    if not template:
        raise HTTPException(status_code=404, detail="AEM Template not found")
    return template
#api_router = APIRouter()

# Include your routes here
# Example: api_router.include_router(project_router, prefix="/projects", tags=["projects"])

# Add the router to the main application
# Example: app.include_router(api_router)