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
  .route("/", users)
  .notFound((c) => {
    return c.json(
      {
        response_code: "path_not_found",
        message: "Path not found",
        data: {
          method: c.req.method,
          path: c.req.path,
        },
      },
      404
    );
  })
  .onError((error, c) => {
    console.error(error);
    return c.json(
      {
        response_code: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      },
      500
    );
  });
