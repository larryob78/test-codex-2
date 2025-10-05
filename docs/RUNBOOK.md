# Runbook

1. Copy `.env.example` to `.env` and adjust secrets.
2. Run `make up` to start Docker Compose.
3. Access Keycloak at http://localhost:8080 and log in with admin/admin to inspect the demo realm.
4. Visit http://localhost to reach the advertiser portal. Use `advertiser@example.com` (password configured in Keycloak) for demo access.
5. API documentation is available at http://localhost:4000/docs once the stack is online.
6. Use `make seed` to populate Postgres, Redis, and ClickHouse.
