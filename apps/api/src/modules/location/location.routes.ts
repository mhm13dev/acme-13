import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import { auth } from "../../middlewares/auth.middleware.ts";
import type { HonoAppEnv } from "../../app.ts";
import { paginationSchema } from "../../common/common.schema.ts";
import { locationsBaseParamsSchema, createLocationSchema } from "./location.schema.ts";
import { createLocation, getClientLocations } from "./location.service.ts";

export const locations = new Hono<HonoAppEnv>()
  .basePath("/organizations/:orgId/clients/:clientId/locations")
  .use(auth)
  /**
   * Create a new Location
   */
  .post("/", zValidator("param", locationsBaseParamsSchema), zValidator("json", createLocationSchema), async (ctx) => {
    const { userId } = ctx.get("tokenPayload");
    const { orgId, clientId } = ctx.req.valid("param");
    const { name } = ctx.req.valid("json");

    const location = await createLocation({
      name,
      clientId,
      orgId,
      userId,
    });

    return ctx.json(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "Location created successfully",
        data: {
          location,
        },
      }),
      201
    );
  })
  /**
   * Get Client's Locations
   */
  .get("/", zValidator("param", locationsBaseParamsSchema), zValidator("query", paginationSchema), async (ctx) => {
    const { userId } = ctx.get("tokenPayload");
    const { orgId, clientId } = ctx.req.valid("param");
    const { limit, offset } = ctx.req.valid("query");

    const locations = await getClientLocations({
      clientId,
      orgId,
      userId,
      limit,
      offset,
    });

    return ctx.json(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "Locations fetched successfully",
        data: {
          locations,
        },
      })
    );
  });
