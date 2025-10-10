"""Utilities for building and packaging OpenAI AgentKit configurations."""

from __future__ import annotations

from importlib.metadata import PackageNotFoundError, version

try:  # pragma: no cover - runtime convenience only
    __version__ = version("agentkit")
except PackageNotFoundError:  # pragma: no cover - runtime convenience only
    __version__ = "0.0.0"

__all__ = ["__version__"]
