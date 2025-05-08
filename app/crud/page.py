from sqlalchemy.orm import Session
from app.models.page import Page
from app.schemas.page import PageCreate, PageUpdate

def get_page(db: Session, page_id: int):
    return db.query(Page).filter(Page.id == page_id).first()

def get_page_by_url(db: Session, page_url: str):
    return db.query(Page).filter(Page.page_url == page_url).first()

def get_pages_by_project(db: Session, project_id: int, skip: int = 0, limit: int = 100):
    return (
        db.query(Page)
        .filter(Page.project_id == project_id)
        .order_by(Page.sort_order)
        .offset(skip)
        .limit(limit)
        .all()
    )

def create_page(db: Session, page: PageCreate):
    db_page = Page(**page.dict())
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

def update_page(db: Session, page_id: int, page: PageUpdate):
    db_page = get_page(db, page_id)
    if not db_page:
        return None
    
    update_data = page.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_page, field, value)
    
    db.commit()
    db.refresh(db_page)
    return db_page

def delete_page(db: Session, page_id: int):
    db_page = get_page(db, page_id)
    if not db_page:
        return False
    
    db.delete(db_page)
    db.commit()
    return True