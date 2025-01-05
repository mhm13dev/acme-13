import { Hono } from "hono";
import { users } from "./routes/user/user.routes.js";
import { AppError } from "./utils/app-error.js";
import { ApiResponse, ApiResponseCode } from "./utils/api-response.js";

export const app = new Hono()
  .get("/", async (c) => {
    return c.json(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "Hello, world!",
        data: {
          name: "hono-api",
          version: "1.0.0",
        },
      })
    );
  })
  .route("/", users)
  .notFound((c) => {
    return c.json(
      new ApiResponse({
        response_code: ApiResponseCode.path_not_found,
        message: "Path not found",
        data: {
          method: c.req.method,
          path: c.req.path,
        },
      }),
      404
    );
  })
  .onError((error, c) => {
    console.error(error);
    if (error instanceof AppError) {
      return c.json(
        new ApiResponse({
          response_code: error.response_code,
          message: error.message,
        }),
        error.statusCode
      );
    }
    return c.json(
      new ApiResponse({
        response_code: ApiResponseCode.internal_server_error,
        message: error.message ?? "Internal server error",
      }),
      500
    );
  });
