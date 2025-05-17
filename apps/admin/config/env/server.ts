import "server-only";
import { envClientSchema } from "./client";

const envServerSchema = envClientSchema.extend({});

export const envServer = envServerSchema.parse(process.env);
