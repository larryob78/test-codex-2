from __future__ import annotations

import argparse
import asyncio

import httpx
from rich.console import Console
from rich.table import Table

from src.config import load_config

console = Console()


def _auth_hint(status_code: int) -> str:
    if status_code == 401:
        return "unauthorized (check API key value)"
    if status_code == 403:
        return "forbidden (key valid but lacks scope/project access, or key is revoked)"
    if status_code == 429:
        return "rate limited"
    if status_code >= 500:
        return "provider server error"
    return "ok"


async def _simple_get(name: str, url: str, headers: dict[str, str] | None = None) -> tuple[str, bool, str]:
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.get(url, headers=headers or {})
            status = response.status_code
            detail = _auth_hint(status)
            return name, 200 <= status < 300, f"HTTP {status} — {detail}"
    except Exception as exc:  # pragma: no cover
        return name, False, str(exc)[:120]


async def _missing_key(service: str, env_name: str) -> tuple[str, bool, str]:
    return service, False, f"missing {env_name}"


async def test_nvidia(config):
    if not config.nvidia_api_key:
        return await _missing_key("NVIDIA NIM", "NVIDIA_API_KEY")
    return await _simple_get("NVIDIA NIM", f"{config.nvidia_nim_base_url}/models", {"Authorization": f"Bearer {config.nvidia_api_key}"})


async def test_claude(config):
    return "Claude API", bool(config.anthropic_api_key), "key configured" if config.anthropic_api_key else "missing ANTHROPIC_API_KEY"


async def test_meshy(config):
    if not config.meshy_api_key:
        return await _missing_key("Meshy", "MESHY_API_KEY")
    return await _simple_get("Meshy", "https://api.meshy.ai/openapi/v2/text-to-3d", {"Authorization": f"Bearer {config.meshy_api_key}"})


async def test_worldlabs(config):
    if not config.worldlabs_api_key:
        return await _missing_key("World Labs", "WORLDLABS_API_KEY")
    return await _simple_get("World Labs", "https://api.worldlabs.ai/marble/v1/worlds", {"WLT-Api-Key": config.worldlabs_api_key})


async def test_runway(config):
    ok = bool(config.runway_api_key and config.runway_api_secret)
    return "Runway", ok, "keys configured" if ok else "missing RUNWAY_API_KEY/SECRET"


async def test_luma(config):
    if not config.luma_api_key:
        return await _missing_key("Luma", "LUMA_API_KEY")
    return await _simple_get("Luma", "https://api.lumalabs.ai/dream-machine/v1/generations/concepts/list", {"authorization": f"Bearer {config.luma_api_key}"})


async def test_elevenlabs(config):
    if not config.elevenlabs_api_key:
        return await _missing_key("ElevenLabs", "ELEVENLABS_API_KEY")
    return await _simple_get("ElevenLabs", "https://api.elevenlabs.io/v1/voices", {"xi-api-key": config.elevenlabs_api_key})


ALL_TESTS = {
    "nvidia": test_nvidia,
    "claude": test_claude,
    "meshy": test_meshy,
    "worldlabs": test_worldlabs,
    "runway": test_runway,
    "luma": test_luma,
    "elevenlabs": test_elevenlabs,
}


async def run_debug(test_name: str | None = None):
    config = load_config()
    table = Table(title="NemoClaw API Debug")
    table.add_column("Service", style="cyan")
    table.add_column("Status", style="bold")
    table.add_column("Detail")

    tests = {test_name: ALL_TESTS[test_name]} if test_name else ALL_TESTS
    for _, fn in tests.items():
        svc, ok, detail = await fn(config)
        status = "[green]✓ CONNECTED[/]" if ok else "[red]✗ FAILED[/]"
        table.add_row(svc, status, detail)

    console.print(table)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", choices=list(ALL_TESTS.keys()), default=None)
    parser.add_argument("--test-all", action="store_true")
    args = parser.parse_args()
    selected = None if args.test_all else args.test
    asyncio.run(run_debug(selected))


if __name__ == "__main__":
    main()
