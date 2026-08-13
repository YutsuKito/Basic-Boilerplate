import { spawnSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const [command, ...args] = process.argv.slice(2);
const target = command === "feature" ? "spec-feature.mjs" : "project-generator.mjs";
const forwarded = command === "feature" ? args : [command, ...args].filter(Boolean);

const result = spawnSync(process.execPath, [path.join(root, "tools", target), ...forwarded], {
  stdio: "inherit",
});

process.exitCode = result.status ?? 1;
