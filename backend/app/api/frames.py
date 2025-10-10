from __future__ import annotations

from typing import List
from uuid import UUID

from fastapi import APIRouter, HTTPException, Response, UploadFile, status

from ..models.base import Frame, Generation, GenerationSettings, Sketch
from ..services import storage
from ..services.store import store

router = APIRouter(prefix="/api", tags=["frames"])


@router.post("/projects/{project_id}/frames", response_model=Frame, status_code=status.HTTP_201_CREATED)
def create_frame(project_id: UUID, payload: Frame) -> Frame:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    if payload.project_id != project_id:
        raise HTTPException(status_code=400, detail="Project mismatch")
    store.create_frame(payload)
    return payload


@router.get("/projects/{project_id}/frames", response_model=List[Frame])
def list_frames(project_id: UUID) -> List[Frame]:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return store.list_frames(project_id)


@router.get("/frames/{frame_id}", response_model=Frame)
def get_frame(frame_id: UUID) -> Frame:
    try:
        return store.get_frame(frame_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Frame not found") from exc


@router.put("/frames/{frame_id}", response_model=Frame)
def update_frame(frame_id: UUID, payload: Frame) -> Frame:
    if frame_id not in store.frames:
        raise HTTPException(status_code=404, detail="Frame not found")
    store.update_frame(frame_id, payload)
    return payload


@router.delete("/frames/{frame_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_frame(frame_id: UUID) -> Response:
    if frame_id not in store.frames:
        raise HTTPException(status_code=404, detail="Frame not found")
    store.delete_frame(frame_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/frames/{frame_id}/generate", response_model=List[Generation])
def generate_images(frame_id: UUID, settings: GenerationSettings) -> List[Generation]:
    if frame_id not in store.frames:
        raise HTTPException(status_code=404, detail="Frame not found")
    frame = store.frames[frame_id]
    generations: List[Generation] = []
    for iteration in range(settings.iterations):
        generation = Generation(
            frame_id=frame_id,
            image_url=f"https://placehold.co/600x400?text=Frame+{frame.frame_number}+Var+{iteration+1}",
            type="color" if settings.mode != "turbo" else "blackAndWhite",
            prompt=frame.prompt or "",
            settings=settings,
        )
        generations.append(generation)
        store.create_generation(generation)
    return generations


@router.get("/frames/{frame_id}/generations", response_model=List[Generation])
def list_generations(frame_id: UUID) -> List[Generation]:
    if frame_id not in store.frames:
        raise HTTPException(status_code=404, detail="Frame not found")
    return store.list_generations_for_frame(frame_id)


@router.post("/generations/{generation_id}/confirm", response_model=Generation)
def confirm_generation(generation_id: UUID) -> Generation:
    if generation_id not in store.generations:
        raise HTTPException(status_code=404, detail="Generation not found")
    generation = store.confirm_generation(generation_id)
    return generation


@router.post("/frames/{frame_id}/sketch", response_model=Frame)
async def upload_sketch(frame_id: UUID, file: UploadFile) -> Frame:
    if frame_id not in store.frames:
        raise HTTPException(status_code=404, detail="Frame not found")
    frame = store.frames[frame_id]
    sketch = await storage.save_frame_sketch(str(frame.project_id), str(frame.id), file)
    updated_frame = frame.copy(update={"sketch": sketch})
    store.update_frame(frame_id, updated_frame)
    return updated_frame


@router.delete("/frames/{frame_id}/sketch", response_model=Frame)
def delete_sketch(frame_id: UUID) -> Frame:
    if frame_id not in store.frames:
        raise HTTPException(status_code=404, detail="Frame not found")
    frame = store.frames[frame_id]
    storage.remove_frame_sketch(str(frame.project_id), str(frame.id))
    updated_frame = frame.copy(update={"sketch": Sketch()})
    store.update_frame(frame_id, updated_frame)
    return updated_frame
