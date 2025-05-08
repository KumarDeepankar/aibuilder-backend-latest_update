from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

def get_project_by_name(db: Session, name: str):
    return db.query(Project).filter(Project.project_name == name).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100, active_only: bool = True):
    query = db.query(Project)
    if active_only:
        query = query.filter(Project.is_active == True)
    return query.offset(skip).limit(limit).all()

def create_project(db: Session, project: ProjectCreate):
    db_project = Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: int, project: ProjectUpdate):
    db_project = get_project(db, project_id)
    if not db_project:
        return None
    update_data = project.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_project, field, value)
    db.commit()
    db.refresh(db_project)
    return db_project