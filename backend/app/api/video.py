from __future__ import annotations

from typing import Dict, List
from uuid import UUID

from fastapi import APIRouter, HTTPException, status

from ..models.base import VideoGenerationJob, VideoGenerationRequest, VideoProvider
from ..services.store import store

router = APIRouter(prefix="/api", tags=["video"])


VIDEO_PROVIDERS: Dict[str, VideoProvider] = {
    "openai-sora": VideoProvider(
        id="openai-sora",
        name="OpenAI Sora",
        description="Text-to-video synthesis tuned for cinematic storytelling.",
        supported_capabilities=["text-to-video", "storyboard-alignment", "camera-controls"],
        max_duration_seconds=60,
    ),
    "google-veo3": VideoProvider(
        id="google-veo3",
        name="Google Veo 3",
        description="High fidelity generative video with detailed environmental control.",
        supported_capabilities=["text-to-video", "style-transfer", "motion-brush"],
        max_duration_seconds=90,
    ),
    "kling-2-5": VideoProvider(
        id="kling-2-5",
        name="Kling 2.5",
        description="Fast iteration model ideal for previz and rapid look development.",
        supported_capabilities=["text-to-video", "image-to-video", "quick-iter"],
        max_duration_seconds=45,
    ),
}


@router.get("/ai/video/providers", response_model=List[VideoProvider])
def list_video_providers() -> List[VideoProvider]:
    return list(VIDEO_PROVIDERS.values())


@router.post(
    "/projects/{project_id}/video/generations",
    response_model=VideoGenerationJob,
    status_code=status.HTTP_202_ACCEPTED,
)
def create_video_generation(project_id: UUID, payload: VideoGenerationRequest) -> VideoGenerationJob:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    if payload.provider_id not in VIDEO_PROVIDERS:
        raise HTTPException(status_code=400, detail="Unknown provider requested")

    provider = VIDEO_PROVIDERS[payload.provider_id]
    job = VideoGenerationJob(
        project_id=project_id,
        provider_id=provider.id,
        prompt=payload.prompt,
        aspect_ratio=payload.aspect_ratio,
    )
    job.status = "rendering"
    store.create_video_job(job)
    return job


@router.get("/video/generations/{job_id}", response_model=VideoGenerationJob)
def get_video_generation(job_id: UUID) -> VideoGenerationJob:
    try:
        job = store.get_video_job(job_id)
    except KeyError as exc:
        raise HTTPException(status_code=404, detail="Video generation not found") from exc

    if job.status != "complete":
        job.status = "complete"
        job.preview_url = f"https://example.com/video-previews/{job.id}.mp4"
        store.video_jobs[job_id] = job
    return job


@router.get("/projects/{project_id}/video/generations", response_model=List[VideoGenerationJob])
def list_project_video_generations(project_id: UUID) -> List[VideoGenerationJob]:
    if project_id not in store.projects:
        raise HTTPException(status_code=404, detail="Project not found")
    return store.list_video_jobs(project_id)
