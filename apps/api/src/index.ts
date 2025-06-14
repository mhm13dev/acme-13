import { env } from "./config/env.ts";
import { app } from "./app.ts";

const port = env.PORT;
console.log(`Server is running on http://127.0.0.1:${port}`);

export default {
  port,
  fetch: app.fetch,
};
