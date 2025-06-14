import type { ExtractTablesWithRelations } from "drizzle-orm";
import { usersRelations, usersTable } from "./tables/users.table.ts";
import { organizationsRelations, organizationsTable } from "./tables/organizations.table.ts";
import { orgMembersRelations, orgMembersTable } from "./tables/org-members.table.ts";
import { clientsRelations, clientsTable } from "./tables/clients.table.ts";
import { locationsRelations, locationsTable } from "./tables/locations.table.ts";
import { sessionsRelations, sessionsTable } from "./tables/sessions.table.ts";

export const DbSchema = {
  usersTable,
  usersRelations,
  organizationsTable,
  organizationsRelations,
  orgMembersTable,
  orgMembersRelations,
  clientsTable,
  clientsRelations,
  locationsTable,
  locationsRelations,
  sessionsTable,
  sessionsRelations,
};
export type DbSchema = typeof DbSchema;

export type DbTablesWithRelations = ExtractTablesWithRelations<DbSchema>;
