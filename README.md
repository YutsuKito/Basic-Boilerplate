# Basic Boilerplate

Multi-stack boilerplate for JavaScript, Java, Rust, Python, C#, C++ and Go.

## Development flow

`SPECIFY -> DESIGN -> TASKS -> EXECUTE -> AUDIT`

The repository includes a stack generator, feature-spec templates, traceability IDs, project principles, mechanical audit and GitHub Actions validation.

```bash
npm run stacks
npm run create -- python .generated/example
npm run feature:new -- user-registration
npm test
```

Feature specs live under `.spec/features/<feature>/` as `spec.md`, `design.md`, `tasks.md` and `evidence.md`.

The workflow is inspired by onp-spec-driven concepts: keep specifications aligned with implementation, record assumptions explicitly, trace requirements through tasks/evidence, plan independent work intentionally, and use automated checks as the completion gate.

The v0.1 stack templates are intentionally minimal so framework-specific profiles can be added without coupling them to the core workflow.
