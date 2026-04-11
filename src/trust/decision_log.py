from __future__ import annotations

from datetime import datetime, timezone


class DecisionLog:
    def __init__(self) -> None:
        self._records: list[dict] = []

    def record(self, stage: str, payload: object) -> None:
        self._records.append(
            {
                "stage": stage,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "payload": payload if isinstance(payload, (dict, list, str, int, float, bool, type(None))) else str(payload),
            }
        )

    def export(self) -> list[dict]:
        return self._records.copy()
