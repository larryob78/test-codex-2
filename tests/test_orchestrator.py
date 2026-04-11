import pytest

from src.config import Config
from src.core.orchestrator import run_campaign
from src.core.types import Brief


@pytest.mark.asyncio
async def test_orchestrator_returns_campaign_output():
    brief = Brief(brand="Acme", objective="Drive trial", audience="25-45", tone="warm")
    output = await run_campaign(brief, Config())

    assert output.status in {"shipped", "review"}
    assert output.shot_plan is not None
    assert len(output.shot_plan.shots) == 8
    assert output.assets is not None
    assert len(output.assets) == 8
