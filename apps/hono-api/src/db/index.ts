import { drizzle } from "drizzle-orm/node-postgres";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { env } from "../config/env.js";
import { usersRelations, usersTable } from "./tables/users.table.js";
import { sessionsRelations, sessionsTable } from "./tables/sessions.table.js";
import {
  organizationsRelations,
  organizationsTable,
} from "./tables/organizations.table.js";
import { orgUsersRelations, orgUsersTable } from "./tables/org-users.table.js";
import { dbConfig } from "./db.config.js";

const dbSchema = {
  usersTable,
  usersRelations,
  sessionsTable,
  sessionsRelations,
  organizationsTable,
  organizationsRelations,
  orgUsersTable,
  orgUsersRelations,
};

export type DbSchema = typeof dbSchema;
export type DbTablesWithRelations = ExtractTablesWithRelations<DbSchema>;

/**
 * Database instance.
 */
export const db = drizzle({
  ...dbConfig,
  schema: dbSchema,
  connection: env.DATABASE_URL,
});
