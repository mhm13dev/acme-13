import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../config/env.js";
import { usersRelations, usersTable } from "./tables/users.table.js";
import { sessionsRelations, sessionsTable } from "./tables/sessions.table.js";
import { dbConfig } from "./db.config.js";

/**
 * Database instance.
 */
export const db = drizzle({
  ...dbConfig,
  schema: {
    usersTable,
    usersRelations,
    sessionsTable,
    sessionsRelations,
  },
  connection: env.DATABASE_URL,
});
