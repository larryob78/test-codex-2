from __future__ import annotations

from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Response, status

from ..models.base import Prop
from ..services.store import store

router = APIRouter(prefix="/api", tags=["props"])


@router.post("/projects/{project_id}/props", response_model=Prop, status_code=status.HTTP_201_CREATED)
def create_prop(project_id: UUID, payload: Prop) -> Prop:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    if payload.project_id != project_id:
        raise HTTPException(status_code=400, detail="Project mismatch")
    store.create_prop(payload)
    return payload


@router.get("/projects/{project_id}/props", response_model=List[Prop])
def list_props(project_id: UUID) -> List[Prop]:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return store.list_props(project_id)


@router.get("/props/{prop_id}", response_model=Prop)
def get_prop(prop_id: UUID) -> Prop:
    try:
        return store.get_prop(prop_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Prop not found") from exc


@router.put("/props/{prop_id}", response_model=Prop)
def update_prop(prop_id: UUID, payload: Prop) -> Prop:
    if prop_id not in store.props:
        raise HTTPException(status_code=404, detail="Prop not found")
    store.update_prop(prop_id, payload)
    return payload


@router.delete("/props/{prop_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_prop(prop_id: UUID) -> Response:
    if prop_id not in store.props:
        raise HTTPException(status_code=404, detail="Prop not found")
    store.delete_prop(prop_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
