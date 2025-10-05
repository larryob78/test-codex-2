from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AI Image Service")


class ImageRequest(BaseModel):
    prompt: str
    width: int = 1200
    height: int = 628


@app.post("/generate-image")
async def generate_image(payload: ImageRequest):
    return {
        "url": f"https://placehold.co/{payload.width}x{payload.height}?text={payload.prompt}",
        "provider": "sdxl-mock",
    }


@app.get("/healthz")
async def health() -> dict[str, str]:
    return {"status": "ok"}
