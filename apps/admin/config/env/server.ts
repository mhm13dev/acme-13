import "server-only";
import { z } from "zod";
import { envClientSchema } from "./client";

const envServerSchema = envClientSchema.extend({
  // AUTH
  JWT_ALGORITHM: z.enum(["RS256"]).default("RS256"),
  ACCESS_TOKEN_PUBLIC_KEY_PEM: z.string().trim(),
});

export const envServer = envServerSchema.parse(process.env);
