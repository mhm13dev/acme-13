import path from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

const dirname = path.dirname(new URL(import.meta.url).pathname);

dotenv.config({
  path: [path.resolve(dirname, ".env")],
});

export const envClientSchema = z.object({
  // CORE
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "staging", "production"]).default("production"),

  // API
  NEXT_PUBLIC_API_URL: z.string().trim().default("http://localhost:5001"),

  NEXT_PUBLIC_TEST: z.string().trim().default("test"),
});

export const envClient = envClientSchema.parse(
  // Bun.env does not work with Next.js
  process.env
);
