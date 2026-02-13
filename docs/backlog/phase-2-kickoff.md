# Phase 2 Kickoff Board

Date: 2026-02-13
Status: in_progress

## Objective
Move from Phase 1 prototype completion to a production-ready self-hosted platform baseline.

## Track A - Platform Hardening

- [ ] P2-A1 Auth + workspace persistence
- [ ] P2-A2 Postgres-backed control-plane repositories
- [ ] P2-A3 Run timeline API backed by DB
- [ ] P2-A4 Security tightening (secrets rotation playbook + dependency audit gate)

## Track B - Operator Experience

- [ ] P2-B1 Admin runs screen filters and retry controls
- [ ] P2-B2 Connection diagnostics UX by provider
- [ ] P2-B3 Template install wizard with preflight checklist

## Definition of Done

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm test` passes
- [ ] `pnpm build` passes
- [ ] Admin APIs documented with request/response examples
- [ ] E2E smoke validates template installation and a full run
