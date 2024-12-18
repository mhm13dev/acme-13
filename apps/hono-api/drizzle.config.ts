import { defineConfig } from "drizzle-kit";
import { dbConfig } from "./src/db/db.config.js";

export default defineConfig({
  ...dbConfig,
  out: "./drizzle",
  schema: "./src/db/tables/*.table.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
