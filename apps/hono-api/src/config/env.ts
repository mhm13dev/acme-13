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
});

export const env = envSchema.parse(process.env);
