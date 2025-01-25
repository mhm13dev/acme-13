import { relations } from "drizzle-orm";
import { index, integer, pgTable, unique, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { usersTable } from "./users.table.js";

export const sessionsTable = pgTable(
  "sessions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer()
      .notNull()
      .references(() => usersTable.id, {
        onDelete: "cascade",
      }),
    tokenFamily: varchar({ length: 12 }).notNull(),
    refreshToken: varchar({ length: 255 }).notNull(),
    ...timestamps,
  },
  (table) => [
    // Alternative to `id` stored in `IJwtPayload` as we don't want to expose the `id` to the client
    unique().on(table.tokenFamily),
    // Index for `userId` and `tokenFamily` to quickly find the session
    index().on(table.userId, table.tokenFamily),
  ]
);

export type Session = typeof sessionsTable.$inferSelect;

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));
