import { createApp } from "../src/app.ts";
import { env } from "../src/config/env.ts";
import { openDBConnection } from "../src/config/db.ts";
import { logger } from "../src/config/logger.ts";
import { disconnectFromDatabase } from "@resourcevault/db";

async function bootstrap() {
  await openDBConnection();
  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(
      `ResourceVault API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`
    );
  });

  const shutdown = (signal: NodeJS.Signals) => {
    logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectFromDatabase();
      process.exit(0);
    });
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((err) => {
  logger.error("Failed to start API", err);
  process.exit(1);
});
