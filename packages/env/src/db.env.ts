import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod/v4";
import { appEnv, databaseUrl } from "./schema.js";

const parsedEnv = {};

const dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config({
  path: [path.resolve(dirname, "../.db.env"), path.resolve(dirname, "../.shared.env")],
  processEnv: parsedEnv,
});

const envSchema = z.object({
  // CORE
  APP_ENV: appEnv,

  // DATABASE
  DATABASE_URL: databaseUrl,
});

export const env = envSchema.parse(parsedEnv);
