"""Command line entry points for AgentKit bundle operations."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Sequence

from .builder import AgentKitBundleBuilder
from .tool_scaffolder import ToolScaffolder


def build_command(args: argparse.Namespace) -> None:
    builder = AgentKitBundleBuilder(Path(args.config))
    bundle_dir = Path(args.output)
    archive_path = Path(args.archive) if args.archive else None
    builder.build(bundle_dir, archive_path)
    print(f"AgentKit bundle written to {bundle_dir}")
    if archive_path is not None:
        print(f"Archive created at {archive_path}")



def scaffold_tool_command(args: argparse.Namespace) -> None:
    scaffolder = ToolScaffolder(Path(args.output))
    target_dir = scaffolder.scaffold(
        name=args.name,
        description=args.description,
        force=args.force,
    )
    print(f"Tool scaffold written to {target_dir}")

def create_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="AgentKit bundle utilities")
    subparsers = parser.add_subparsers(dest="command", required=True)

    build_parser = subparsers.add_parser("build", help="Build the AgentKit bundle directory")
    build_parser.add_argument(
        "--config",
        default="starter-pack/agentkit_config.json",
        help="Path to the AgentKit configuration JSON file",
    )
    build_parser.add_argument(
        "--output",
        default="dist/agentkit-bundle",
        help="Directory where the bundle should be materialised",
    )
    build_parser.add_argument(
        "--archive",
        help="Optional path for a .zip archive of the bundle",
    )
    build_parser.set_defaults(func=build_command)

    scaffold_parser = subparsers.add_parser(
        "scaffold-tool",
        help="Create a starter folder for a new tool definition",
    )
    scaffold_parser.add_argument("--name", required=True, help="Human-friendly tool name")
    scaffold_parser.add_argument(
        "--description",
        default="Starter scaffold for a new AgentKit tool",
        help="Short description used in the generated schema",
    )
    scaffold_parser.add_argument(
        "--output",
        default="starter-pack/tools",
        help="Parent directory where the tool folder should be generated",
    )
    scaffold_parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite scaffold files if the target folder already exists",
    )
    scaffold_parser.set_defaults(func=scaffold_tool_command)

    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = create_parser()
    args = parser.parse_args(argv)

    try:
        args.func(args)
    except Exception as exc:  # pragma: no cover - argparse exit tested via parser
        parser.exit(status=1, message=f"Error: {exc}\n")

    return 0


if __name__ == "__main__":  # pragma: no cover
    main()
