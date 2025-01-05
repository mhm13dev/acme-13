import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app.js";

const port = 5001;
console.log(`Server is running on http://127.0.0.1:${port}`);

serve({
  fetch: app.fetch,
  port,
});
