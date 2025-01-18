import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // CORE
  APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("production"),
  PORT: z.coerce.number().default(5001),

  // DATABASE
  DATABASE_URL: z.string().trim(),

  // JWT
  ACCESS_TOKEN_SECRET: z.string().trim(),
  REFRESH_TOKEN_SECRET: z.string().trim(),
  ACCESS_TOKEN_EXPIRY: z
    .string()
    .trim()
    .regex(/\d{1,2}[md]/, "JWT expiry must be in the format of '1d' or '15m'")
    .default("15m"),
  REFRESH_TOKEN_EXPIRY: z
    .string()
    .trim()
    .regex(/\d{1,2}[md]/, "JWT expiry must be in the format of '1d' or '15m'")
    .default("7d"),
});

export const env = envSchema.parse(process.env);
