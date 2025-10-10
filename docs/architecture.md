# Weaverboard Architecture

Weaverboard is organized as a Turborepo monorepo with three deployable applications (`web`, `api`, and `worker`) and shared packages.

## Data Flow Overview
1. **Web** application (Next.js) renders the creative canvas, admin tooling, and published apps. It authenticates via NextAuth and communicates with the API through REST and WebSocket APIs using the shared SDK.
2. **API** service (NestJS) exposes REST and WebSocket endpoints, manages authentication, orchestrates workflows, and persists all state in PostgreSQL via Prisma. BullMQ queues are used for async model execution and media processing.
3. **Worker** service consumes BullMQ jobs, interacts with model adapters (FAL, Replicate), processes media via FFmpeg, and stores assets in S3-compatible storage.
4. **Database** (PostgreSQL) holds relational data for users, workspaces, workflows, credits, and audit trails.
5. **Redis** (BullMQ) coordinates job queues and WebSocket pub/sub notifications.
6. **S3-compatible storage** (LocalStack in local dev) stores assets and previews using signed URLs from the API.

### Credits Pipeline
- Credit ledger entries are deducted prior to generative runs inside a database transaction.
- Worker completion updates run rows and publishes WebSocket events.
- Failed runs automatically refund credits via transactional rollback helpers.

### Security
- NextAuth handles user auth; API issues JWTs using refresh tokens for the SDK.
- Row-level access is enforced by scoping queries with the authenticated workspace membership.
- All presigned URLs are time-limited; audit logs are appended for all runs and payouts.

### Extensibility
- Nodes are defined as manifests in `packages/nodes`. They leverage runtime helpers for validation and execution in both API (validation) and worker (execution).
- Additional adapters implement the `IModelAdapter` interface defined in `packages/sdk`.
