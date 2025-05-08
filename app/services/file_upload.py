import os
import uuid
from pathlib import Path
from typing import Dict
from fastapi import UploadFile, HTTPException
from PIL import Image
from app.core.config import settings

class FileUploadService:
    def __init__(self):
        self.allowed_content_types = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
        ]
        self.max_file_size = 10 * 1024 * 1024  # 10MB

    async def validate_file(self, file: UploadFile) -> None:
        """Validate the file before processing"""
        if file.content_type not in self.allowed_content_types:
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Allowed types: {', '.join(self.allowed_content_types)}"
            )
        
        # Check file size
        file.file.seek(0, 2)  # Seek to end
        file_size = file.file.tell()
        file.file.seek(0)  # Reset cursor position
        
        if file_size > self.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {self.max_file_size // (1024 * 1024)}MB"
            )

    async def save_uploaded_file(self, file: UploadFile, project_id: int) -> Dict:
        """Process and save an uploaded file, returning metadata for database storage"""
        try:
            await self.validate_file(file)
            
            # Generate unique filename
            file_ext = os.path.splitext(file.filename)[1].lower()
            filename = f"{uuid.uuid4().hex}{file_ext}"
            
            # Create project directory if it doesn't exist
            upload_dir = Path(settings.UPLOAD_DIR) / f"project_{project_id}"
            upload_dir.mkdir(parents=True, exist_ok=True)
            filepath = upload_dir / filename
            
            # Save file
            with open(filepath, "wb") as buffer:
                content = await file.read()
                buffer.write(content)
            
            # Get image dimensions only if it's an image type
            width, height = None, None
            if file.content_type.startswith('image/'):
                try:
                    with Image.open(filepath) as img:
                        width, height = img.size
                except Exception as img_error:
                    # Only raise an error if it's supposed to be an image but can't be processed
                    # Remove the file if we can't process it
                    if filepath.exists():
                        filepath.unlink()
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid image file: {str(img_error)}"
                    )
            
            return {
                "filename": filename,
                "original_filename": file.filename,
                "filepath": str(filepath),
                "url": f"/static/images/project_{project_id}/{filename}",
                "content_type": file.content_type,
                "file_size": os.path.getsize(filepath),
                "width": width,
                "height": height
            }
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error processing file: {str(e)}"
            )

    async def delete_file(self, filepath: str) -> bool:
        """Delete a file from the filesystem"""
        try:
            path = Path(filepath)
            if path.exists():
                path.unlink()
            return True
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error deleting file: {str(e)}"
            )

# Singleton instance to be imported
file_upload_service = FileUploadService()