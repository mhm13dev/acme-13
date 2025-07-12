import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";
import { appEnv, databaseUrl } from "../schema";

dotenv.config({
  path: [path.resolve(__dirname, ".env"), path.resolve(__dirname, "..", ".env")],
});

const envSchema = z.object({
  // CORE
  APP_ENV: appEnv,

  // DATABASE
  DATABASE_URL: databaseUrl,
});

export const env = envSchema.parse(Bun.env);
