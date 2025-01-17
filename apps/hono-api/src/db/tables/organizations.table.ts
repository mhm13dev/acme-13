import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { usersTable } from "./users.table.js";
import { orgMembersTable } from "./org-members.table.js";
import { clientsTable } from "./clients.table.js";

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

export const organizationsRelations = relations(
  organizationsTable,
  ({ one, many }) => ({
    owner: one(usersTable, {
      fields: [organizationsTable.ownerId],
      references: [usersTable.id],
    }),
    orgMembers: many(orgMembersTable),
    clients: many(clientsTable),
  })
);
