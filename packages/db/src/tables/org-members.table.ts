import { relations } from "drizzle-orm";
import { integer, pgTable, unique } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.ts";
import { organizationsTable } from "./organizations.table.ts";
import { usersTable } from "./users.table.ts";

export const orgMembersTable = pgTable(
  "org_members",
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

export type OrgMember = typeof orgMembersTable.$inferSelect;

export const orgMembersRelations = relations(orgMembersTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [orgMembersTable.userId],
    references: [usersTable.id],
  }),
  organization: one(organizationsTable, {
    fields: [orgMembersTable.orgId],
    references: [organizationsTable.id],
  }),
}));
