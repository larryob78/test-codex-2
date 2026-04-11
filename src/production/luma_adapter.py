from __future__ import annotations

import asyncio

from src.config import Config


class LumaClient:
    def __init__(self, config: Config):
        self.config = config

    async def generate(self, prompt: str, image_url: str | None, duration: int, aspect: str) -> str:
        await asyncio.sleep(0)
        return f"https://assets.local/luma/{abs(hash((prompt, image_url, duration, aspect))) % 10_000}.mp4"
