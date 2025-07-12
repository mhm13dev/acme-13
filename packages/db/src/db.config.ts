import type { DrizzleConfig } from "drizzle-orm";
import { env } from "@repo/env/db";

/**
 * Database configuration.
 * - Shared for drizzle-orm and drizzle-kit.
 */
export const dbConfig = {
  casing: "snake_case",
  logger: env.APP_ENV === "development",
} satisfies DrizzleConfig;
