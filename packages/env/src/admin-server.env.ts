import "server-only";
import { envClientSchema } from "./admin-client.env.js";

const envServerSchema = envClientSchema.extend({});

export const envServer = envServerSchema.parse(process.env);
