# Architecture

The platform is a polyglot monorepo with strongly typed interfaces.

- **Web**: Next.js 14 App Router with Tailwind and shadcn ui patterns. It uses TanStack Query for data fetching and consumes the generated shared client.
- **API**: NestJS service that fronts Prisma backed Postgres and exposes OpenAPI endpoints consumed by the web and bidder.
- **Analytics API**: Lightweight NestJS reader for ClickHouse aggregations.
- **Bidder**: Go HTTP service implementing OpenRTB 2.6 with a simple scoring model and in memory caches.
- **AI Services**: FastAPI microservices for copy, image, and video generation with mock providers enabled by default.
- **Data Plane**: Postgres, Redis, Redpanda, and ClickHouse with seed scripts under `scripts/`.
- **Infra**: Docker Compose for local and Helm charts for Kubernetes under `infra/k8s`.
