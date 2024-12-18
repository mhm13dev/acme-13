import { Hono } from "hono";

export const app = new Hono();

app.get("/", async (c) => {
  return c.json({
    response_code: "ok",
    message: "Hello, world!",
    data: {
      name: "hono-api",
      version: "1.0.0",
    },
  });
});
