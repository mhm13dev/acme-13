import { relations } from "drizzle-orm";
import { integer, pgTable } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { organizationsTable } from "./organization.table.js";
import { usersTable } from "./users.table.js";

export const orgUsersTable = pgTable("org_users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  user_id: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  org_id: integer()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type OrgUser = typeof orgUsersTable.$inferSelect;

export const orgUsersRelations = relations(orgUsersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [orgUsersTable.user_id],
    references: [usersTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [orgUsersTable.org_id],
    references: [organizationsTable.id],
  }),
}));
