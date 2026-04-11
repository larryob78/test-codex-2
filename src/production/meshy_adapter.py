from __future__ import annotations

import asyncio
from pathlib import Path

import httpx

from src.config import Config


class MeshyClient:
    def __init__(self, config: Config):
        self.config = config
        self.base_url = "https://api.meshy.ai/openapi/v2"

    @property
    def _is_live(self) -> bool:
        return bool(self.config.meshy_api_key)

    async def text_to_3d(self, prompt: str) -> str:
        if not self._is_live:
            await asyncio.sleep(0)
            return f"meshy-{abs(hash(prompt)) % 10_000}"

        payload = {
            "prompt": prompt,
            "mode": "refine",
            "ai_model": "meshy-6",
            "topology": "quad",
            "enable_pbr": True,
            "enable_rigging": True,
            "rigging_height_meters": 0.05,
        }
        data = await self._request("POST", f"{self.base_url}/text-to-3d", json=payload, timeout=30.0)
        task_id = data.get("result") or data.get("id")
        if not task_id:
            raise RuntimeError(f"Meshy response missing task id: {data}")
        return str(task_id)

    async def poll(self, task_id: str, endpoint: str) -> dict:
        if not self._is_live:
            await asyncio.sleep(0)
            return {"task_id": task_id, "status": "SUCCEEDED", "endpoint": endpoint}

        wait_s = 5
        elapsed_s = 0
        timeout_s = 300
        while elapsed_s <= timeout_s:
            data = await self._request("GET", f"{self.base_url}/{endpoint}/{task_id}", timeout=20.0)
            status = str(data.get("status", "")).upper()
            if status == "SUCCEEDED":
                return data
            if status in {"FAILED", "CANCELED"}:
                raise RuntimeError(f"Meshy task {task_id} failed: {data}")
            await asyncio.sleep(wait_s)
            elapsed_s += wait_s
            wait_s = min(wait_s * 2, 30)
        raise TimeoutError(f"Meshy task {task_id} did not finish within {timeout_s}s")

    async def download(self, result: dict, out_dir: str) -> str:
        Path(out_dir).mkdir(parents=True, exist_ok=True)

        model_urls = result.get("model_urls", {}) if isinstance(result, dict) else {}
        download_url = model_urls.get("glb") if isinstance(model_urls, dict) else None
        if download_url and self._is_live:
            raw_bytes = await self._download_bytes(download_url)
        else:
            raw_bytes = b"mock-glb"

        task_id = str(result.get("id") or result.get("task_id") or "asset")
        file_path = Path(out_dir) / f"{task_id}.glb"
        file_path.write_bytes(raw_bytes)
        return str(file_path)

    async def _download_bytes(self, url: str) -> bytes:
        headers = {"Authorization": f"Bearer {self.config.meshy_api_key}"}
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            return response.content

    async def _request(self, method: str, url: str, *, json: dict | None = None, timeout: float = 20.0) -> dict:
        headers = {"Authorization": f"Bearer {self.config.meshy_api_key}", "Content-Type": "application/json"}
        delay = 1.0
        last_error: Exception | None = None
        for _ in range(3):
            try:
                async with httpx.AsyncClient(timeout=timeout) as client:
                    response = await client.request(method, url, headers=headers, json=json)
                    response.raise_for_status()
                    return response.json()
            except Exception as exc:  # pragma: no cover - network behaviour
                last_error = exc
                await asyncio.sleep(delay)
                delay *= 2
        raise RuntimeError(f"Meshy request failed after retries: {method} {url}: {last_error}")
