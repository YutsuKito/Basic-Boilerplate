# Tasks: Complete Platform Boilerplate

- [ ] TASK-001 | REQ-001,REQ-002 | files: templates/registry.json | depends: none | lane: A | Add TypeScript as a first-class stack and preserve existing stacks.
- [ ] TASK-002 | REQ-003 | files: templates/profiles.json | depends: TASK-001 | lane: A | Add the six supported profiles.
- [ ] TASK-003 | REQ-004,REQ-005,REQ-006 | files: templates/typescript-platform.json | depends: TASK-001 | lane: B | Add the Node.js and TypeScript platform scaffold.
- [ ] TASK-004 | REQ-003,REQ-007 | files: tools/boilerplate.mjs | depends: TASK-002,TASK-003 | lane: C | Make generation profile-aware.
- [ ] TASK-005 | REQ-008 | files: tools/validate.mjs | depends: TASK-002,TASK-003 | lane: D | Validate aliases, profiles and required files.
- [ ] TASK-006 | REQ-009 | files: README.md | depends: TASK-004 | lane: E | Document architecture and CLI.
- [ ] TASK-007 | REQ-008 | files: .spec/features/complete-platform/evidence.md | depends: TASK-004,TASK-005 | lane: F | Record validation evidence.
