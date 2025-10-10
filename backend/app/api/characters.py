from __future__ import annotations

from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Response, status

from ..models.base import Character
from ..services.store import store

router = APIRouter(prefix="/api", tags=["characters"])


@router.post("/projects/{project_id}/characters", response_model=Character, status_code=status.HTTP_201_CREATED)
def create_character(project_id: UUID, payload: Character) -> Character:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    if payload.project_id != project_id:
        raise HTTPException(status_code=400, detail="Project mismatch")
    store.create_character(payload)
    return payload


@router.get("/projects/{project_id}/characters", response_model=List[Character])
def list_characters(project_id: UUID) -> List[Character]:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return store.list_characters(project_id)


@router.get("/characters/{character_id}", response_model=Character)
def get_character(character_id: UUID) -> Character:
    try:
        return store.get_character(character_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Character not found") from exc


@router.put("/characters/{character_id}", response_model=Character)
def update_character(character_id: UUID, payload: Character) -> Character:
    if character_id not in store.characters:
        raise HTTPException(status_code=404, detail="Character not found")
    store.update_character(character_id, payload)
    return payload


@router.delete("/characters/{character_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_character(character_id: UUID) -> Response:
    if character_id not in store.characters:
        raise HTTPException(status_code=404, detail="Character not found")
    store.delete_character(character_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
