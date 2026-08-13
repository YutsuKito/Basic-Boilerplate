# Basic Boilerplate

Multi-stack, spec-driven project boilerplate.

TypeScript and Node.js are first-class in v0.2, with profile-based composition.

Available stacks include TypeScript, JavaScript, Java, Rust, Python, C#, C++ and Go. Profiles include `basic`, `api`, `saas`, `ai-agent`, `worker` and `research`.

```bash
npm run stacks
npm run profiles
npm run create -- typescript ./my-project --profile saas
npm run feature:new -- my-feature
npm test
```

See `docs/ARCHITECTURE.md` for the complete platform map.
