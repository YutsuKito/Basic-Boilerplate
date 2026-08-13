# Agent instructions

This repository is spec-anchored.

For non-trivial features, create `.spec/features/<slug>/` with `spec.md`, `design.md`, `tasks.md` and `evidence.md` before implementation.

Use stable IDs: `US-001`, `REQ-001`, `AC-001`, `TASK-001` and `RULE-001`.

Required lifecycle:

1. Specify the problem, scope, requirements and acceptance criteria.
2. Design the technical approach and map requirements to components.
3. Plan tasks with touched files, dependencies and optional execution lanes.
4. Execute with narrow commits where practical.
5. Audit with `npm run spec:audit` and stack-specific tests.

Do not silently resolve material unknowns. Record assumptions/questions in the spec.

Tasks may run in parallel only when their dependencies and file scopes make that safe. Prefer separate branches/worktrees for independent lanes.

A feature marked `Status: COMPLETE` must map every acceptance criterion to `PASS` evidence. Never declare completion only because code looks correct.
