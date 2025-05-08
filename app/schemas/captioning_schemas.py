# app/schemas/captioning_schemas.py
from pydantic import BaseModel
from typing import List

class ImageCaptionRequest(BaseModel):
    folder_location: str

class ImageCaptionResponseItem(BaseModel):
    image_path: str
    description: str

class CaptionSummaryResponse(BaseModel):
    total_images_found: int
    successfully_captioned: int
    results: List[ImageCaptionResponseItem]
    message: str
    errors: List[str] = []
