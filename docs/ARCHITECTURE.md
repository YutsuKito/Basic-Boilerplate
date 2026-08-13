# Architecture

Basic Boilerplate separates the spec engine from language templates and project profiles.

## Canonical stacks

- `typescript`: aliases `typescript`, `ts`, `node`, `node-ts`, `node-typescript`
- `javascript`: aliases `javascript`, `js`, `node-js`
- `java`
- `rust`
- `python`
- `csharp`
- `cpp`
- `go`

TypeScript and JavaScript are intentionally separate. The `node` alias chooses the typed Node.js baseline.

## Profiles

The generator supports `basic`, `api`, `saas`, `ai-agent`, `worker` and `research`.

Non-TypeScript stacks currently use the basic profile. TypeScript composes richer capabilities from explicit template files and manifests.

## TypeScript workspace

The generated workspace can contain:

```text
apps/
  api/        HTTP application boundary
  web/        Next.js and React application
  worker/     background processing boundary
  research/   experiment boundary

packages/
  config/         environment validation
  database/       PostgreSQL and Prisma
  auth/           authentication provider boundary and RBAC
  ai/             common AI provider contract
  context/        retrieval/context contracts for RAG-oriented flows
  queue/          queue contracts
  security/       redaction and safe-error helpers
  observability/  structured logging
  types/          shared domain/application types
```

The root TypeScript template also includes pnpm workspaces, Turborepo, strict TypeScript settings, `.env.example` and a generated-project CI workflow.

## Profile composition

`basic` contains the TypeScript foundation.

`api` adds the data manifest, API application and auth boundary.

`saas` adds data, API, auth, worker, queue, AI provider contracts, retrieval context and web application.

`ai-agent` adds data, API, worker, queue, AI provider contracts and retrieval context.

`worker` adds data, worker and queue boundaries.

`research` adds data, AI provider contracts, retrieval context and experiment scaffolding.

## AI boundary

The common AI contract represents chat, optional streaming and optional embeddings. Provider configuration recognizes OpenAI, DeepSeek, Gemini, local endpoints and custom providers. Provider-specific SDK or HTTP implementations remain adapters behind the interface instead of being hardwired into application code.

## Persistence and local infrastructure

The data capability includes PostgreSQL, Prisma and Redis-oriented local infrastructure. The generated `.env.example` documents the configuration surface while real environment values stay outside version control.

## Security and observability

The baseline includes environment validation, structured logging, basic redaction helpers, safe error serialization and explicit auth/RBAC boundaries. Framework-specific hardening remains in profile adapters so it can evolve without changing domain code.

## Spec-driven contract

Every generated project receives `.spec/config.json`, `.spec/principles.md`, `.spec/templates.json` and `AGENTS.md`.

A non-trivial feature should use:

```text
.spec/features/<feature>/
  spec.md
  design.md
  tasks.md
  evidence.md
```

Requirements use stable IDs and acceptance criteria must map to passing evidence before a feature is marked complete.

## Mechanical gate

Repository validation checks stack manifests, aliases, profiles and every declared template source. It also smoke-generates a TypeScript SaaS project and verifies that the required platform boundaries exist. This makes accidental removal of a module a CI failure instead of a documentation drift.
