import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";
import ms from "ms";

const projectRoot = path.resolve(process.cwd(), "../../.env");

dotenv.config({
  path: projectRoot,
});

const envSchema = z.object({
  // CORE
  APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("production"),
  PORT: z.coerce.number().default(5001),

  // AUTH
  JWT_ALGORITHM: z.enum(["RS256"]).default("RS256"),
  ACCESS_TOKEN_PRIVATE_KEY_PEM: z.string().trim(),
  ACCESS_TOKEN_PUBLIC_KEY_PEM: z.string().trim(),
  /**
   * Access token expiry in seconds
   */
  ACCESS_TOKEN_EXPIRY: z
    .string()
    .trim()
    .regex(/\d{1,2}[md]/, "JWT expiry must be in the format of '1d' or '15m'")
    .default("15m")
    .transform((val) => ms(val as ms.StringValue) / 1000),
});

export const env = envSchema.parse(process.env);
