#!/usr/bin/env bash
set -euo pipefail

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required (https://pnpm.io)" >&2
  exit 1
fi

pnpm install
pnpm --filter @weaverboard/api prisma generate

cat <<EOT
Environment setup complete. Remember to copy .env.example to .env in each app as needed.
EOT
