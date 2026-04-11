from __future__ import annotations

from src.core.llm_client import LLMClient
from src.core.types import Concept, Shot, ShotPlan


async def run(concept: Concept, llm: LLMClient, duration_seconds: int = 30) -> ShotPlan:
    await llm.chat_json("director", concept.model_dump_json())
    shot_count = 8
    per_shot = round(duration_seconds / shot_count, 2)
    shots = [
        Shot(
            shot_number=i + 1,
            duration_seconds=per_shot,
            camera="Low angle, slow dolly in, 35mm",
            scene_description=f"{concept.visual_world} — beat {i + 1}",
            characters=["Hero character", "Product hero pack"],
            environment="Urban golden-hour street with subtle brand accents",
            animation_prompt="Cinematic camera drift with practical motion",
            audio="VO: The brand that shows up when it matters.",
            emotion="confidence",
        )
        for i in range(shot_count)
    ]
    return ShotPlan(
        concept_name=concept.concept_name,
        total_duration_seconds=duration_seconds,
        overall_pacing="medium",
        music_direction="Modern cinematic pop, 110 BPM, uplifting",
        shots=shots,
    )
