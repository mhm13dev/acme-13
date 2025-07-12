import { z } from "zod";

export const appEnv = z.enum(["development", "staging", "production"]).default("production");

export const databaseUrl = z.string().trim().url();
