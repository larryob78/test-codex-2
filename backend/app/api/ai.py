from __future__ import annotations

from fastapi import APIRouter

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/enhance-prompt")
def enhance_prompt(payload: dict) -> dict:
    prompt = payload.get("prompt", "")
    if not prompt:
        return {"enhanced": "Cinematic storyboard illustration"}
    enhanced = f"{prompt} -- enhanced with cinematic lighting and dynamic composition"
    return {"enhanced": enhanced}


@router.post("/analyze-sketch")
def analyze_sketch(payload: dict) -> dict:
    sketch_name = payload.get("fileName", "sketch.png")
    return {
        "prompt": f"Storyboard frame based on {sketch_name}, dynamic perspective, character-focused"
    }


@router.post("/check-consistency")
def check_consistency(payload: dict) -> dict:
    return {
        "status": "ok",
        "issues": [],
        "summary": "No continuity issues detected in mock analysis",
    }
