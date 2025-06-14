import { relations } from "drizzle-orm";
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.ts";
import { usersTable } from "./users.table.ts";

export const sessionsTable = pgTable("sessions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  sessionId: varchar({ length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  ...timestamps,
});

export type Session = typeof sessionsTable.$inferSelect;

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
