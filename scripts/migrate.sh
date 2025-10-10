#!/usr/bin/env bash
set -euo pipefail

pushd "$(dirname "$0")/.." > /dev/null

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required" >&2
  exit 1
fi

pnpm --filter @weaverboard/api prisma migrate deploy
pnpm --filter @weaverboard/api prisma generate

popd > /dev/null
