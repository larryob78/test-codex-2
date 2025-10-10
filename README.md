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
