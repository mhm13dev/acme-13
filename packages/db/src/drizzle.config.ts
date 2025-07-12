import { defineConfig } from "drizzle-kit";
import { env } from "../../env/dist/db.env.js";
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
