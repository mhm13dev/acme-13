import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { ApiResponse, ApiResponseCode } from "../../utils/api-response.js";
import { createClientSchema } from "./client.schema.js";
import { createClient } from "./client.service.js";

export const clients = new Hono<HonoAppEnv>()
  .basePath("/clients")
  /**
   * Create a new Client
   */
  .post(
    "/",
    auth("access_token"),
    zValidator("json", createClientSchema),
    async (ctx) => {
      const { name, orgId } = ctx.req.valid("json");
      const { userId } = ctx.get("session");

      const client = await createClient({
        name,
        orgId,
        userId,
      });

      return ctx.json(
        new ApiResponse({
          response_code: ApiResponseCode.ok,
          message: "Client created successfully",
          data: {
            client,
          },
        }),
        201
      );
    }
  );
