"""Command line entry points for AgentKit bundle operations."""

from __future__ import annotations

import argparse
from pathlib import Path
from typing import Sequence

from .builder import AgentKitBundleBuilder


def build_command(args: argparse.Namespace) -> None:
    builder = AgentKitBundleBuilder(Path(args.config))
    bundle_dir = Path(args.output)
    archive_path = Path(args.archive) if args.archive else None
    builder.build(bundle_dir, archive_path)
    print(f"AgentKit bundle written to {bundle_dir}")
    if archive_path is not None:
        print(f"Archive created at {archive_path}")


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
