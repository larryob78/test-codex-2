from __future__ import annotations

from src.core.llm_client import LLMClient
from src.core.types import Concept, ConceptScore, DimensionScore, ScoredConcepts

DIMENSIONS = ["Originality", "Strategic Fit", "Emotional Impact", "Craft Potential", "Memorability"]


async def run(concepts: list[Concept], llm: LLMClient) -> ScoredConcepts:
    await llm.chat_json("taste", "score concepts")

    scored: list[ConceptScore] = []
    for idx, concept in enumerate(concepts):
        base = 4 if concept.route == "safe" else 5
        dims = [
            DimensionScore(dimension=d, score=max(2, min(6, base + (1 if i == idx % 5 else 0))), rationale=f"{d} rationale")
            for i, d in enumerate(DIMENSIONS)
        ]
        total = sum(d.score for d in dims)
        scored.append(
            ConceptScore(
                concept=concept,
                dimensions=dims,
                total_score=total,
                what_elevates="Clear emotional and strategic clarity",
                what_holds_back="Could push distinctiveness further",
            )
        )

    winner = max(scored, key=lambda s: s.total_score)
    verdict = "ship" if winner.total_score >= 24 else "review" if winner.total_score >= 18 else "kill"
    return ScoredConcepts(scores=scored, winner=winner, verdict=verdict, feedback="Increase originality cues")
