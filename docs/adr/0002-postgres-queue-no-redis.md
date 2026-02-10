# ADR 0002 — Postgres-based Queue (No Redis)

**Status:** Accepted  
**Date:** 2026-02-10

Decision: Implement job queue in Postgres using SKIP LOCKED to minimize dependencies for self-host.
