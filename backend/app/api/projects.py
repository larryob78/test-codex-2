from __future__ import annotations

from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Response, status

from ..models.base import Project, ProjectDetail
from ..services.store import store

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.post("", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(project: Project) -> Project:
    store.create_project(project)
    return project


@router.get("", response_model=List[Project])
def list_projects() -> List[Project]:
    return store.list_projects()


@router.get("/{project_id}", response_model=ProjectDetail)
def get_project(project_id: UUID) -> ProjectDetail:
    try:
        project = store.get_project(project_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Project not found") from exc
    frames = store.list_frames(project_id)
    characters = store.list_characters(project_id)
    locations = store.list_locations(project_id)
    props = store.list_props(project_id)
    payload = project.dict()
    payload['frames'] = frames
    payload['characters'] = characters
    payload['locations'] = locations
    payload['props'] = props
    return ProjectDetail(**payload)


@router.put("/{project_id}", response_model=Project)
def update_project(project_id: UUID, payload: Project) -> Project:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    store.update_project(project_id, payload)
    return payload


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: UUID) -> Response:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    store.delete_project(project_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
