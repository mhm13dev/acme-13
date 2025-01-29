import "dotenv/config";
import { z } from "zod";
import ms from "ms";

const envSchema = z.object({
  // CORE
  APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("production"),
  PORT: z.coerce.number().default(5001),

  // DATABASE
  DATABASE_URL: z.string().trim(),

  // AUTH
  JWT_ALGORITHM: z.enum(["RS256"]).default("RS256"),
  ACCESS_TOKEN_PRIVATE_KEY_PEM: z.string().trim(),
  ACCESS_TOKEN_PUBLIC_KEY_PEM: z.string().trim(),
  REFRESH_TOKEN_PRIVATE_KEY_PEM: z.string().trim(),
  REFRESH_TOKEN_PUBLIC_KEY_PEM: z.string().trim(),
  /**
   * Access token expiry in seconds
   */
  ACCESS_TOKEN_EXPIRY: z
    .string()
    .trim()
    .regex(/\d{1,2}[md]/, "JWT expiry must be in the format of '1d' or '15m'")
    .default("15m")
    .transform((val) => ms(val as ms.StringValue) / 1000),
  /**
   * Refresh token expiry in seconds
   */
  REFRESH_TOKEN_EXPIRY: z
    .string()
    .trim()
    .regex(/\d{1,2}[md]/, "JWT expiry must be in the format of '1d' or '15m'")
    .default("7d")
    .transform((val) => ms(val as ms.StringValue) / 1000),
  /**
   * 32 Bytes Key.
   * Use `crypto.randomBytes(32).toString('base64')` to generate a key
   */
  REFRESH_TOKEN_ENCRYPTION_KEY: z
    .string()
    .trim()
    .length(44)
    .transform((val) => Buffer.from(val, "base64")),
  REFRESH_TOKEN_ENCRYPTION_ALGORITHM: z
    .enum(["aes-256-gcm"])
    .default("aes-256-gcm"),
});

export const env = envSchema.parse(process.env);
