from __future__ import annotations

import os
from pathlib import Path
from typing import List


def _default_upload_dir() -> Path:
    """Return the default upload directory and ensure it exists."""

    base_dir = Path(__file__).resolve().parents[1]
    uploads = base_dir / "uploads"
    uploads.mkdir(parents=True, exist_ok=True)
    return uploads


UPLOAD_DIR = Path(os.getenv("STORYBOARD_UPLOAD_DIR", _default_upload_dir()))
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_ORIGINS: List[str] = os.getenv("STORYBOARD_CORS_ORIGINS", "*").split(",")
