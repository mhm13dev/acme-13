import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.ts";
import { clientsTable } from "./clients.table.ts";

export const locationsTable = pgTable("locations", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  clientId: integer()
    .notNull()
    .references(() => clientsTable.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Location = typeof locationsTable.$inferSelect;

export const locationsRelations = relations(locationsTable, ({ one }) => ({
  client: one(clientsTable, {
    fields: [locationsTable.clientId],
    references: [clientsTable.id],
  }),
}));
