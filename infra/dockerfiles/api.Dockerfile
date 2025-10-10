FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN corepack enable pnpm && pnpm fetch
COPY . .
RUN pnpm install --offline
RUN pnpm --filter @weaverboard/api build
CMD ["pnpm", "--filter", "@weaverboard/api", "start"]
