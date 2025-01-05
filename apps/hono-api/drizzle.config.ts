import { defineConfig } from "drizzle-kit";
import { dbConfig } from "./src/db/db.config.js";
import { env } from "./src/config/env.js";

export default defineConfig({
  ...dbConfig,
  out: "./drizzle",
  schema: "./src/db/tables/*.table.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
