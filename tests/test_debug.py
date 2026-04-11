import pytest

from src.config import Config
from src import debug as debug_mod


@pytest.mark.asyncio
async def test_debug_runner_executes_single_test():
    await debug_mod.run_debug("claude")


def test_auth_hint_for_forbidden_status():
    assert "lacks scope" in debug_mod._auth_hint(403)


@pytest.mark.asyncio
async def test_meshy_reports_missing_key():
    svc, ok, detail = await debug_mod.test_meshy(Config(meshy_api_key=""))
    assert svc == "Meshy"
    assert ok is False
    assert detail == "missing MESHY_API_KEY"
