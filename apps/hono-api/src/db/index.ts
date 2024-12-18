import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./tables/users.table.js";
import { dbConfig } from "./db.config.js";

/**
 * Database instance.
 */
export const db = drizzle({
  ...dbConfig,
  schema: {
    usersTable,
  },
  connection: process.env.DATABASE_URL!,
});
