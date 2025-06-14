import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.ts";
import { organizationsTable } from "./organizations.table.ts";
import { locationsTable } from "./locations.table.ts";

export const clientsTable = pgTable("clients", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  orgId: integer()
    .notNull()
    .references(() => organizationsTable.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Client = typeof clientsTable.$inferSelect;

export const clientsRelations = relations(clientsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [clientsTable.orgId],
    references: [organizationsTable.id],
  }),
  locations: many(locationsTable),
}));
