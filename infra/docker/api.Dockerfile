# syntax=docker/dockerfile:1.6
FROM node:20.10.0-slim AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/
COPY packages/shared-types/package.json packages/shared-types/
RUN corepack enable && pnpm fetch --workspace-root || true

FROM base AS build
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @adtech/shared-types build
RUN pnpm --filter @adtech/api build

FROM node:20.10.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
RUN corepack enable && pnpm install --prod --filter @adtech/api
EXPOSE 4000
CMD ["node", "dist/main.js"]
