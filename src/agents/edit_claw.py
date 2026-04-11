from __future__ import annotations

from src.core.llm_client import LLMClient
from src.core.types import EditDecisionList, ShotPlan


async def run(shot_plan: ShotPlan, assets: dict[int, dict], llm: LLMClient) -> EditDecisionList:
    await llm.chat_json("edit", f"shots={len(shot_plan.shots)} assets={len(assets)}")
    transitions = [f"Shot {i} -> Shot {i+1}: 8-frame match cut" for i in range(1, len(shot_plan.shots))]
    return EditDecisionList(sequencing_notes="Keep energy ramping into final product reveal.", transitions=transitions)
