from __future__ import annotations

from src.core.llm_client import LLMClient
from src.core.types import Concept, Insight


async def run(insight: Insight, refs: list[str], llm: LLMClient, feedback: str | None = None, attempt: int = 1) -> list[Concept]:
    prompt = {
        "insight": insight.model_dump(),
        "refs": refs,
        "feedback": feedback,
        "attempt": attempt,
    }
    await llm.chat_json("idea", str(prompt))

    base = "Iterated" if feedback else "Core"
    return [
        Concept(
            route="safe",
            concept_name=f"{base} Everyday Proof",
            tagline="Small wins, every day.",
            visual_world="Warm documentary realism with grounded product moments.",
            key_scenes=["Morning rush", "In-store choice", "Evening payoff"],
            tone="warm",
            why_it_works="Fits broad audience expectations while staying credible.",
        ),
        Concept(
            route="bold",
            concept_name=f"{base} Rules Rewritten",
            tagline="Don’t follow the category.",
            visual_world="Stylized transitions blend product utility with cinematic stunts.",
            key_scenes=["Rule break", "Crowd reaction", "Triumphant reveal"],
            tone="confident",
            why_it_works="Creates talkability while preserving strategic fit.",
        ),
        Concept(
            route="unexpected",
            concept_name=f"{base} Future Memory",
            tagline="Remember tomorrow now.",
            visual_world="Surreal dream-logic where memories appear before events happen.",
            key_scenes=["Flash-forward", "Emotional choice", "Memory locks in"],
            tone="surprising",
            why_it_works="Distinctive mental structure boosts memorability.",
        ),
    ]
