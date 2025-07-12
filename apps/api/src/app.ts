import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Variables } from "hono/types";
import type { HttpBindings } from "@hono/node-server";
import { env } from "@repo/env/server";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import { users } from "./modules/user/user.routes.js";
import { organizations } from "./modules/organization/organization.routes.js";
import { clients } from "./modules/client/client.routes.js";
import { locations } from "./modules/location/location.routes.js";
import { ApiError } from "./utils/api-error.js";

export interface HonoAppEnv {
  Bindings: HttpBindings;
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
