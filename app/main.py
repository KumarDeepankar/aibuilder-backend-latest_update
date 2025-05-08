import logging
from fastapi import FastAPI, Depends, File, UploadFile, HTTPException
from typing import List
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.schemas.chat_schemas import AnalyzeImage,MappingData,GenerateDocs
from app.services.chat_service import analyze_image,load_block_kb,map_ui_to_blocks, generate_docs
from app.schemas.analysis import AnalysisMetadata

from app.api.v1.routers import router
from app.core.config import settings
from app.core.logging import setup_logging
from app.db.session import SessionLocal
from app.db.init_db import init_db
# from app.models.user import User
from app.models.image import Image
from app.models.page import Page
from app.models.project import Project

from dotenv import load_dotenv
import os
# from sqlalchemy import insert, update, delete
from app.db.session import engine
from sqlalchemy.orm import sessionmaker

load_dotenv()
# Setup logging
setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise Project Management System API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)


# Set up CORS
if settings.CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include API routers
app.include_router(router, prefix=settings.API_V1_STR)

# Serve static files (uploaded images)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.on_event("startup")
def on_startup():
    """Initialize database and perform any startup tasks"""
    db = SessionLocal()
    init_db(db)
    db.close()

Session = sessionmaker(bind=engine)
session = Session()

image_dir = "images"
output_dir = "output"

@app.get("/")
async def root():
    return {
        "message": "Welcome to the  System API",
        "docs": "/docs",
        "redoc": "/redoc",
    }

@app.post("/upload-image")
async def upload_image(file:UploadFile = File(...)):
    try:
        img_content = await file.read()
        img_path = os.path.join('static','images',file.filename)
        with open(img_path,"wb") as f:
            while contents := await file.read(1024):
                f.write(contents)
    except Exception as e:
        raise e
    return {"filename":file.filename, "detail":"Image Uploaded"}

@app.post("/analyze")
async def analyze(data:AnalyzeImage):
    #save 
    #return List of dictionary
    try:
        img_path = os.path.join('static','images',data.img_name)
        image_data = analyze_image(image_path=img_path)
        return image_data
    except Exception as e:
        raise e

@app.post("/mapping")
async def mapping(data:MappingData):
    try:
        #return list of dict
        block_data = await map_ui_to_blocks(page_json=data.components_data, block_kb=load_block_kb())
        return block_data
    except Exception as e:
        raise e

@app.post("/generate-doc")
async def generate(data:GenerateDocs):
    #return google docs link
    try:
        img_path = os.path.join('static','images',data.img_name)
        google_docs_link = await generate_docs(ui_json=data.components_data, mapped=data.mapped_data, image_path=img_path)
        return google_docs_link
    except Exception as e:
        raise e

@app.post('/api/analysis-metadata')
async def create_metadata(data:AnalysisMetadata):
    # return data
    try:
        meta = session.query(Project).filter(Project.id == data).first()
        return meta
    except Exception as e:
        raise e