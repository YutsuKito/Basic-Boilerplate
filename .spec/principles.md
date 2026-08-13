# Project Engineering Principles

## RULE-001 — Verifiable specifications
A feature marked COMPLETE must have acceptance criteria and matching passing evidence.

## RULE-002 — Explicit unknowns
Product and architecture assumptions must be recorded. Open material questions block completion.

## RULE-003 — External configuration
Environment-specific configuration remains outside committed application logic.

## RULE-004 — Health contract
Every service template exposes GET /health and returns a machine-readable healthy response.

## RULE-005 — Testable change
Behavior changes require automated validation or an explicit reviewable exception.

## RULE-006 — Conflict-aware parallel work
Tasks use parallel lanes only when dependencies and touched files make that safe.

## RULE-007 — Idiomatic stacks
Shared contracts are standardized while each language keeps idiomatic internal structure.
