from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AI Video Service")


class VideoRequest(BaseModel):
    concept: str
    duration_seconds: int = 6


@app.post("/generate-video")
async def generate_video(payload: VideoRequest):
    return {
        "url": "https://example.com/mock-video.mp4",
        "concept": payload.concept,
        "duration": payload.duration_seconds,
    }


@app.get("/healthz")
async def health() -> dict[str, str]:
    return {"status": "ok"}
