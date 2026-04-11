from __future__ import annotations

from src.core.llm_client import LLMClient
from src.core.types import Brief, Insight


async def run(brief: Brief, llm: LLMClient) -> Insight:
    await llm.chat_json("strategy", brief.model_dump_json())
    return Insight(
        strategic_tension=f"{brief.brand} wants growth without losing authenticity",
        human_truth=f"{brief.audience} tune out generic brand promises",
        brand_opportunity=f"Make {brief.brand} the practical choice with emotional payoff",
        positioning=f"{brief.brand} helps people feel smart and seen in everyday moments",
    )
