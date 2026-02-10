# Connector System Specification (Manifest-first)

**Version:** 1.0  
**Date:** 2026-02-10

## Goals
- Dynamic integration layer (manifest + schema)
- UI forms generated from JSON Schema
- Safe secret handling and masked logging

## Requirements
Each connector package includes:
- manifest.json (key/name/version/auth/actions)
- runtime entrypoint
- tests
- README

## Runtime contract
runAction(ctx, input) -> output
ctx includes connection secrets, logger, idempotencyKey.
