"""Scaffold utility for bootstrapping new tool definitions."""

from __future__ import annotations

import json
import re
from pathlib import Path


class ToolScaffolder:
    """Generate a starter folder for a new tool."""

    def __init__(self, base_output: Path) -> None:
        self.base_output = base_output

    @staticmethod
    def slugify(name: str) -> str:
        slug = re.sub(r"[^a-z0-9]+", "-", name.strip().lower()).strip("-")
        if not slug:
            raise ValueError("Tool name must include at least one alphanumeric character")
        return slug

    def scaffold(self, *, name: str, description: str, force: bool = False) -> Path:
        tool_id = self.slugify(name)
        target_dir = self.base_output / tool_id

        if target_dir.exists() and not force:
            raise FileExistsError(
                f"{target_dir} already exists. Use --force to overwrite scaffold files."
            )

        target_dir.mkdir(parents=True, exist_ok=True)

        schema_path = target_dir / "schema.json"
        readme_path = target_dir / "README.md"

        schema_payload = {
            "name": tool_id,
            "title": name,
            "description": description,
            "input_schema": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "Primary user instruction for this tool",
                    }
                },
                "required": ["prompt"],
                "additionalProperties": False,
            },
        }

        schema_path.write_text(json.dumps(schema_payload, indent=2) + "\n", encoding="utf-8")
        readme_path.write_text(
            "\n".join(
                [
                    f"# {name}",
                    "",
                    description,
                    "",
                    "## Next steps",
                    "",
                    "1. Expand `schema.json` with all inputs your tool needs.",
                    "2. Add implementation details and examples to this README.",
                    "3. Wire the tool into your AgentKit configuration.",
                    "",
                ]
            ),
            encoding="utf-8",
        )

        return target_dir
