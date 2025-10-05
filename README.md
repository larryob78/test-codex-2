# Adtech Platform

This monorepo delivers a production grade, privacy first, AI powered advertising stack. It includes a Next.js advertiser portal, NestJS APIs, Go bidder, FastAPI AI services, analytics, and infrastructure that runs locally with Docker Compose or on Kubernetes via Helm.

## Quickstart

```bash
make setup
cp .env.example .env
make up
```

Visit http://localhost and log in with the seeded Keycloak demo users described in `docs/RUNBOOK.md`.

Additional documentation lives in the `docs/` directory.
