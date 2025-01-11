import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { ApiResponse, ApiResponseCode } from "../../utils/api-response.js";
import { createOrganizationSchema } from "./organization.schema.js";
import { createOrganization } from "./organization.service.js";

export const organizations = new Hono<HonoAppEnv>()
  .basePath("/organizations")
  /**
   * Create a new Organization
   */
  .post(
    "/",
    auth("access_token"),
    zValidator("json", createOrganizationSchema),
    async (ctx) => {
      const json = ctx.req.valid("json");
      const session = ctx.get("session");

      const organization = await createOrganization({
        name: json.name,
        slug: json.slug,
        owner: {
          id: session.userId,
        },
      });

      return ctx.json(
        new ApiResponse({
          response_code: ApiResponseCode.ok,
          message: "Organization created successfully",
          data: {
            organization,
          },
        }),
        201
      );
    }
  );
