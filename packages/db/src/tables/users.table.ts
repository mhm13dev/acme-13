import { relations } from "drizzle-orm";
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "../helpers/columns.helpers.js";
import { organizationsTable } from "./organizations.table.js";
import { orgMembersTable } from "./org-members.table.js";
import { sessionsTable } from "./sessions.table.js";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  ...timestamps,
});

export type User = typeof usersTable.$inferSelect;

export type UserWithoutSensitiveFields<T = User> = Omit<T, "password">;

export const usersRelations = relations(usersTable, ({ many }) => ({
  organizations: many(organizationsTable),
  orgMembers: many(orgMembersTable),
  sessions: many(sessionsTable),
}));
