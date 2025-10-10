from __future__ import annotations

import json
from pathlib import Path
import zipfile

import pytest

from agentkit.builder import AgentKitBundleBuilder


@pytest.fixture(scope="session")
def project_root() -> Path:
    return Path(__file__).resolve().parents[1]


@pytest.fixture()
def starter_config(project_root: Path) -> Path:
    return project_root / "starter-pack" / "agentkit_config.json"


def test_bundle_builder_creates_manifest_and_agents(tmp_path: Path, starter_config: Path) -> None:
    config_data = json.loads(starter_config.read_text(encoding="utf-8"))
    builder = AgentKitBundleBuilder(starter_config)
    output_dir = tmp_path / "bundle"
    archive_path = tmp_path / "bundle.zip"

    builder.build(output_dir, archive_path)

    manifest = json.loads((output_dir / "manifest.json").read_text(encoding="utf-8"))
    assert manifest["version"] == config_data["version"]
    assert any(agent_entry["id"] == "orchestrator" for agent_entry in manifest["agents"])

    orchestrator_path = output_dir / "agents" / "orchestrator.json"
    orchestrator = json.loads(orchestrator_path.read_text(encoding="utf-8"))
    assert orchestrator["model"] == "o3"
    assert orchestrator["response_format"]["json_schema"]["strict"] is True

    assert archive_path.exists()
    with zipfile.ZipFile(archive_path) as archive:
        namelist = archive.namelist()
        assert "manifest.json" in namelist
        assert "agents/orchestrator.json" in namelist


def test_bundle_builder_validates_missing_config(tmp_path: Path) -> None:
    missing_path = tmp_path / "missing.json"
    with pytest.raises(FileNotFoundError):
        AgentKitBundleBuilder(missing_path)
