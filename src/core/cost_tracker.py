from __future__ import annotations

from datetime import datetime, timezone

from .types import CostEntry


class CostTracker:
    def __init__(self) -> None:
        self._entries: list[CostEntry] = []

    def record(self, agent: str, model: str, tokens_or_credits: int, cost_usd: float) -> None:
        self._entries.append(
            CostEntry(
                agent=agent,
                model=model,
                tokens_or_credits=tokens_or_credits,
                cost_usd=cost_usd,
                timestamp=datetime.now(timezone.utc).isoformat(),
            )
        )

    def report(self) -> list[CostEntry]:
        return self._entries.copy()
