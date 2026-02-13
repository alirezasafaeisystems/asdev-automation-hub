# Runbook — Secrets Rotation

Version: 1.0
Date: 2026-02-13

## Scope

This runbook covers rotation for:
- `SECRET_KEY`
- `ADMIN_API_TOKEN`
- provider credentials stored in `Connection.encryptedSecret`

## Prerequisites

- New secret values generated from a cryptographically secure source.
- Planned maintenance window or low-traffic deploy window.
- Access to deployment environment variables and Postgres backup.

## Rotation Procedure

1. Generate replacement values:
   - `SECRET_KEY`: minimum 32 characters.
   - `ADMIN_API_TOKEN`: minimum 24 characters.
2. Deploy new `SECRET_KEY` and `ADMIN_API_TOKEN` in environment configuration.
3. Restart `@asdev/web` and `@asdev/runner`.
4. Run health checks:
   - `curl -fsS http://localhost:3000/health`
   - `curl -fsS http://localhost:4000/health`
5. Validate admin API access with the new token.
6. Re-create provider connections (or rotate provider secrets) so they are re-encrypted under the current key.
7. Confirm CI dependency gate remains green (`Dependency audit` step in `.github/workflows/ci.yml`).

## Verification Checklist

- [ ] Admin auth works with new token.
- [ ] Existing workflows execute without runtime errors.
- [ ] New connections are successfully created and tested.
- [ ] Audit logs contain post-rotation connection updates.

## Rollback

1. Restore previous environment values.
2. Restart web and runner services.
3. Verify health and admin access.
4. Restore Postgres backup only if data corruption or unrecoverable encryption mismatch is detected.
