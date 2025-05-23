import { defineConfig } from "drizzle-kit";
import { env } from "./config/env.js";
import { dbConfig } from "./db.config.js";

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
