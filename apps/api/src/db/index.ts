import { drizzle } from "drizzle-orm/node-postgres";
import { DbSchema } from "@repo/db";
import { env } from "../config/env.js";
import { dbConfig } from "./db.config.js";

/**
 * Database instance.
 */
export const db = drizzle({
  ...dbConfig,
  schema: DbSchema,
  connection: env.DATABASE_URL,
});
