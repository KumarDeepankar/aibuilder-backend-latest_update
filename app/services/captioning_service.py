# app/services/captioning_service.py
import os
import logging
from typing import List, Dict, Any, Optional

from PIL import Image as PILImage # Alias to avoid conflict if Image model is imported
from fastapi import HTTPException
from transformers import pipeline

from app.schemas.captioning_schemas import ImageCaptionResponseItem, CaptionSummaryResponse # Import from new location

# --- Configuration ---
CAPTIONING_MODEL_NAME = "Salesforce/blip-image-captioning-large"
CAPTIONING_SUPPORTED_EXTENSIONS = ('.png', '.jpg', '.jpeg', '.bmp', '.gif', '.webp')
CAPTIONING_GENERATION_ARGS = {
    "max_length": 150,
    "num_beams": 5,
    "early_stopping": True,
    "repetition_penalty": 1.2,
}

logger = logging.getLogger(__name__)

# --- Module-level Variable for the Hugging Face Model ---
_captioner: Optional[Any] = None

async def init_captioning_model():
    """
    Initializes the Hugging Face image captioning model.
    This should be called once at application startup.
    """
    global _captioner
    if _captioner is not None:
        logger.info("Captioning model already initialized.")
        return

    logger.info(f"Attempting to initialize Hugging Face pipeline with model: {CAPTIONING_MODEL_NAME}...")
    logger.info("This might take some time, especially for larger models on the first run...")
    try:
        _captioner = pipeline("image-to-text", model=CAPTIONING_MODEL_NAME)
        logger.info(f"Captioning pipeline initialized successfully with model: {CAPTIONING_MODEL_NAME}.")
        logger.info(f"Captioning pipeline device: {_captioner.device}")
    except Exception as e:
        logger.error(f"CRITICAL: Failed to initialize Hugging Face captioning pipeline: {e}")
        logger.error(
            "The captioning API endpoint might not function correctly. "
            "Ensure model availability and resources (internet, disk space, memory)."
        )
        _captioner = None # Ensure captioner is None if initialization fails

def get_captioner():
    """
    Returns the initialized captioner pipeline.
    Raises an HTTPException if the model is not loaded.
    """
    if _captioner is None:
        logger.error("Captioning model is not available. Initialization might have failed.")
        raise HTTPException(status_code=503, detail="Captioning service is unavailable. Model not loaded.")
    return _captioner

async def generate_captions_for_images_in_folder(
    folder_path_relative: str,
    base_static_path_abs: str
) -> CaptionSummaryResponse:
    """
    Processes images in a given folder and generates captions using the initialized model.

    Args:
        folder_path_relative (str): The relative path to the folder containing images (e.g., "images/project_x").
                                   This path is relative to `base_static_path_abs`.
        base_static_path_abs (str): The absolute path to the base static directory (e.g., "/app/static").

    Returns:
        CaptionSummaryResponse: A summary of the captioning process.
    """
    captioning_pipeline = get_captioner() # Ensures model is loaded or raises 503

    # Construct absolute path and perform security check
    # The folder_path_relative is expected to be a sub-directory of base_static_path_abs
    requested_folder_abs = os.path.abspath(os.path.join(base_static_path_abs, folder_path_relative))

    if not requested_folder_abs.startswith(base_static_path_abs):
         logger.error(f"Security Alert: Attempted access outside of allowed static sub-directory: {folder_path_relative}")
         raise HTTPException(status_code=400, detail="Access denied: Invalid folder location.")

    if not os.path.isdir(requested_folder_abs):
        logger.error(f"Invalid folder path provided: '{requested_folder_abs}' does not exist or is not a directory.")
        raise HTTPException(status_code=400, detail=f"The folder '{folder_path_relative}' does not exist or is not a directory.")

    results: List[ImageCaptionResponseItem] = []
    errors: List[str] = []

    try:
        all_files_in_dir = os.listdir(requested_folder_abs)
    except OSError as e:
        logger.error(f"Error listing directory {requested_folder_abs}: {e}")
        raise HTTPException(status_code=500, detail=f"Could not read directory contents: {folder_path_relative}")

    image_filenames = [f for f in all_files_in_dir if f.lower().endswith(CAPTIONING_SUPPORTED_EXTENSIONS)]
    total_images_found = len(image_filenames)

    if total_images_found == 0:
        message = f"No images with supported extensions {CAPTIONING_SUPPORTED_EXTENSIONS} found in folder: {folder_path_relative}"
        logger.info(message)
        return CaptionSummaryResponse(
            total_images_found=0, successfully_captioned=0, results=[], message=message, errors=[]
        )

    logger.info(f"Found {total_images_found} image(s) to process in folder: {requested_folder_abs}")
    logger.info(f"Using generation parameters for captions: {CAPTIONING_GENERATION_ARGS}")

    for filename in image_filenames:
        current_image_path_full_abs = os.path.join(requested_folder_abs, filename)
        logger.info(f"\n--- Processing image: {filename} ---")

        img: Optional[PILImage.Image] = None
        try:
            logger.info(f"Attempting to load image: {current_image_path_full_abs}...")
            img = PILImage.open(current_image_path_full_abs).convert("RGB")
            logger.info(f"Image '{filename}' loaded. Mode: {img.mode}, Size: {img.size}")
        except FileNotFoundError:
            msg = f"Image file not found at '{current_image_path_full_abs}'. Skipping."
            logger.error(msg)
            errors.append(f"{filename}: {msg}")
            continue
        except Exception as e:
            msg = f"Unexpected error loading image '{filename}': {e}. Skipping."
            logger.error(msg)
            errors.append(f"{filename}: {msg}")
            continue

        if img is None:
            msg = f"Image object is None for '{filename}'. Skipping." # Should be caught above
            logger.error(msg)
            errors.append(f"{filename}: {msg}")
            continue

        logger.info(f"Generating caption for '{filename}'...")
        try:
            captions_output = captioning_pipeline(img, generate_kwargs=CAPTIONING_GENERATION_ARGS)
            if captions_output and isinstance(captions_output, list) and len(captions_output) > 0:
                first_result = captions_output[0]
                if isinstance(first_result, dict) and 'generated_text' in first_result:
                    generated_text = first_result['generated_text'].strip()
                    logger.info(f"Generated Caption for '{filename}':\n{generated_text}\n")
                    # Return the relative path from the base_static_path_abs for client use
                    # This should correctly be folder_path_relative + filename
                    client_accessible_image_path = os.path.join(folder_path_relative, filename).replace("\\", "/") # Ensure POSIX paths
                    results.append(
                        ImageCaptionResponseItem(image_path=client_accessible_image_path, description=generated_text)
                    )
                else:
                    msg = f"Caption output format unexpected for '{filename}'. First: {first_result}. Skipping."
                    logger.warning(msg)
                    errors.append(f"{filename}: {msg}")
            else:
                msg = f"Captioner returned empty/None output for '{filename}'. Skipping."
                logger.warning(msg)
                errors.append(f"{filename}: {msg}")
        except Exception as e:
            msg = f"Error during caption generation for '{filename}': {e}."
            logger.error(msg, exc_info=True)
            errors.append(f"{filename}: {msg}")
            continue

    successfully_captioned_count = len(results)
    if successfully_captioned_count == total_images_found and total_images_found > 0:
        message = f"Successfully generated captions for all {total_images_found} found image(s) in '{folder_path_relative}'."
    elif successfully_captioned_count > 0:
        message = f"Generated captions for {successfully_captioned_count}/{total_images_found} image(s) in '{folder_path_relative}'. See errors."
    elif total_images_found > 0:
        message = f"Attempted {total_images_found} image(s) in '{folder_path_relative}', no captions generated. See errors."
    else: # Handled earlier
        message = f"No images found to process in '{folder_path_relative}'."

    logger.info(f"Captioning for folder '{folder_path_relative}' finished. Result: {message}")
    return CaptionSummaryResponse(
        total_images_found=total_images_found,
        successfully_captioned=successfully_captioned_count,
        results=results,
        message=message,
        errors=errors
    )
