# asdev-automation-hub Agent Guide

## Identity & Mission
- Repository: `asdev-automation-hub`
- Mission: Deliver a local-first automation platform with strict quality and traceable governance.
- High-risk domains: auth/RBAC, secrets handling, payment actions, workflow execution correctness.

## Repo Commands
- Setup: `pnpm install`
- Run: `pnpm --filter @asdev/web dev` and `pnpm --filter @asdev/runner dev`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Format: `pnpm exec prettier --check .`
- Build: `pnpm build`
- DB validate: `pnpm prisma:validate`
- Migration check: `pnpm migrate:check`

## Workflow Loop
`Discover -> Plan -> Task -> Execute -> Verify -> Document`

## Definition of Done
1. Requested scope is complete and minimal.
2. Relevant lint/typecheck/test/build checks pass.
3. Docs/changelog updated when behavior changes.
4. No unrelated files changed.
5. Risks and follow-ups documented.

## Human Approval Gates
- Auth/permissions/roles/security policy changes
- Breaking API/schema/db changes, destructive migrations, data deletion
- Adding dependencies or major-version upgrades
- Telemetry/external data transfer/secret handling changes
- Legal text (Terms/Privacy) or sensitive claims
- Critical UX/payment/signup/pricing flow changes

## Quality Checklist
- Tests: `pnpm test`
- Lint/format: `pnpm lint` and `pnpm exec prettier --check .`
- Type checks: `pnpm typecheck`
- Security checks: secret masking + RBAC tests + dependency audit in CI

## Lenses
- Quality
- Reliability
- Security
- Documentation
- Product
- Risk/Auditability

## Documentation & Change Log Expectations
- Update docs under `docs/` for architecture/behavior changes.
- Add release notes in PR description.
- Include command outcomes for `pnpm ci` in PR evidence.
