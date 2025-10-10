# Weaverboard API Overview

The NestJS API exposes REST and WebSocket endpoints for managing workflows, runs, and published apps.

## REST Endpoints
- `POST /v1/apps/:slug/run` – Submit an external run for a published app.
- `GET /v1/apps/:slug/runs/:id` – Fetch run metadata and status.
- `GET /v1/models` – List available adapters and cached models.
- `GET /admin/plans` – Manage plan configurations (admin only).
- `PATCH /admin/credits` – Update credit mappings (admin only).

## WebSocket
- `wss://<api-host>/v1/ws` – Streams job progress and completion events.

## OpenAPI
- Available at `/api/docs` with Swagger UI in development.

## Authentication
- JWT access tokens are required for all authenticated workspace routes. Refresh tokens are issued on login and stored securely in httpOnly cookies.
