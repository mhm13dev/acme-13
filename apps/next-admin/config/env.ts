import { z } from "zod";

const envSchema = z.object({
  // CORE
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("production"),

  // API
  NEXT_PUBLIC_API_URL: z.string().trim().default("http://localhost:5001"),
});

export const env = envSchema.parse(process.env);
