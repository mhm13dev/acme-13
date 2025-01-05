import { serve } from "@hono/node-server";
import { env } from "./config/env.js";
import { app } from "./app.js";

const port = env.PORT;
console.log(`Server is running on http://127.0.0.1:${port}`);

serve({
  fetch: app.fetch,
  port,
});
