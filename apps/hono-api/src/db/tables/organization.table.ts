import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { usersTable } from "./users.table.js";
import { orgUsersTable } from "./org-users.table.js";

export const organizationsTable = pgTable("organizations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  slug: varchar({ length: 255 }).notNull().unique(),
  name: varchar({ length: 255 }).notNull(),
  owner_id: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Organization = typeof organizationsTable.$inferSelect;

export const organizationsRelations = relations(
  organizationsTable,
  ({ one, many }) => ({
    owner: one(usersTable, {
      fields: [organizationsTable.owner_id],
      references: [usersTable.id],
    }),
    orgUsers: many(orgUsersTable),
  })
);
