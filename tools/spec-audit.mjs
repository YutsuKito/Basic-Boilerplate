import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const configPath = path.join(root, ".spec", "config.json");

function fail(message) {
  console.error(`✗ ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`✓ ${message}`);
}

if (!fs.existsSync(configPath)) {
  fail(".spec/config.json was not found.");
  process.exit();
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const featureRoot = path.join(root, config.featureRoot ?? ".spec/features");
const required = config.requiredFeatureFiles ?? ["spec.md", "design.md", "tasks.md", "evidence.md"];
const completeStatus = String(config.completeStatus ?? "COMPLETE").toUpperCase();

if (!fs.existsSync(featureRoot)) {
  ok("No feature specs to audit yet.");
  process.exit();
}

const featureDirs = fs.readdirSync(featureRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
  .map((entry) => entry.name);

if (featureDirs.length === 0) {
  ok("No feature specs to audit yet.");
  process.exit();
}

for (const feature of featureDirs) {
  const dir = path.join(featureRoot, feature);
  let missing = false;

  for (const file of required) {
    if (!fs.existsSync(path.join(dir, file))) {
      fail(`${feature}: missing ${file}`);
      missing = true;
    }
  }
  if (missing) continue;

  const spec = fs.readFileSync(path.join(dir, "spec.md"), "utf8");
  const design = fs.readFileSync(path.join(dir, "design.md"), "utf8");
  const tasks = fs.readFileSync(path.join(dir, "tasks.md"), "utf8");
  const evidence = fs.readFileSync(path.join(dir, "evidence.md"), "utf8");

  const status = spec.match(/^Status:\s*([A-Z_-]+)/im)?.[1]?.toUpperCase() ?? "DRAFT";
  const requirements = [...new Set(spec.match(/\bREQ-\d{3}\b/g) ?? [])];
  const criteria = [...new Set(spec.match(/\bAC-\d{3}\b/g) ?? [])];
  const taskIds = [...new Set(tasks.match(/\bTASK-\d{3}\b/g) ?? [])];

  if (!requirements.length) fail(`${feature}: spec.md has no REQ-xxx identifiers.`);
  if (!criteria.length) fail(`${feature}: spec.md has no AC-xxx identifiers.`);
  if (!taskIds.length) fail(`${feature}: tasks.md has no TASK-xxx identifiers.`);

  for (const req of requirements) {
    if (!design.includes(req)) fail(`${feature}: ${req} is not mapped in design.md.`);
    if (!tasks.includes(req)) fail(`${feature}: ${req} is not referenced by tasks.md.`);
  }

  if (status === completeStatus) {
    const unresolved = spec.match(/\[(OPEN|TODO|TBD)\]/gi) ?? [];
    if (unresolved.length) {
      fail(`${feature}: COMPLETE feature still contains ${unresolved.length} open marker(s).`);
    }

    for (const criterion of criteria) {
      const lines = evidence.split(/\r?\n/).filter((line) => line.includes(criterion));
      if (!lines.length) {
        fail(`${feature}: ${criterion} has no evidence entry.`);
      } else if (!lines.some((line) => /\bPASS\b/i.test(line))) {
        fail(`${feature}: ${criterion} evidence is not PASS.`);
      }
    }
  }

  console.log(`• ${feature}: audited (${status})`);
}

if (process.exitCode) {
  console.error("\nSpec audit failed.");
} else {
  console.log("\nSpec audit passed.");
}
