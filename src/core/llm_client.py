from __future__ import annotations

import json
import re

import httpx

from src.config import Config


class LLMClient:
    """Routes to NVIDIA NIM or Claude based on config."""

    def __init__(self, backend: str, config: Config):
        self.backend = backend
        self.config = config

    async def chat_json(self, system: str, user: str, model: str | None = None) -> dict:
        if self.backend == "nvidia":
            return await self._nvidia_chat(system, user, model)
        return await self._claude_chat(system, user, model)

    async def _nvidia_chat(self, system: str, user: str, model: str | None = None) -> dict:
        if not self.config.nvidia_api_key:
            return self._simulated(system, user)

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                f"{self.config.nvidia_nim_base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.config.nvidia_api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model or self.config.nvidia_llm_model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    "temperature": 0.7,
                    "max_tokens": 4096,
                    "response_format": {"type": "json_object"},
                },
            )
            resp.raise_for_status()
            raw = resp.json()["choices"][0]["message"]["content"]
        return self._parse_json(raw)

    async def _claude_chat(self, system: str, user: str, model: str | None = None) -> dict:
        if not self.config.anthropic_api_key:
            return self._simulated(system, user)

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": self.config.anthropic_api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": model or self.config.claude_model,
                    "max_tokens": 4096,
                    "system": system,
                    "messages": [{"role": "user", "content": user}],
                },
            )
            resp.raise_for_status()
            body = resp.json()
            raw = body["content"][0]["text"]
        return self._parse_json(raw)

    @staticmethod
    def _parse_json(raw: str) -> dict:
        cleaned = raw.strip()
        fenced = re.match(r"^```(?:json)?\s*(.*?)\s*```$", cleaned, flags=re.DOTALL | re.IGNORECASE)
        if fenced:
            cleaned = fenced.group(1).strip()
        return json.loads(cleaned)

    @staticmethod
    def _simulated(system: str, user: str) -> dict:
        return {
            "system": system[:80],
            "user": user[:120],
            "note": "simulated response (no API key configured)",
        }
