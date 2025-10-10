from __future__ import annotations

import secrets
from pathlib import Path
from typing import Iterable
from urllib.parse import quote

from fastapi import HTTPException, UploadFile, status

from ..config import UPLOAD_DIR
from ..models.base import Sketch, utc_now


ALLOWED_CONTENT_TYPES: Iterable[str] = (
    "image/png",
    "image/jpeg",
    "image/webp",
    "image/svg+xml",
)


def _build_sketch_path(project_id: str, frame_id: str, file_extension: str) -> Path:
    filename = f"sketch-{secrets.token_hex(8)}{file_extension}"
    return UPLOAD_DIR / "projects" / project_id / "frames" / frame_id / "sketches" / filename


async def save_frame_sketch(project_id: str, frame_id: str, upload: UploadFile) -> Sketch:
    """Persist an uploaded sketch and return its metadata."""

    if upload.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Upload PNG, JPG, WebP, or SVG sketches.",
        )

    suffix = Path(upload.filename or "").suffix or _suffix_for_content_type(upload.content_type)
    target_path = _build_sketch_path(str(project_id), str(frame_id), suffix)
    target_path.parent.mkdir(parents=True, exist_ok=True)

    contents = await upload.read()
    target_path.write_bytes(contents)

    relative_path = target_path.relative_to(UPLOAD_DIR)
    public_path = "/uploads/" + "/".join(quote(part) for part in relative_path.parts)

    return Sketch(
        image_url=public_path,
        file_name=upload.filename or target_path.name,
        uploaded_at=utc_now(),
    )


def remove_frame_sketch(project_id: str, frame_id: str) -> None:
    """Delete all sketches associated with a frame."""

    sketches_dir = UPLOAD_DIR / "projects" / str(project_id) / "frames" / str(frame_id) / "sketches"
    if not sketches_dir.exists():
        return
    for path in sketches_dir.glob("*"):
        try:
            path.unlink()
        except FileNotFoundError:
            continue


def _suffix_for_content_type(content_type: str) -> str:
    mapping = {
        "image/png": ".png",
        "image/jpeg": ".jpg",
        "image/webp": ".webp",
        "image/svg+xml": ".svg",
    }
    return mapping.get(content_type, "")
