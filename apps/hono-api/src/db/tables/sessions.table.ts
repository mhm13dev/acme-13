import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { usersTable } from "./users.table.js";

export const sessionsTable = pgTable("sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),
  tokenFamily: varchar({ length: 12 }).notNull(),
  refreshToken: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export type Session = typeof sessionsTable.$inferSelect;

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
