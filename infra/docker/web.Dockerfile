# syntax=docker/dockerfile:1.6
FROM node:20.10.0-slim AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* .npmrc* ./
COPY apps/web/package.json apps/web/
COPY packages/shared-types/package.json packages/shared-types/
RUN corepack enable && pnpm fetch --workspace-root || true

FROM base AS build
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @adtech/shared-types build
RUN pnpm --filter @adtech/web build

FROM node:20.10.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web/.next/standalone ./
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
