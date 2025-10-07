"""AgentKit bundle builder.

This module converts the repository configuration into a portable
OpenAI AgentKit bundle that can be imported into the Agent Builder UI or
provisioned via the API. It keeps the JSON schema contracts intact and
creates a manifest that mirrors the shared tools/agents hierarchy used in
the DevDay 2025 starter pack.
"""

from __future__ import annotations

import json
import shutil
import zipfile
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Iterable, List, Mapping, MutableMapping, Optional

JsonDict = Dict[str, Any]


@dataclass
class ToolDefinition:
    """Represents a shared tool definition in the AgentKit config."""

    name: str
    raw: JsonDict

    def to_manifest_entry(self) -> JsonDict:
        """Return the manifest representation for this tool."""

        manifest = {"name": self.name, **{k: v for k, v in self.raw.items() if k != "name"}}
        manifest.setdefault("type", "built_in")
        return manifest


@dataclass
class AgentDefinition:
    """Represents an agent entry from the configuration."""

    raw: JsonDict

    @property
    def agent_id(self) -> str:
        try:
            return self.raw["id"]
        except KeyError as exc:  # pragma: no cover - validated upstream
            raise ValueError("Agent definition is missing an 'id' field") from exc

    def to_manifest_entry(self) -> JsonDict:
        manifest: JsonDict = {
            "id": self.agent_id,
            "name": self.raw.get("name", self.agent_id.title()),
            "model": self.raw.get("model"),
            "instructions": self.raw.get("prompt", ""),
            "tools": self.raw.get("tools", []),
        }

        if "fallback_model" in self.raw:
            manifest["fallback_model"] = self.raw["fallback_model"]

        if "input_schema" in self.raw:
            manifest["input_schema"] = self.raw["input_schema"]

        if "output_schema" in self.raw:
            output_schema = self.raw["output_schema"].copy()
            output_schema.setdefault("$schema", "https://json-schema.org/draft/2020-12/schema")
            manifest["output_schema"] = output_schema

        if "handoff_rules" in self.raw:
            manifest["handoff_rules"] = self.raw["handoff_rules"]

        return manifest

    def to_agent_file(self) -> JsonDict:
        payload = self.to_manifest_entry()
        payload.setdefault("response_format", {})

        if "output_schema" in payload:
            schema = payload["output_schema"]
            payload["response_format"] = {
                "type": "json_schema",
                "json_schema": {
                    "name": schema.get("title", self.agent_id.replace("-", "_")),
                    "schema": schema,
                    "strict": True,
                },
            }

        return payload


@dataclass
class AgentKitConfig:
    version: str
    metadata: JsonDict
    shared_tools: Mapping[str, ToolDefinition] = field(default_factory=dict)
    agents: List[AgentDefinition] = field(default_factory=list)

    @classmethod
    def from_json(cls, data: Mapping[str, Any]) -> "AgentKitConfig":
        if "version" not in data:
            raise ValueError("AgentKit config requires a 'version' field")
        if "metadata" not in data:
            raise ValueError("AgentKit config requires a 'metadata' field")
        if "agents" not in data or not isinstance(data["agents"], Iterable):
            raise ValueError("AgentKit config requires an iterable 'agents' field")

        shared_tools = {
            name: ToolDefinition(name=name, raw={"name": name, **tool_def})
            for name, tool_def in data.get("shared_tools", {}).items()
        }

        agents = [AgentDefinition(raw=agent) for agent in data["agents"]]

        return cls(
            version=str(data["version"]),
            metadata=dict(data.get("metadata", {})),
            shared_tools=shared_tools,
            agents=agents,
        )

    def to_manifest(self) -> JsonDict:
        return {
            "version": self.version,
            "metadata": self.metadata,
            "shared_tools": [tool.to_manifest_entry() for tool in self.shared_tools.values()],
            "agents": [
                {
                    "id": agent.agent_id,
                    "path": f"agents/{agent.agent_id}.json",
                    "tools": agent.to_manifest_entry().get("tools", []),
                }
                for agent in self.agents
            ],
        }


class AgentKitBundleBuilder:
    """Builds a structured AgentKit bundle directory and archive."""

    def __init__(self, config_path: Path):
        self.config_path = Path(config_path)
        if not self.config_path.exists():
            raise FileNotFoundError(f"Config file not found: {self.config_path}")

        with self.config_path.open("r", encoding="utf-8") as fp:
            data = json.load(fp)

        self.config = AgentKitConfig.from_json(data)

    def write_bundle(self, output_dir: Path) -> None:
        output_dir = Path(output_dir)
        if output_dir.exists():
            shutil.rmtree(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        manifest_path = output_dir / "manifest.json"
        manifest_path.write_text(
            json.dumps(self.config.to_manifest(), indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )

        agents_dir = output_dir / "agents"
        agents_dir.mkdir(parents=True, exist_ok=True)
        for agent in self.config.agents:
            agent_path = agents_dir / f"{agent.agent_id}.json"
            agent_payload = agent.to_agent_file()
            agent_path.write_text(
                json.dumps(agent_payload, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8",
            )

        if self.config.shared_tools:
            tools_path = output_dir / "shared_tools.json"
            tools_payload = [tool.to_manifest_entry() for tool in self.config.shared_tools.values()]
            tools_path.write_text(
                json.dumps(tools_payload, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8",
            )

    def create_archive(self, bundle_dir: Path, archive_path: Path) -> None:
        bundle_dir = Path(bundle_dir)
        archive_path = Path(archive_path)
        archive_path.parent.mkdir(parents=True, exist_ok=True)

        with zipfile.ZipFile(archive_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
            for file_path in bundle_dir.rglob("*"):
                if file_path.is_file():
                    archive.write(file_path, file_path.relative_to(bundle_dir))

    def build(self, output_dir: Path, archive_path: Optional[Path] = None) -> Path:
        self.write_bundle(output_dir)
        if archive_path is not None:
            self.create_archive(output_dir, archive_path)
        return output_dir


__all__ = [
    "AgentKitBundleBuilder",
    "AgentDefinition",
    "AgentKitConfig",
    "ToolDefinition",
]
