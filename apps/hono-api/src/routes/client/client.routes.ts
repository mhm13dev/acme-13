import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { ApiResponse, ApiResponseCode } from "../../utils/api-response.js";
import { paginationSchema } from "../../common/common.schema.js";
import { orgIdParamsSchema } from "../organization/organization.schema.js";
import { createClientSchema } from "./client.schema.js";
import { createClient, getOrganizationClients } from "./client.service.js";

export const clients = new Hono<HonoAppEnv>()
  .basePath("/organizations/:orgId/clients")
  .use(auth("access_token"))
  /**
   * Create a new Client
   */
  .post(
    "/",
    zValidator("param", orgIdParamsSchema),
    zValidator("json", createClientSchema),
    async (ctx) => {
      const { userId } = ctx.get("session");
      const { orgId } = ctx.req.valid("param");
      const { name } = ctx.req.valid("json");

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
  )
  /**
   * Get Organization's Clients
   */
  .get(
    "/",
    zValidator("param", orgIdParamsSchema),
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
