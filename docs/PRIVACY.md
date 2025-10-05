# Privacy Program

- Consent is stored per profile in RedisJSON. The bidder checks consent before using personalized segments.
- DSAR export and erase endpoints operate on Postgres, Redis, and ClickHouse with anonymization for analytics data.
- AI requests are logged with provider metadata for auditability.
- Access to personal data is role gated through Keycloak OIDC roles and enforced in the API layer.
