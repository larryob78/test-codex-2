from __future__ import annotations

from src.config import Config
from src.production.luma_adapter import LumaClient
from src.production.runway_adapter import RunwayClient


class VideoClient:
    """Routes to Runway or Luma based on config."""

    def __init__(self, backend: str, config: Config):
        self.backend = backend
        self._client = RunwayClient(config) if backend == "runway" else LumaClient(config)

    async def generate(self, prompt: str, image_url: str | None = None, duration: int = 10, aspect: str = "16:9") -> str:
        return await self._client.generate(prompt=prompt, image_url=image_url, duration=duration, aspect=aspect)
