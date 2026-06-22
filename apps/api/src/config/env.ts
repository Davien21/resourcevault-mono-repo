import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { config as loadEnv } from "dotenv";
import { parseServerEnv, type ServerEnv } from "@resourcevault/config/env";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_ROOT = resolve(__dirname, "../..");
const REPO_ROOT = resolve(API_ROOT, "../..");

// Load .env from the API folder first, then fall back to repo root.
loadEnv({ path: resolve(API_ROOT, ".env") });
loadEnv({ path: resolve(REPO_ROOT, ".env") });

export const env: ServerEnv = parseServerEnv();
export const STORAGE_DIR = resolve(API_ROOT, "storage");
