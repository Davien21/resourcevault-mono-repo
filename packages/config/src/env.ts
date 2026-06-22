import { z } from "zod";

/**
 * Shared environment schema used by the API and seed scripts.
 * Keeps env validation in one place so every service fails fast and loudly
 * when configuration is missing, rather than at some random runtime moment.
 */
export const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(7842),
  MONGODB_URI: z
    .string()
    .min(1, "MONGODB_URI is required")
    .default("mongodb://127.0.0.1:27017/resourcevault"),
  JWT_SECRET: z
    .string()
    .min(8, "JWT_SECRET must be at least 8 characters")
    .default("resourcevault-dev-secret-change-me"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_URL: z.string().default("http://localhost:7843"),
  API_BASE_URL: z.string().default("http://localhost:7842"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  const parsed = serverEnvSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return parsed.data;
}
