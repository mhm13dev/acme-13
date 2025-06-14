import type { DrizzleConfig } from "drizzle-orm";
import { env } from "./config/env.ts";

/**
 * Database configuration.
 * - Shared for drizzle-orm and drizzle-kit.
 */
export const dbConfig = {
  casing: "snake_case",
  logger: env.APP_ENV === "development",
} satisfies DrizzleConfig;
