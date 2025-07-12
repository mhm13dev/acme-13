import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Variables, Bindings } from "hono/types";
import { env } from "@repo/env/server";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import { users } from "./modules/user/user.routes.ts";
import { organizations } from "./modules/organization/organization.routes.ts";
import { clients } from "./modules/client/client.routes.ts";
import { locations } from "./modules/location/location.routes.ts";
import { ApiError } from "./utils/api-error.ts";

export interface HonoAppEnv {
  Bindings: Bindings;
  Variables: Variables;
}

export const app = new Hono<HonoAppEnv>()
  .use(
    "*",
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    })
  )
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
  .route("/", organizations)
  .route("/", clients)
  .route("/", locations)
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
    if (error instanceof ApiError) {
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
        message: env.APP_ENV === "production" ? "Internal server error" : (error.message ?? "Internal server error"),
      }),
      500
    );
  });
