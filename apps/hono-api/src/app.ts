import { Hono } from "hono";
import { users } from "./routes/user/user.routes.js";

export const app = new Hono()
  .get("/", async (c) => {
    return c.json({
      response_code: "ok",
      message: "Hello, world!",
      data: {
        name: "hono-api",
        version: "1.0.0",
      },
    });
  })
  .route("/", users);
