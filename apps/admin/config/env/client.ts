import { z } from "zod";

export const envClientSchema = z.object({
  // CORE
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]).default("production"),

  // API
  NEXT_PUBLIC_API_URL: z.string().trim().default("http://localhost:5001"),
});

export const envClient = envClientSchema.parse(process.env);
