from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from ..models.base import ExportJob
from ..services.store import store

router = APIRouter(prefix="/api", tags=["exports"])


@router.post("/projects/{project_id}/export", response_model=ExportJob, status_code=status.HTTP_202_ACCEPTED)
def create_export(project_id: UUID, payload: ExportJob) -> ExportJob:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    export = ExportJob(project_id=project_id, format=payload.format)
    export.status = "processing"
    export.download_url = f"https://example.com/exports/{export.id}.zip"
    store.create_export(export)
    return export


@router.get("/exports/{export_id}/status", response_model=ExportJob)
def export_status(export_id: UUID) -> ExportJob:
    if export_id not in store.exports:
        raise HTTPException(status_code=404, detail="Export not found")
    export = store.get_export(export_id)
    export.status = "complete"
    return export
