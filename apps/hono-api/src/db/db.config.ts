import "dotenv/config";
import type { DrizzleConfig } from "drizzle-orm";

/**
 * Database configuration.
 * - Shared for drizzle-orm and drizzle-kit.
 */
export const dbConfig = {
  casing: "snake_case",
  logger: true,
} satisfies DrizzleConfig;
