from __future__ import annotations

import asyncio

import httpx

from src.config import Config


class WorldLabsClient:
    def __init__(self, config: Config):
        self.config = config
        self.base_url = "https://api.worldlabs.ai/marble/v1"

    @property
    def _is_live(self) -> bool:
        return bool(self.config.worldlabs_api_key)

    async def generate_from_text(self, prompt: str, name: str) -> str:
        if not self._is_live:
            await asyncio.sleep(0)
            return f"world-{abs(hash((prompt, name))) % 10_000}"

        payload = {
            "display_name": name,
            "world_prompt": {"type": "text", "text_prompt": prompt},
        }
        data = await self._request("POST", f"{self.base_url}/worlds:generate", json=payload)
        operation_id = data.get("name") or data.get("id")
        if not operation_id:
            raise RuntimeError(f"World Labs response missing operation id: {data}")
        return str(operation_id)

    async def poll(self, operation_id: str) -> dict:
        if not self._is_live:
            await asyncio.sleep(0)
            return {
                "browser_url": f"https://assets.local/world/{operation_id}",
                "outputs": {"splat_100k": f"https://assets.local/world/{operation_id}.spz"},
            }

        wait_s = 5
        elapsed_s = 0
        timeout_s = 300
        while elapsed_s <= timeout_s:
            data = await self._request("GET", f"{self.base_url}/operations/{operation_id}")
            done = bool(data.get("done"))
            if done:
                if data.get("error"):
                    raise RuntimeError(f"World Labs operation failed: {data['error']}")
                response_payload = data.get("response", {})
                return {
                    "browser_url": response_payload.get("browser_url", ""),
                    "outputs": response_payload.get("outputs", {}),
                }
            await asyncio.sleep(wait_s)
            elapsed_s += wait_s
            wait_s = min(wait_s * 2, 30)
        raise TimeoutError(f"World Labs operation {operation_id} did not finish within {timeout_s}s")

    async def _request(self, method: str, url: str, *, json: dict | None = None) -> dict:
        headers = {"WLT-Api-Key": self.config.worldlabs_api_key, "Content-Type": "application/json"}
        delay = 1.0
        last_error: Exception | None = None
        for _ in range(3):
            try:
                async with httpx.AsyncClient(timeout=20.0) as client:
                    response = await client.request(method, url, headers=headers, json=json)
                    response.raise_for_status()
                    return response.json()
            except Exception as exc:  # pragma: no cover
                last_error = exc
                await asyncio.sleep(delay)
                delay *= 2
        raise RuntimeError(f"World Labs request failed after retries: {method} {url}: {last_error}")
