import "server-only";
import { envClientSchema } from "./client.env";

const envServerSchema = envClientSchema.extend({});

export const envServer = envServerSchema.parse(
  // Bun.env does not work with Next.js
  process.env
);
