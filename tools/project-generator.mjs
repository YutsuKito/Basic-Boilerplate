import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const templatesRoot = path.join(root, "templates");
const readJson = (name) => JSON.parse(fs.readFileSync(path.join(templatesRoot, name), "utf8"));
const registry = readJson("registry.json");
const profiles = readJson("profiles-v3.json");
const stacks = Object.keys(registry.stacks).sort();
const aliases = new Map();

for (const [stack, config] of Object.entries(registry.stacks)) {
  for (const alias of config.aliases) aliases.set(alias.toLowerCase(), stack);
}

const applyVars = (text, vars) => text
  .replaceAll("{{PROJECT_NAME}}", vars.projectName)
  .replaceAll("{{STACK}}", vars.stack)
  .replaceAll("{{PROFILE}}", vars.profile);

function write(target, text, vars) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, applyVars(text, vars));
}

function applyManifest(name, destination, vars) {
  const manifest = readJson(name);
  for (const [relative, value] of Object.entries(manifest.files)) {
    write(path.join(destination, relative), typeof value === "string" ? value : value.content, vars);
  }
}

function applyCopy(source, target, destination, vars) {
  const sourcePath = path.join(templatesRoot, source);
  if (!fs.existsSync(sourcePath)) throw new Error(`Missing template: ${source}`);
  write(path.join(destination, target), fs.readFileSync(sourcePath, "utf8"), vars);
}

function create(args) {
  const [stackInput, destinationInput, ...options] = args;
  const stack = aliases.get(String(stackInput ?? "").toLowerCase());
  if (!stack) throw new Error(`Unknown stack: ${stackInput}`);
  if (!destinationInput) throw new Error("Destination is required.");

  let profile = "basic";
  for (let i = 0; i < options.length; i += 1) {
    if (options[i] === "--profile") profile = options[i + 1] ?? "";
    if (options[i]?.startsWith("--profile=")) profile = options[i].slice(10);
  }

  const profileConfig = profiles[profile];
  if (!profileConfig) throw new Error(`Unknown profile: ${profile}`);
  if (!profileConfig.stacks.includes("*") && !profileConfig.stacks.includes(stack)) {
    throw new Error(`Profile ${profile} is not supported by ${stack}.`);
  }

  const destination = path.resolve(root, destinationInput);
  if (fs.existsSync(destination) && fs.readdirSync(destination).length) throw new Error("Destination is not empty.");
  fs.mkdirSync(destination, { recursive: true });

  const vars = { projectName: path.basename(destination).toLowerCase(), stack, profile };
  applyManifest(registry.stacks[stack].manifest, destination, vars);
  for (const manifest of profileConfig.manifests) applyManifest(manifest, destination, vars);
  for (const [source, target] of profileConfig.copies) applyCopy(source, target, destination, vars);

  fs.mkdirSync(path.join(destination, ".spec"), { recursive: true });
  for (const file of ["config.json", "principles.md", "templates.json"]) {
    fs.copyFileSync(path.join(root, ".spec", file), path.join(destination, ".spec", file));
  }
  fs.copyFileSync(path.join(root, "AGENTS.md"), path.join(destination, "AGENTS.md"));
  console.log(`Created ${stack}/${profile}: ${destination}`);
}

const [command, ...args] = process.argv.slice(2);
try {
  if (command === "stacks" || command === "list") console.log(stacks.join("\n"));
  else if (command === "profiles") console.log(Object.keys(profiles).join("\n"));
  else if (command === "create") create(args);
  else if (command === "audit") {
    const result = spawnSync(process.execPath, [path.join(root, "tools", "spec-audit.mjs")], { stdio: "inherit" });
    process.exitCode = result.status ?? 1;
  } else {
    console.log("Usage: stacks | profiles | create <stack> <destination> [--profile <name>] | audit");
    if (command) process.exitCode = 1;
  }
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
