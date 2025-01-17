import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { organizationsTable } from "./organizations.table.js";

export const clientsTable = pgTable("clients", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  orgId: integer()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Client = typeof clientsTable.$inferSelect;

export const clientsRelations = relations(clientsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [clientsTable.orgId],
    references: [organizationsTable.id],
  }),
}));
