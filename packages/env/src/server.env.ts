import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod/v4";
import ms from "ms";
import { appEnv } from "./schema.js";

const parsedEnv = {};

const dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config({
  path: [path.resolve(dirname, "../.server.env"), path.resolve(dirname, "../.shared.env")],
  processEnv: parsedEnv,
});

const envSchema = z.object({
  // CORE
  APP_ENV: appEnv,
  PORT: z.coerce.number().default(5001),
  BASE_DOMAIN: z.string().trim().default("localhost"),
  CORS_ORIGINS: z
    .string()
    .trim()
    .default("http://localhost:3000")
    .transform((val) => val.split(",")),

  // AUTH
  COOKIE_SECRET: z.string().trim(),
  /**
   * Session expiry in milliseconds
   */
  SESSION_EXPIRY: z
    .string()
    .trim()
    .regex(/\d{1,2}[md]/, "Session expiry must be in the format of '1d' or '15m'")
    .default("15m")
    .transform((val) => ms(val as ms.StringValue)),
});

export const env = envSchema.parse(parsedEnv);
