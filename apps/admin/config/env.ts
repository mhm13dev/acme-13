import { z } from "zod";

const envSchema = z.object({
  // CORE
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("production"),

  // API
  NEXT_PUBLIC_API_URL: z.string().trim().default("http://localhost:5001"),

  // AUTH
  JWT_ALGORITHM: z.enum(["RS256"]).default("RS256"),
  REFRESH_TOKEN_PUBLIC_KEY_PEM: z.string().trim(),
});

export const env = envSchema.parse(process.env);
