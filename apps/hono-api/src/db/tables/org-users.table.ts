import { relations } from "drizzle-orm";
import { integer, pgTable, unique } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { organizationsTable } from "./organizations.table.js";
import { usersTable } from "./users.table.js";

export const orgUsersTable = pgTable(
  "org_users",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    orgId: integer()
      .notNull()
      .references(() => organizationsTable.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [unique().on(table.userId, table.orgId)]
);

export type OrgUser = typeof orgUsersTable.$inferSelect;

export const orgUsersRelations = relations(orgUsersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [orgUsersTable.userId],
    references: [usersTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [orgUsersTable.orgId],
    references: [organizationsTable.id],
  }),
}));
