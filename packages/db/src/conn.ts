import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@repo/env/db";
import { dbConfig } from "./db.config.js";
import { DbSchema } from "./index.js";

/**
 * Database instance.
 */
export const db = drizzle({
  ...dbConfig,
  schema: DbSchema,
  connection: env.DATABASE_URL,
});
