from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List

app = FastAPI()

# In-memory storage for projects
projects = []

class Project(BaseModel):
    id: int
    name: str
    description: str

@app.get("/")
def read_root():
    return {"message": "Welcome to the Ai builder API"}

@app.get("/projects", response_model=List[Project])
def get_projects():
    return projects

@app.post("/projects", response_model=Project)
def create_project(project: Project):
    if any(p.id == project.id for p in projects):
        raise HTTPException(status_code=400, detail="Project with this ID already exists.")
    projects.append(project)
    return project

