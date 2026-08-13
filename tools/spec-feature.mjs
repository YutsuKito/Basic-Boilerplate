import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const slug = process.argv[2];

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Feature slug must use lowercase kebab-case.");
  process.exit(1);
}

const templates = JSON.parse(fs.readFileSync(path.join(root, ".spec", "templates.json"), "utf8"));
const destination = path.join(root, ".spec", "features", slug);
if (fs.existsSync(destination)) {
  console.error(`Feature already exists: ${destination}`);
  process.exit(1);
}

const title = slug.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ");
fs.mkdirSync(destination, { recursive: true });

for (const [filename, content] of Object.entries(templates)) {
  fs.writeFileSync(path.join(destination, filename), content
    .replaceAll("{{FEATURE_SLUG}}", slug)
    .replaceAll("{{FEATURE_NAME}}", title)
    .replaceAll("{{DATE}}", new Date().toISOString().slice(0, 10)));
}

console.log(`Created feature spec: ${path.relative(root, destination)}`);
