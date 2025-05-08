# app/main.py
import logging
from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from typing import List, Optional, Any
# from PIL import Image as PILImage # No longer needed here directly for captioning
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.schemas.chat_schemas import AnalyzeImage, MappingData, GenerateDocs
from app.services.chat_service import analyze_image, load_block_kb, map_ui_to_blocks, generate_docs
from app.schemas.analysis import AnalysisMetadata

from app.api.v1.routers import router
from app.core.config import settings
from app.core.logging import setup_logging
from app.db.session import SessionLocal, engine # Added engine for Sessionmaker
from app.db.init_db import init_db
# from app.models.user import User
from app.models.image import Image
from app.models.page import Page
from app.models.project import Project
from app.schemas.project import ProjectInDB

from dotenv import load_dotenv
import os
from sqlalchemy.orm import sessionmaker # Added for Session
from pydantic import BaseModel # Still used for MetadataRequest example
from pathlib import Path # Added for Path operations

# --- Image Captioning Module Imports ---
from app.services import captioning_service # Import the new service
from app.schemas.captioning_schemas import ImageCaptionRequest, CaptionSummaryResponse # Import schemas

# --- Logging Setup ---
setup_logging()
logger = logging.getLogger(__name__)

# --- Load Environment Variables ---
load_dotenv()

# --- FastAPI App Initialization ---
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise Project Management System API with Image Captioning",
    version="1.1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# --- Set up CORS ---
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# --- Include API routers ---
app.include_router(router, prefix=settings.API_V1_STR)

# --- Serve static files (uploaded images) ---
static_dir = Path("static")
static_dir.mkdir(exist_ok=True)
images_static_dir = static_dir / "images" # This is a sub-directory within static_dir
images_static_dir.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")


# --- Database Session Setup ---
# Session = sessionmaker(bind=engine) # Corrected typo: SessionLocal is already configured session
# No, SessionLocal is a factory for sessions. engine is needed for init_db if not already available.
# For db operations within endpoints, you'd use `db: Session = Depends(get_db)` usually.
# The Session variable for sessionmaker here might be redundant if get_db is used consistently.
# init_db itself uses SessionLocal.


# --- FastAPI Application Event Handlers ---
@app.on_event("startup")
async def on_startup():
    """Initialize database and captioning model"""
    logger.info("Performing startup tasks...")

    # Initialize database
    db = SessionLocal()
    try:
        logger.info("Initializing database...")
        init_db(db) # init_db likely uses SessionLocal internally or takes a session
        logger.info("Database initialized.")
    except Exception as db_exc:
        logger.error(f"Database initialization failed: {db_exc}")
    finally:
        db.close()

    # Initialize the Hugging Face image captioning model via the service
    await captioning_service.init_captioning_model()


@app.get("/")
async def root():
    return {
        "message": f"Welcome to the {settings.PROJECT_NAME} API",
        "docs": "/docs",
        "redoc": "/redoc",
    }

# --- Existing Endpoints (Simplified for Brevity - ensure they use SessionLocal or Depends(get_db) for db ops) ---

@app.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Ensure the 'images' subdirectory under 'static' exists
        upload_dir = images_static_dir # Use the Path object
        upload_dir.mkdir(parents=True, exist_ok=True) # Ensure full path exists

        img_path = upload_dir / file.filename # Use Path object for path construction
        with open(img_path, "wb") as f:
             contents = await file.read()
             f.write(contents)
        logger.info(f"Image uploaded: {file.filename} to {img_path}")
        # Return path relative to static mount point
        return {"filename": f"images/{file.filename}", "detail": "Image Uploaded"}
    except Exception as e:
        logger.error(f"Image upload failed for {file.filename}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Image upload failed")

@app.post("/analyze")
async def analyze(data: AnalyzeImage):
    try:
        # data.img_name should be relative to the static_dir, e.g., "images/myimage.png"
        img_path = static_dir / data.img_name # Use Path object
        if not img_path.exists():
             raise HTTPException(status_code=404, detail=f"Image not found: {data.img_name}")
        image_data = analyze_image(image_path=str(img_path))
        logger.info(f"Image analyzed: {data.img_name}")
        return image_data
    except Exception as e:
        logger.error(f"Image analysis failed for {data.img_name}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Image analysis failed")

@app.post("/mapping")
async def mapping(data: MappingData):
    try:
        block_data = await map_ui_to_blocks(page_json=data.components_data, block_kb=load_block_kb())
        logger.info("UI components mapped to blocks.")
        return block_data
    except Exception as e:
        logger.error(f"Mapping failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Mapping failed")


@app.post("/generate-doc")
async def generate(data: GenerateDocs):
    try:
        img_path = static_dir / data.img_name # Use Path object
        if not img_path.exists():
             raise HTTPException(status_code=404, detail=f"Image not found: {data.img_name}")
        google_docs_link = await generate_docs(ui_json=data.components_data, mapped=data.mapped_data, image_path=str(img_path))
        logger.info(f"Document generated for image: {data.img_name}")
        return google_docs_link
    except Exception as e:
        logger.error(f"Document generation failed for {data.img_name}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Document generation failed")

# Example Pydantic model for the request, if you change how project_id is passed
class MetadataRequest(BaseModel):
    project_id: int

# This endpoint needs a dependency injection for the DB session, e.g., from app.db.deps import get_db
# from app.db.deps import get_db # Assuming get_db provides a Session
# @app.post('/api/analysis-metadata', response_model=ProjectInDB)
# async def create_metadata(data: MetadataRequest, db: SessionLocal = Depends(get_db)):
@app.post('/api/analysis-metadata', response_model=ProjectInDB) # Keeping original for now, but add Depends(get_db)
async def create_metadata(data: AnalysisMetadata): # Assuming AnalysisMetadata contains project_id or similar
    # Correct usage of SessionLocal for a specific operation (if not using Depends(get_db)):
    db = SessionLocal()
    try:
        # This part assumes 'AnalysisMetadata' has a 'project_id' attribute.
        # If 'AnalysisMetadata' IS the project data to be saved, the logic would be different.
        # For fetching by ID, we need an ID.
        project_id_to_fetch = data.project_id # This line relies on AnalysisMetadata having project_id
        
        meta = db.query(Project).filter(Project.id == project_id_to_fetch).first()
        if not meta:
            raise HTTPException(status_code=404, detail=f"Project not found with ID: {project_id_to_fetch}")
        logger.info(f"Metadata retrieved for project ID: {project_id_to_fetch}")
        return ProjectInDB.from_orm(meta) # Ensure ProjectInDB has `from_orm` or `model_validate` for Pydantic v2
    except HTTPException as http_exc:
        logger.error(f"HTTP Exception during metadata retrieval: {http_exc.detail}")
        raise http_exc
    except AttributeError: # If data.project_id does not exist
        logger.error(f"AttributeError: 'project_id' not found in request data for metadata retrieval. Data: {data}")
        raise HTTPException(status_code=400, detail="Invalid request data: 'project_id' missing.")
    except Exception as e:
        logger.error(f"Metadata retrieval failed for project data {data}: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="Metadata retrieval failed")
    finally:
        db.close()


# --- Image Captioning Endpoint ---
@app.post("/caption-images/", response_model=CaptionSummaryResponse)
async def create_captions_for_images_in_folder_endpoint(request: ImageCaptionRequest):
    """
    FastAPI endpoint to process images in a given folder (relative to static root) and generate captions.
    """
    logger.info(f"Received request to caption images in folder: {request.folder_location}")
    # The folder_location is expected to be relative to the 'static_dir'
    # e.g., if static_dir is '/app/static' and request.folder_location is 'project_images/run1',
    # then the service will look in '/app/static/project_images/run1'.
    try:
        response = await captioning_service.generate_captions_for_images_in_folder(
            folder_path_relative=request.folder_location,
            base_static_path_abs=str(static_dir.resolve()) # Pass absolute path of static_dir
        )
        return response
    except HTTPException as http_exc: # Re-raise HTTPExceptions from the service
        raise http_exc
    except Exception as e: # Catch any other unexpected errors
        logger.error(f"Unexpected error in /caption-images/ endpoint for folder '{request.folder_location}': {e}", exc_info=True)
        raise HTTPException(status_code=500, detail="An internal server error occurred during captioning.")
