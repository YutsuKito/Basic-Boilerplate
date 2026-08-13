# Feature: Complete Platform Boilerplate

Status: DRAFT
Created: 2026-08-13

## Problem
The v0.1 generator supports several languages, but the platform capabilities originally expected from the boilerplate were reduced to minimal runtime templates. Node.js + TypeScript is not a first-class stack and reusable production modules are missing.

## Goal
Provide a composable multi-stack boilerplate where Node.js + TypeScript is first-class and production-oriented capabilities can be selected without coupling every project to every dependency.

## Out of scope
- Implement every web framework for every language in this feature.
- Provision real cloud infrastructure.
- Store secrets or credentials in the repository.

## User stories
### US-001
As a developer, I want Node.js + TypeScript as a first-class stack so that I can start typed backend and SaaS projects directly.

### US-002
As a developer, I want reusable platform capabilities so that authentication, persistence, AI, security, observability and workers do not need to be reinvented.

### US-003
As a developer, I want profiles so that small projects remain small while SaaS, AI and worker projects receive the modules they need.

## Requirements
- REQ-001: Add TypeScript/Node.js as a distinct first-class stack with aliases `typescript`, `ts`, `node`, `node-ts` and `node-typescript`.
- REQ-002: Preserve JavaScript, Java, Rust, Python, C#, C++ and Go stack support.
- REQ-003: Add composable profiles: `basic`, `api`, `saas`, `ai-agent`, `worker` and `research`.
- REQ-004: The TypeScript platform must include configuration, PostgreSQL/Prisma, Redis-ready workers, auth/RBAC, AI provider abstraction, RAG contracts, security helpers, observability/logging and shared types.
- REQ-005: The SaaS profile must provide Next.js/React web, Node.js/TypeScript API and worker-oriented project boundaries.
- REQ-006: Add Docker/Compose development infrastructure for PostgreSQL and Redis without embedding credentials intended for production.
- REQ-007: Generated projects must inherit the spec-driven structure and agent instructions.
- REQ-008: Validation must mechanically verify registry aliases, profiles and required TypeScript platform files.
- REQ-009: Document architecture, CLI examples and extension points.

## Acceptance criteria
- AC-001: `npm run stacks` lists both `javascript` and `typescript` plus Java, Rust, Python, C#, C++ and Go.
- AC-002: `node tools/boilerplate.mjs create typescript <dir> --profile saas` creates the TypeScript platform scaffold.
- AC-003: The generated TypeScript scaffold exposes modules for config, database, auth/RBAC, AI providers, RAG, security, observability and workers.
- AC-004: The generated scaffold includes Docker Compose definitions for PostgreSQL and Redis and an `.env.example`.
- AC-005: `basic`, `api`, `saas`, `ai-agent`, `worker` and `research` are recognized profiles.
- AC-006: Existing non-TypeScript stack generation remains registered.
- AC-007: Repository validation fails if a required profile, alias or TypeScript platform file is missing.

## Assumptions
- [RESOLVED] ASSUMPTION-001: TypeScript is a separate canonical stack from JavaScript.
- [RESOLVED] ASSUMPTION-002: `node` defaults to the TypeScript stack because it is the preferred Node baseline for this boilerplate.
- [RESOLVED] ASSUMPTION-003: Framework-heavy variants remain profile-driven rather than becoming mandatory dependencies.

## Open questions
- [RESOLVED] QUESTION-001: Should every language receive identical SaaS modules? No; the shared generator contract is universal, while framework-specific capabilities evolve per stack/profile.
