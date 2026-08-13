import { loadConfig } from "@boilerplate/config";
import { buildServer } from "./server.js";

const config = loadConfig();
const app = buildServer();

await app.listen({ port: config.PORT });
