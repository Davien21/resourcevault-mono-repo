import { connectToDatabase } from "@resourcevault/db";
import { env } from "./env.ts";
import { logger } from "./logger.ts";

export async function openDBConnection(): Promise<void> {
  try {
    await connectToDatabase(env.MONGODB_URI);
    logger.info("Connected to MongoDB");
  } catch (err) {
    logger.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
}
