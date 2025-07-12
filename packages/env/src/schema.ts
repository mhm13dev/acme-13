import { z } from "zod/v4";

export const appEnv = z.enum(["development", "staging", "production"]).default("production");

export const databaseUrl = z.url();
