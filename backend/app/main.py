from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import ALLOWED_ORIGINS, UPLOAD_DIR

from .api import ai, characters, exports, frames, locations, projects, props, video


def create_app() -> FastAPI:
    app = FastAPI(title="Storyboard AI", version="0.1.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[origin.strip() for origin in ALLOWED_ORIGINS if origin.strip()],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(projects.router)
    app.include_router(frames.router)
    app.include_router(characters.router)
    app.include_router(locations.router)
    app.include_router(props.router)
    app.include_router(ai.router)
    app.include_router(video.router)
    app.include_router(exports.router)

    app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

    return app


app = create_app()
