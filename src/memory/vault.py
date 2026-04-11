from __future__ import annotations


class VaultClient:
    def available(self) -> bool:
        return False

    async def search(self, query: str, top_k: int = 5) -> list[str]:
        return [f"Reference for {query} #{i}" for i in range(1, top_k + 1)]
