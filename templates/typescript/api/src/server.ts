import Fastify from "fastify";
import { createLogger } from "@boilerplate/observability";
import { safeError } from "@boilerplate/security";

export function buildServer() {
  const log = createLogger("api");
  const app = Fastify({ logger: false });

  app.get("/health", async () => ({ status: "ok", service: "api" }));
  app.get("/ready", async () => ({ status: "ready" }));

  app.setErrorHandler((error, _request, reply) => {
    log.error("request_failed", safeError(error));
    reply.code(500).send({ error: "internal_error" });
  });

  return app;
}
