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

## Requirements
- REQ-001: Add TypeScript/Node.js as a distinct first-class stack.
- REQ-002: Preserve JavaScript, Java, Rust, Python, C#, C++ and Go stack support.
- REQ-003: Add profiles: `basic`, `api`, `saas`, `ai-agent`, `worker` and `research`.
- REQ-004: Add config, PostgreSQL/Prisma, Redis-ready workers, auth/RBAC, AI provider abstraction, RAG contracts, security, observability and shared types.
- REQ-005: The SaaS profile provides Next.js/React web, Node.js/TypeScript API and worker boundaries.
- REQ-006: Add Docker Compose for PostgreSQL and Redis.
- REQ-007: Generated projects inherit `.spec` and `AGENTS.md`.
- REQ-008: Validation verifies aliases, profiles and required TypeScript platform files.
- REQ-009: Document architecture and extension points.

## Acceptance criteria
- AC-001: `npm run stacks` lists JavaScript, TypeScript, Java, Rust, Python, C#, C++ and Go.
- AC-002: TypeScript SaaS generation succeeds.
- AC-003: Generated TypeScript exposes config, data, auth, AI/context, security, observability and worker modules.
- AC-004: Generated project includes PostgreSQL/Redis local infrastructure and `.env.example`.
- AC-005: Six profiles are recognized.
- AC-006: Existing non-TypeScript stacks remain registered.
- AC-007: Validation fails when required platform pieces are missing.

## Assumptions
- [RESOLVED] ASSUMPTION-001: TypeScript is separate from JavaScript.
- [RESOLVED] ASSUMPTION-002: `node` resolves to TypeScript.

## Open questions
- [RESOLVED] QUESTION-001: Rich framework profiles are introduced incrementally per stack.
