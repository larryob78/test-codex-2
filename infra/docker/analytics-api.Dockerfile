# syntax=docker/dockerfile:1.6
FROM node:20.10.0-slim AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
COPY apps/analytics-api/package.json apps/analytics-api/
RUN corepack enable && pnpm fetch --workspace-root || true

FROM base AS build
COPY . .
RUN corepack enable && pnpm install --frozen-lockfile
RUN pnpm --filter @adtech/analytics-api build

FROM node:20.10.0-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/analytics-api/dist ./dist
COPY --from=build /app/apps/analytics-api/package.json ./package.json
RUN corepack enable && pnpm install --prod --filter @adtech/analytics-api
EXPOSE 4100
CMD ["node", "dist/main.js"]
