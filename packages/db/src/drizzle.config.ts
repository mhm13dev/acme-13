import { defineConfig } from "drizzle-kit";
import { env } from "@repo/env/db";
import { dbConfig } from "./db.config.ts";

/**
 * For Drizzle Kit.
 */
export default defineConfig({
  ...dbConfig,
  out: "./drizzle",
  schema: "./src/tables/*.table.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
