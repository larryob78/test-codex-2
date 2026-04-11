from __future__ import annotations

import json
from pathlib import Path

import pytest

from agentkit.tool_scaffolder import ToolScaffolder


def test_scaffold_creates_expected_files(tmp_path: Path) -> None:
    scaffolder = ToolScaffolder(tmp_path)

    target = scaffolder.scaffold(
        name="Ad Concept Generator",
        description="Generate campaign concepts from a short prompt",
    )

    assert target == tmp_path / "ad-concept-generator"
    schema = json.loads((target / "schema.json").read_text(encoding="utf-8"))
    assert schema["name"] == "ad-concept-generator"
    assert schema["description"] == "Generate campaign concepts from a short prompt"
    assert schema["input_schema"]["required"] == ["prompt"]
    assert (target / "README.md").exists()


def test_scaffold_prevents_overwrite_without_force(tmp_path: Path) -> None:
    scaffolder = ToolScaffolder(tmp_path)
    scaffolder.scaffold(name="My Tool", description="A tool")

    with pytest.raises(FileExistsError):
        scaffolder.scaffold(name="My Tool", description="A tool")


def test_slugify_rejects_empty_name(tmp_path: Path) -> None:
    scaffolder = ToolScaffolder(tmp_path)

    with pytest.raises(ValueError):
        scaffolder.scaffold(name="***", description="bad")
