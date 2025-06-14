import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.ts";
import { usersTable } from "./users.table.ts";
import { orgMembersTable } from "./org-members.table.ts";
import { clientsTable } from "./clients.table.ts";

export const organizationsTable = pgTable("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  ownerId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Organization = typeof organizationsTable.$inferSelect;

export const organizationsRelations = relations(organizationsTable, ({ one, many }) => ({
  owner: one(usersTable, {
    fields: [organizationsTable.ownerId],
    references: [usersTable.id],
  }),
  orgMembers: many(orgMembersTable),
  clients: many(clientsTable),
}));
