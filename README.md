# Storyboard AI Prototype

This repository contains a lightweight implementation of the Storyboard AI platform described in the specification. It ships with a FastAPI backend that exposes the core REST resources and a React + Tailwind CSS frontend that visualises the experience across the dashboard, storyboard canvas, and generation panels.

## Project Structure

```
├── backend
│   ├── app
│   │   ├── api
│   │   │   ├── ai.py
│   │   │   ├── exports.py
│   │   │   ├── frames.py
│   │   │   └── projects.py
│   │   ├── main.py
│   │   ├── models
│   │   │   └── base.py
│   │   └── services
│   │       └── store.py
│   └── requirements.txt
├── docs
│   └── storyboard-tool-spec.md
├── frontend
│   ├── index.html
│   ├── package.json
│   ├── src
│   │   ├── App.tsx
│   │   ├── components
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── FrameRow.tsx
│   │   │   ├── GenerationPanel.tsx
│   │   │   ├── PreviewShowcase.tsx
│   │   │   └── ProjectPage.tsx
│   │   ├── hooks
│   │   │   ├── useFrameMutations.ts
│   │   │   ├── useGenerationMutations.ts
│   │   │   ├── useGenerations.ts
│   │   │   └── useProjectDetail.ts
│   │   ├── main.tsx
│   │   ├── state
│   │   │   └── types.ts
│   │   └── styles.css
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
└── tests
    └── test_storyboard_spec.py
```

## Getting Started

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs on `http://127.0.0.1:8000` by default and exposes the endpoints defined in `docs/storyboard-tool-spec.md` (projects, frames, generations, AI helpers, and exports).

Sketch uploads are handled via `POST /api/frames/{frame_id}/sketch`. Send a `multipart/form-data` request with a `file` field containing a PNG, JPG, WebP, or SVG asset and the service stores it under `/uploads`. You can delete the most recent upload with `DELETE /api/frames/{frame_id}/sketch`.

Additional helper routes ship with the prototype:

- `POST /api/projects/{id}/characters|locations|props` to manage project asset libraries
- `GET /api/ai/video/providers` to inspect the configured Sora, Veo 3, and Kling 2.5 connectors
- `POST /api/projects/{id}/video/generations` to simulate kicking off a video diffusion render job

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The development server starts on `http://localhost:5173` and proxies `/api` and `/uploads` to `http://localhost:8000` by default. Adjust the target by exporting `VITE_API_BASE_URL` before running the dev server.

Once the frontend is running, visit `http://localhost:5173/preview` to explore a fully art-directed UI/UX showcase that presents the dashboard grid, frame workspace, and generation review flows with cinematic styling. This preview is fed by curated mock data so designers and stakeholders can review the look-and-feel without requiring live backend data.

The project workspace view now surfaces live character, location, and prop summaries alongside an AI video integration panel so you can confirm that narrative assets and motion providers stay in sync while iterating. Confirm any generated frame directly from the generation panel to lock the approved artwork back into the storyboard grid.

### Uploading from tablets or reMarkable

On iPadOS or reMarkable tablets you can share sketches directly to the storyboard tool:

1. Ensure the backend is reachable on the same network (for example via `docker-compose` or `uvicorn` running on your laptop).
2. Use the tablet's share sheet to open the project URL in Safari/Chrome, or upload via the `Upload Sketch` button, which launches the native file picker and supports Apple Pencil exports and reMarkable PDF snapshots.
3. The UI immediately reflects the uploaded sketch thumbnail and the file becomes available under `/uploads/...`, so the generation workflow can begin without refreshing the page.

### Testing the Specification

The existing regression tests validate the integrity of the specification. Run them from the repository root:

```bash
pytest
```

### Deployment with Docker Compose

For a production-style deployment the repository ships with a Docker Compose stack that runs the FastAPI service and the compiled React frontend behind separate containers with shared networking and persistent sketch storage:

```bash
docker-compose up --build
```

The frontend becomes available at `http://localhost:4173` and proxies API and upload requests to the backend on `http://localhost:8000`. Uploaded sketches are stored in `backend/uploads`, which is mounted as a volume so assets persist across restarts.

## Notes

- The backend uses an in-memory store so data resets on each restart. It is designed as a starting point for wiring in a real database such as PostgreSQL.
- AI-related endpoints currently return placeholder data so the front-end flows remain interactive without calling external services.
- The frontend focuses on the primary storyboard workflows (dashboard, frame management, and generation review) and can be extended with additional panels (characters, locations, props) following the same patterns.
