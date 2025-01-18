import { drizzle } from "drizzle-orm/node-postgres";
import type { ExtractTablesWithRelations } from "drizzle-orm";
import { env } from "../config/env.js";
import { usersRelations, usersTable } from "./tables/users.table.js";
import { sessionsRelations, sessionsTable } from "./tables/sessions.table.js";
import {
  organizationsRelations,
  organizationsTable,
} from "./tables/organizations.table.js";
import {
  orgMembersRelations,
  orgMembersTable,
} from "./tables/org-members.table.js";
import { clientsRelations, clientsTable } from "./tables/clients.table.js";
import {
  locationsRelations,
  locationsTable,
} from "./tables/locations.table.js";
import { dbConfig } from "./db.config.js";

const dbSchema = {
  usersTable,
  usersRelations,
  sessionsTable,
  sessionsRelations,
  organizationsTable,
  organizationsRelations,
  orgMembersTable,
  orgMembersRelations,
  clientsTable,
  clientsRelations,
  locationsTable,
  locationsRelations,
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
