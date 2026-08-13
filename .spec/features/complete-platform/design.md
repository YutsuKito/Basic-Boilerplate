# Design: Complete Platform Boilerplate

## Context
The current generator writes one stack manifest and copies the spec workflow. This feature keeps that model, adds profile composition, and makes TypeScript with Node.js a production-oriented canonical stack.

## Proposed approach
1. Extend the registry with TypeScript aliases and profile metadata.
2. Add a TypeScript base manifest containing a pnpm/Turborepo workspace with API, web, worker and reusable packages.
3. Add profiles for basic, api, saas, ai-agent, worker and research.
4. Update the generator to parse `--profile <name>` and compose manifests.
5. Strengthen repository validation so missing TypeScript capabilities fail CI.

## Components
| Requirement | Component / file | Responsibility |
|---|---|---|
| REQ-001, REQ-002 | `templates/registry.json` | Stacks, aliases and manifests |
| REQ-003 | `templates/profiles.json` | Supported profiles |
| REQ-004, REQ-005 | `templates/typescript-platform.json` | Node.js and TypeScript platform scaffold |
| REQ-006 | generated infra files | PostgreSQL and Redis local development |
| REQ-007 | `tools/boilerplate.mjs` | Spec and agent policy inheritance |
| REQ-008 | `tools/validate.mjs` | Mechanical checks |
| REQ-009 | `README.md` | Architecture and CLI documentation |

## Interfaces
CLI commands include `stacks`, `profiles`, `create`, `feature` and `audit`.

The AI package exposes a provider contract with chat, stream and optional embeddings. The auth package separates authentication identity from RBAC authorization.

## Data and state
PostgreSQL is the default relational persistence target and Prisma owns schema and migrations in the TypeScript platform. Redis is the default cache and queue coordination target. Runtime configuration comes from environment variables.

## Security and privacy
Configuration is validated at startup. Structured logging includes redaction helpers. Authentication and authorization remain separate boundaries.

## Failure modes
Unknown stacks or profiles fail with supported values. Non-empty destinations are not overwritten. Missing manifests or required platform files make validation fail.

## Alternatives considered
A single giant mandatory template was rejected because it would force SaaS and AI dependencies into small projects. Implementing identical framework layers for all languages is deferred in favor of strong canonical stack baselines.

## Validation plan
`npm test` validates registry/profile composition and required TypeScript platform files.
