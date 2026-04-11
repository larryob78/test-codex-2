from __future__ import annotations

import asyncio
from pathlib import Path

from src.config import Config


class ElevenLabsClient:
    def __init__(self, config: Config):
        self.config = config

    async def tts(self, text: str) -> str:
        await asyncio.sleep(0)
        out = Path("outputs/audio")
        out.mkdir(parents=True, exist_ok=True)
        file_path = out / f"tts-{abs(hash(text)) % 10_000}.mp3"
        file_path.write_bytes(b"mock-audio")
        return str(file_path)

    async def sfx(self, prompt: str, duration: int) -> str:
        await asyncio.sleep(0)
        out = Path("outputs/audio")
        out.mkdir(parents=True, exist_ok=True)
        file_path = out / f"sfx-{abs(hash((prompt, duration))) % 10_000}.mp3"
        file_path.write_bytes(b"mock-audio")
        return str(file_path)
