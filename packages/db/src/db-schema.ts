import type { ExtractTablesWithRelations } from "drizzle-orm";
import { usersRelations, usersTable } from "./tables/users.table.js";
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
};
export type DbSchema = typeof DbSchema;

export type DbTablesWithRelations = ExtractTablesWithRelations<DbSchema>;
