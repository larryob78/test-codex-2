"""Module entrypoint so the package can be executed via ``python -m agentkit``."""

from __future__ import annotations

import sys
from .cli import main


def run() -> int:
    """Execute the AgentKit CLI and return its exit code."""

    return main()


if __name__ == "__main__":  # pragma: no cover - delegated to CLI tests
    sys.exit(run())
