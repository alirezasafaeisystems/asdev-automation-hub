# Workflow DSL v0 Specification

**Version:** 1.0  
**Date:** 2026-02-10

## Scope
Minimal DSL for Phase 0–1:
- Trigger + linear steps
- Step policies (timeout/retry)
- Variable interpolation
- Idempotency hooks

## Step fields
- id
- connector
- operation
- connectionId (optional)
- input
- policy (optional): timeoutMs, maxAttempts, backoffMs

## Interpolation
Tokens:
- {trigger.path}
- {stepId.output.path}
- {env.path}

## Idempotency
idempotencyKey = runId + ':' + stepId
Passed into connector ctx.
