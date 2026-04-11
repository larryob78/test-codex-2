from __future__ import annotations

from fastapi import FastAPI

from src.config import load_config
from src.core.orchestrator import run_campaign
from src.core.types import Brief

app = FastAPI(title="NemoClaw API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/campaign")
async def campaign(brief: Brief):
    config = load_config()
    return (await run_campaign(brief, config)).model_dump()
