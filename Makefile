SHELL := /bin/bash

.PHONY: setup up down seed lint test build prisma-generate

setup:
corepack enable
pnpm install --frozen-lockfile || pnpm install

up:
docker compose -f infra/docker/compose.yaml --project-directory . up --build

seed:
docker compose -f infra/docker/compose.yaml --project-directory . run --rm api pnpm prisma db seed
docker compose -f infra/docker/compose.yaml --project-directory . run --rm scripts python scripts/seed_profiles.py
docker compose -f infra/docker/compose.yaml --project-directory . run --rm scripts python scripts/seed_clickhouse.py

lint:
pnpm lint
golangci-lint run ./...
poetry run ruff check .

build:
pnpm build
go build ./...
poetry build

down:
docker compose -f infra/docker/compose.yaml --project-directory . down -v

test:
pnpm test
go test ./...
poetry run pytest
