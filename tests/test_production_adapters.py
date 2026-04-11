import pytest

from src.config import Config
from src.production.meshy_adapter import MeshyClient
from src.production.worldlabs_adapter import WorldLabsClient


@pytest.mark.asyncio
async def test_meshy_mock_mode_without_api_key(tmp_path):
    client = MeshyClient(Config(meshy_api_key=""))
    task_id = await client.text_to_3d("floating sneaker")
    result = await client.poll(task_id, "text-to-3d")
    out = await client.download(result, str(tmp_path))

    assert task_id.startswith("meshy-")
    assert result["status"] == "SUCCEEDED"
    assert out.endswith(".glb")


@pytest.mark.asyncio
async def test_worldlabs_mock_mode_without_api_key():
    client = WorldLabsClient(Config(worldlabs_api_key=""))
    op_id = await client.generate_from_text("city at dawn", "Shot 1")
    result = await client.poll(op_id)

    assert op_id.startswith("world-")
    assert result["browser_url"].startswith("https://assets.local/world/")
    assert result["outputs"]["splat_100k"].endswith(".spz")
