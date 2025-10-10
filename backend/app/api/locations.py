from __future__ import annotations

from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Response, status

from ..models.base import Location
from ..services.store import store

router = APIRouter(prefix="/api", tags=["locations"])


@router.post("/projects/{project_id}/locations", response_model=Location, status_code=status.HTTP_201_CREATED)
def create_location(project_id: UUID, payload: Location) -> Location:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    if payload.project_id != project_id:
        raise HTTPException(status_code=400, detail="Project mismatch")
    store.create_location(payload)
    return payload


@router.get("/projects/{project_id}/locations", response_model=List[Location])
def list_locations(project_id: UUID) -> List[Location]:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return store.list_locations(project_id)


@router.get("/locations/{location_id}", response_model=Location)
def get_location(location_id: UUID) -> Location:
    try:
        return store.get_location(location_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Location not found") from exc


@router.put("/locations/{location_id}", response_model=Location)
def update_location(location_id: UUID, payload: Location) -> Location:
    if location_id not in store.locations:
        raise HTTPException(status_code=404, detail="Location not found")
    store.update_location(location_id, payload)
    return payload


@router.delete("/locations/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_location(location_id: UUID) -> Response:
    if location_id not in store.locations:
        raise HTTPException(status_code=404, detail="Location not found")
    store.delete_location(location_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
