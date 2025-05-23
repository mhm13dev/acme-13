import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { createOrganizationSchema } from "./organization.schema.js";
import { createOrganization, getOrganizationsForMember } from "./organization.service.js";

export const organizations = new Hono<HonoAppEnv>()
  .basePath("/organizations")
  .use(auth)
  /**
   * Create a new Organization
   */
  .post("/", zValidator("json", createOrganizationSchema), async (ctx) => {
    const { name, slug } = ctx.req.valid("json");
    const { userId } = ctx.get("tokenPayload");

    const organization = await createOrganization({
      name,
      slug,
      owner: {
        id: userId,
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
  })
  /**
   * Get Organizations in which the Current User is a member
   */
  .get("/", async (ctx) => {
    const { userId } = ctx.get("tokenPayload");

    const organizations = await getOrganizationsForMember({
      userId,
    });

    return ctx.json(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "Organizations fetched successfully",
        data: {
          organizations,
        },
      })
    );
  });
