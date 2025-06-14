import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const projectRoot = path.resolve(process.cwd(), "../../.env");

dotenv.config({
  path: projectRoot,
});

const envSchema = z.object({
  // CORE
  APP_ENV: z.enum(["development", "staging", "production"]).default("production"),

  // DATABASE
  DATABASE_URL: z.string().trim(),
});

export const env = envSchema.parse(Bun.env);
