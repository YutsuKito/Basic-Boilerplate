import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const aliases = new Map([
  ["javascript", "javascript"], ["js", "javascript"], ["node", "javascript"],
  ["java", "java"],
  ["rust", "rust"], ["rs", "rust"],
  ["python", "python"], ["py", "python"],
  ["csharp", "csharp"], ["c#", "csharp"], ["cs", "csharp"],
  ["cpp", "cpp"], ["c++", "cpp"],
  ["go", "go"], ["golang", "go"]
]);
const stacks = [...new Set(aliases.values())].sort();

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function titleFromSlug(slug) {
  return slug.split(/[-_]+/).filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
}

function render(content, slug) {
  return content
    .replaceAll("{{FEATURE_SLUG}}", slug)
    .replaceAll("{{FEATURE_NAME}}", titleFromSlug(slug))
    .replaceAll("{{DATE}}", new Date().toISOString().slice(0, 10));
}

function writeManifest(manifestPath, destination) {
  const manifest = loadJson(manifestPath);
  for (const [relativePath, content] of Object.entries(manifest.files)) {
    const target = path.join(destination, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

function createProject(stackInput, destinationInput) {
  const stack = aliases.get(String(stackInput ?? "").toLowerCase());
  if (!stack) throw new Error(`Unknown stack "${stackInput}".`);
  if (!destinationInput) throw new Error("Destination is required.");

  const destination = path.resolve(root, destinationInput);
  if (fs.existsSync(destination) && fs.readdirSync(destination).length > 0) {
    throw new Error(`Destination is not empty: ${destination}`);
  }
  fs.mkdirSync(destination, { recursive: true });

  const registry = loadJson(path.join(root, "templates", "registry.json"));
  const manifestName = registry[stack];
  if (!manifestName) throw new Error(`No template is registered for ${stack}.`);
  writeManifest(path.join(root, "templates", manifestName), destination);

  fs.mkdirSync(path.join(destination, ".spec"), { recursive: true });
  fs.copyFileSync(path.join(root, ".spec", "config.json"), path.join(destination, ".spec", "config.json"));
  fs.copyFileSync(path.join(root, ".spec", "principles.md"), path.join(destination, ".spec", "principles.md"));
  fs.copyFileSync(path.join(root, ".spec", "templates.json"), path.join(destination, ".spec", "templates.json"));
  fs.copyFileSync(path.join(root, "AGENTS.md"), path.join(destination, "AGENTS.md"));

  console.log(`Created ${stack} project at ${destination}`);
  console.log("Next: create a feature spec before non-trivial implementation.");
}

function createFeature(slug, base = root) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Feature slug must use lowercase kebab-case.");
  }

  const templates = loadJson(path.join(base, ".spec", "templates.json"));
  const destination = path.join(base, ".spec", "features", slug);
  if (fs.existsSync(destination)) throw new Error(`Feature already exists: ${destination}`);

  fs.mkdirSync(destination, { recursive: true });
  for (const [filename, content] of Object.entries(templates)) {
    fs.writeFileSync(path.join(destination, filename), render(content, slug));
  }
  console.log(`Created feature spec: ${path.relative(base, destination)}`);
}

const [command, ...args] = process.argv.slice(2);

try {
  switch (command) {
    case "list": console.log(stacks.join("\n")); break;
    case "create": createProject(args[0], args[1]); break;
    case "feature":
      if (!args[0]) throw new Error("Feature slug is required.");
      createFeature(args[0]);
      break;
    case "audit": {
      const result = spawnSync(process.execPath, [path.join(root, "tools", "spec-audit.mjs")], { stdio: "inherit" });
      process.exitCode = result.status ?? 1;
      break;
    }
    default:
      console.log("Usage: list | create <stack> <destination> | feature <slug> | audit");
      if (command) process.exitCode = 1;
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
