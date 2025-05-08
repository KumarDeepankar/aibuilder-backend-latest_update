from sqlalchemy.orm import Session
from app.models.aem_template import AEMTemplate
from app.schemas.aem_template import AEMTemplateCreate, AEMTemplateUpdate

def get_aem_template(db: Session, template_id: int):
    return db.query(AEMTemplate).filter(AEMTemplate.id == template_id).first()

def get_aem_template_by_name(db: Session, template_name: str):
    return db.query(AEMTemplate).filter(AEMTemplate.aem_template_name == template_name).first()

def get_active_aem_templates(db: Session, template_type: str = None):
    query = db.query(AEMTemplate).filter(AEMTemplate.active == True)
    if template_type:
        query = query.filter(AEMTemplate.aem_template_type == template_type)
    return query.all()

def create_aem_template(db: Session, template: AEMTemplateCreate):
    db_template = AEMTemplate(**template.dict())
    db.add(db_template)
    db.commit()
    db.refresh(db_template)
    return db_template

def update_aem_template(db: Session, template_id: int, template: AEMTemplateUpdate):
    db_template = get_aem_template(db, template_id)
    if not db_template:
        return None
    update_data = template.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_template, field, value)
    db.commit()
    db.refresh(db_template)
    return db_template

def delete_aem_template(db: Session, template_id: int):
    db_template = get_aem_template(db, template_id)
    if not db_template:
        return False
    db.delete(db_template)
    db.commit()
    return True