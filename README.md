# Retro Robot Pursuit Monitor

This repository hosts a single-page retro-inspired surveillance simulation. Open `index.html` in any modern browser to view an animated 1980s-style computer feed showing robots chasing humans, complete with CRT effects and synth audio.

## Getting Started

1. Open the `index.html` file in your browser.
2. Click **Boot Audio Signal** (or press the space bar) to enable the looping synth soundscape.
3. Enjoy the animated pursuit rendered in pixel art on a faux CRT interface.

The experience runs entirely client-side with no build step required.
# Parody Advertisement Showcase

This repository contains a small Python program that recreates several famous
television advertisements as tongue-in-cheek console animations. Each spot is a
parody rendered entirely with ASCII art and code-driven timing—no video files
required.

## Included Parodies

The script riffs on classics such as:

* Cadbury's drumming gorilla (reimagined as **Cadbunny's Midnight Solo**)
* Sony BRAVIA's bouncing balls (now **Only Brighter Balls**)
* Guinness' surfer (transformed into **Guinness Coder Surfer**)
* Old Spice's swaggering spokesperson (reborn as **Old Syntax Guy**)
* Apple's "1984" (remixed into **April 2084**)
* Honda's "Cog" (croaking as **Honda Frog**)
* Nike's "Write the Future" (rewritten as **Write the Feature**)

## Running the Showcase

```bash
python parody_ads.py
```

Each parody will appear sequentially with simple terminal-clearing animations.
Use `Ctrl+C` if you want to exit early.

### Previewing the visuals

If you'd rather skim the ASCII art without the timing effects, use the
`--preview` flag. This prints each frame with labels so you can check the
visual gags at a glance.

```bash
python parody_ads.py --preview
```

### Focusing on specific parodies

Pass the title, slug, brand, or list number via `--ad` to preview or animate
specific spoofs. You can repeat the flag or provide comma-separated values to
queue multiple ads:

```bash
python parody_ads.py --ad surfer
python parody_ads.py --ad 3 --preview
python parody_ads.py --preview --ad 1,4 --ad "pear computers"
```

Run `python parody_ads.py --list` to see every available identifier, and use
`--delay` to tweak the animation speed if you prefer a faster or slower pace.
# Random Video Remixer

This repository contains a small command-line video editor that randomly remixes
input videos and layers music on top of the final result. Each run shuffles the
clips, applies a different selection of visual effects, and optionally mixes in a
random audio track.

## Quick start

1. Install dependencies (requires Python 3.9+ and FFmpeg):
   ```bash
   pip install -r requirements.txt
   ```
2. Run the tool with one or more video files:
   ```bash
   python src/random_video_editor.py input1.mp4 input2.mp4 --music music_folder/
   ```

The command above will:
- Randomly trim each input clip to a sub-segment.
- Concatenate the clips in a different order each time.
- Apply between two and four random effects (speed changes, fades, zooms, etc.).
- Pick a music track (file or directory) and mix it with the original audio.
- Export the remixed video as an MP4 file using H.264 video and AAC audio.

Run `python src/random_video_editor.py --help` to see every option, including
volume control, effect counts, reproducible seeds, and the preview options:

```bash
python src/random_video_editor.py input.mp4 --preview --preview-duration 8
```

The command above renders a short 8-second preview (resized to 360p) before
exporting the full-quality remix, making it easy to check the random effects.
# Lovable Dropboard

A full-stack drag-and-drop gallery designed for Lovable. Drop files, paste from the clipboard, or
embed URLs and watch them glow inside an immersive neon interface. The Express backend stores
uploaded files locally and keeps a JSON catalogue so your board persists across restarts.

## Features

- 🔥 Glassmorphism-inspired front end with drag & drop, paste, and manual upload controls
- 🧠 Smart link detection for YouTube, Vimeo, images, videos, audio, and generic URLs
- 💾 Express API with Multer-based file uploads and persistent JSON storage
- 🧹 REST endpoints to list, create, and delete board items

## Quick start

```bash
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

The server boots on [http://localhost:3000](http://localhost:3000). Open the page, then drag files or
paste URLs to see them appear instantly. The `/uploads` folder contains user uploads and can be wired
into Lovable file storage as needed.

## API

| Method | Endpoint        | Description                                |
| ------ | --------------- | ------------------------------------------ |
| GET    | `/api/items`    | Returns every stored gallery item          |
| POST   | `/api/upload`   | Accepts `multipart/form-data` with files   |
| POST   | `/api/embed`    | Accepts `{ "url": "https://..." }` payload |
| DELETE | `/api/items/:id`| Deletes an item (and uploaded file if any) |

## Deployment notes

- Persist the `uploads/` and `data/` directories between deploys to keep assets
- Set `PORT` via environment variable when hosting on Lovable
- Add reverse proxy or HTTPS at the platform level as required
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
# Weaverboard

Weaverboard is a creative workflow platform that lets teams design, run, and publish generative pipelines for text, image, and video content. The platform mirrors the public feature set of Weavy.ai while using original code and branding.

## Monorepo Overview

- **apps/web** – Next.js 14 UI with canvas editor, admin tooling, and published app experiences.
- **apps/api** – NestJS API with REST + WebSocket endpoints, Prisma ORM, and BullMQ orchestration.
- **apps/worker** – Node 20 worker executing queued jobs, model adapters, and FFmpeg media handling.
- **packages/ui** – Shared UI components using Tailwind-compatible styles.
- **packages/nodes** – Strongly typed node manifests, execution contracts, and tests.
- **packages/sdk** – Lightweight TypeScript SDK consumed by the web app and external clients.
- **infra** – Docker compose configuration, Dockerfiles, and Terraform stubs.
- **scripts** – Setup, migration, and seed helpers.
- **docs** – Architecture, API docs, node catalogue, and example workflows.

## Quick Start (5 minutes)

1. **Install prerequisites**
   - [Node.js 20+](https://nodejs.org/)
   - [pnpm](https://pnpm.io/) (Corepack recommended)
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/) or Docker Engine

2. **Bootstrap dependencies**
   ```bash
   ./scripts/setup.sh
   ```

3. **Copy environment examples**
   ```bash
   cp .env.example .env
   cp .env.example .env.web
   cp .env.example .env.api
   cp .env.example .env.worker
   ```
   Update the values inside each file. The minimum required variables are listed in [Environment](#environment).

4. **Apply database migrations and seed content**
   ```bash
   pnpm --filter @weaverboard/api prisma migrate deploy
   pnpm ts-node scripts/seed.ts
   ```

5. **Run the full stack**
   ```bash
   docker compose -f infra/docker-compose.yml up --build
   ```
   - Web UI: http://localhost:3000
   - API + Swagger: http://localhost:3001/api/docs

## Environment

Set these variables for local development (examples assume docker compose defaults):

```
DATABASE_URL=postgresql://weaver:weaver@postgres:5432/weaver
REDIS_URL=redis://redis:6379
S3_ENDPOINT=http://s3:4566
S3_BUCKET=weaverboard
S3_ACCESS_KEY_ID=localstack
S3_SECRET_ACCESS_KEY=localstack
FAL_API_KEY=changeme
REPLICATE_API_TOKEN=changeme
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXTAUTH_SECRET=devsecret
NEXTAUTH_URL=http://localhost:3000
JWT_SECRET=devjwtsecret
``` 

## Testing

Run unit tests across packages:

```bash
pnpm test
```

## Code Quality

- Strong typing enforced through TypeScript and Zod schemas.
- Shared node manifests ensure consistent behavior in API and worker services.
- Example workflows live in `docs/examples` and are loaded by the seed script.

## Deployment Notes

- Terraform stubs in `infra/terraform` outline AWS provider configuration.
- Container builds rely on pnpm workspaces and Turborepo caching.
- The worker connects to BullMQ queues exposed by the API and publishes status updates over HTTP.

## Support

For issues or enhancements, open a ticket or contribute a pull request with clear reproduction steps and tests.
