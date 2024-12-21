import { Hono } from "hono";
import { users } from "./routes/user/user.routes.js";
import { AppError } from "./utils/app-error.js";

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
    if (error instanceof AppError) {
      return c.json(
        {
          response_code: error.response_code,
          message: error.message,
        },
        error.statusCode
      );
    }
    return c.json(
      {
        response_code: "internal_server_error",
        message: error.message ?? "Internal server error",
      },
      500
    );
  });
