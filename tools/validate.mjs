import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const templatesRoot = path.join(root, "templates");
const registry = JSON.parse(fs.readFileSync(path.join(templatesRoot, "registry.json"), "utf8"));
const profiles = JSON.parse(fs.readFileSync(path.join(templatesRoot, "profiles-v3.json"), "utf8"));
const expectedStacks = ["javascript", "typescript", "java", "rust", "python", "csharp", "cpp", "go"];
const expectedProfiles = ["basic", "api", "saas", "ai-agent", "worker", "research"];
let failed = false;

for (const stack of expectedStacks) {
  const config = registry.stacks?.[stack];
  const manifestPath = config ? path.join(templatesRoot, config.manifest) : "";
  if (!config || !fs.existsSync(manifestPath)) {
    console.error(`missing template: ${stack}`);
    failed = true;
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (!manifest.files || !Object.keys(manifest.files).length) {
    console.error(`invalid template: ${stack}`);
    failed = true;
  } else console.log(`✓ stack ${stack}`);
}

const aliasOwner = new Map();
for (const [stack, config] of Object.entries(registry.stacks ?? {})) {
  for (const alias of config.aliases ?? []) aliasOwner.set(alias, stack);
}
if (aliasOwner.get("node") !== "typescript" || aliasOwner.get("ts") !== "typescript") {
  console.error("node/ts aliases must resolve to typescript");
  failed = true;
}
if (aliasOwner.get("node-js") !== "javascript") {
  console.error("node-js alias must resolve to javascript");
  failed = true;
}

for (const profile of expectedProfiles) {
  const config = profiles[profile];
  if (!config) {
    console.error(`missing profile: ${profile}`);
    failed = true;
    continue;
  }
  for (const manifest of config.manifests ?? []) {
    if (!fs.existsSync(path.join(templatesRoot, manifest))) {
      console.error(`missing profile manifest: ${profile}/${manifest}`);
      failed = true;
    }
  }
  for (const [source] of config.copies ?? []) {
    if (!fs.existsSync(path.join(templatesRoot, source))) {
      console.error(`missing profile source: ${profile}/${source}`);
      failed = true;
    }
  }
  console.log(`✓ profile ${profile}`);
}

const specTemplates = JSON.parse(fs.readFileSync(path.join(root, ".spec", "templates.json"), "utf8"));
for (const required of ["spec.md", "design.md", "tasks.md", "evidence.md"]) {
  if (!specTemplates[required]) {
    console.error(`missing spec template: ${required}`);
    failed = true;
  }
}

const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "basic-boilerplate-"));
const generated = path.join(sandbox, "saas-smoke");
const run = spawnSync(process.execPath, [path.join(root, "tools", "boilerplate.mjs"), "create", "typescript", generated, "--profile", "saas"], { encoding: "utf8" });
if (run.status !== 0) {
  console.error(run.stderr || run.stdout || "typescript/saas generation failed");
  failed = true;
} else {
  const requiredGenerated = [
    "package.json",
    "apps/api/src/server.ts",
    "apps/web/src/app/page.tsx",
    "apps/worker/src/index.ts",
    "packages/database/prisma/schema.prisma",
    "packages/auth/src/index.ts",
    "packages/ai/src/index.ts",
    "packages/context/src/index.ts",
    "packages/security/src/index.ts",
    "packages/observability/src/index.ts",
    "docker-compose.yml",
    ".spec/principles.md",
    "AGENTS.md"
  ];
  for (const relative of requiredGenerated) {
    if (!fs.existsSync(path.join(generated, relative))) {
      console.error(`generated saas missing: ${relative}`);
      failed = true;
    }
  }
}
fs.rmSync(sandbox, { recursive: true, force: true });

if (failed) process.exit(1);
console.log("validation passed");
