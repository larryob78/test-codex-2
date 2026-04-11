import pytest

from src.config import Config
from src.production.video_client import VideoClient


@pytest.mark.asyncio
async def test_video_client_runway_backend():
    client = VideoClient("runway", Config())
    url = await client.generate("prompt")
    assert "runway" in url


@pytest.mark.asyncio
async def test_video_client_luma_backend():
    client = VideoClient("luma", Config())
    url = await client.generate("prompt")
    assert "luma" in url
