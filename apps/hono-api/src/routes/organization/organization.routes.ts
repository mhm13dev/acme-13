import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { ApiResponse, ApiResponseCode } from "../../utils/api-response.js";
import { paginationSchema } from "../../common/common.schema.js";
import { getOrganizationClients } from "../client/client.service.js";
import {
  createOrganizationSchema,
  getOrganizationClientsParamsSchema,
} from "./organization.schema.js";
import {
  createOrganization,
  getOrganizationsForMember,
} from "./organization.service.js";

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
      const { name, slug } = ctx.req.valid("json");
      const { userId } = ctx.get("session");

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
    }
  )
  /**
   * Get Organizations in which the Current User is a member
   */
  .get("/", auth("access_token"), async (ctx) => {
    const { userId } = ctx.get("session");

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
  })
  /**
   * Get Organization's Clients
   */
  .get(
    "/:orgId/clients",
    auth("access_token"),
    zValidator("param", getOrganizationClientsParamsSchema),
    zValidator("query", paginationSchema),
    async (ctx) => {
      const { userId } = ctx.get("session");
      const { orgId } = ctx.req.valid("param");
      const { limit, offset } = ctx.req.valid("query");

      const clients = await getOrganizationClients({
        orgId,
        userId,
        limit,
        offset,
      });

      return ctx.json(
        new ApiResponse({
          response_code: ApiResponseCode.ok,
          message: "Clients fetched successfully",
          data: {
            clients,
          },
        })
      );
    }
  );
