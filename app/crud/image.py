from sqlalchemy.orm import Session
from app.models.image import Image
from app.schemas.image import ImageCreate, ImageUpdate

def get_image(db: Session, image_id: int):
    return db.query(Image).filter(Image.id == image_id).first()

def get_images_by_project(db: Session, project_id: int, skip: int = 0, limit: int = 100):
    return db.query(Image).filter(Image.project_id == project_id).offset(skip).limit(limit).all()

def create_image(db: Session, image: ImageCreate):
    db_image = Image(**image.dict())
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def update_image(db: Session, image_id: int, image: ImageUpdate):
    db_image = get_image(db, image_id)
    if not db_image:
        return None
    update_data = image.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_image, field, value)
    db.commit()
    db.refresh(db_image)
    return db_image

def delete_image(db: Session, image_id: int):
    db_image = get_image(db, image_id)
    if not db_image:
        return False
    db.delete(db_image)
    db.commit()
    return True