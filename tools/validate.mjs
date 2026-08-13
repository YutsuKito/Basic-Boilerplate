import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registry = JSON.parse(fs.readFileSync(path.join(root, "templates", "registry.json"), "utf8"));
const expected = ["javascript", "java", "rust", "python", "csharp", "cpp", "go"];
let failed = false;

for (const stack of expected) {
  const file = registry[stack];
  const manifestPath = file ? path.join(root, "templates", file) : "";
  if (!file || !fs.existsSync(manifestPath)) {
    console.error(`missing template: ${stack}`);
    failed = true;
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  if (manifest.stack !== stack || !manifest.files || !Object.keys(manifest.files).length) {
    console.error(`invalid template: ${stack}`);
    failed = true;
  } else {
    console.log(`✓ ${stack}`);
  }
}

const templates = JSON.parse(fs.readFileSync(path.join(root, ".spec", "templates.json"), "utf8"));
for (const required of ["spec.md", "design.md", "tasks.md", "evidence.md"]) {
  if (!templates[required]) { console.error(`missing spec template: ${required}`); failed = true; }
}

if (failed) process.exit(1);
console.log("validation passed");
