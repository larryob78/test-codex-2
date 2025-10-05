from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AI Copy Service")


class CopyRequest(BaseModel):
    product_name: str
    tone: str = "neutral"


@app.post("/generate-copy")
async def generate_copy(payload: CopyRequest):
    copy = f"{payload.product_name} delivers value with a {payload.tone} tone."
    return {"copy": copy, "provider": "mock"}


@app.get("/healthz")
async def health() -> dict[str, str]:
    return {"status": "ok"}
