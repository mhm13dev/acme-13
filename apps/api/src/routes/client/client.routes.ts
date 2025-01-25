import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { paginationSchema } from "../../common/common.schema.js";
import {
  clientsBaseParamsSchema,
  createClientSchema,
} from "./client.schema.js";
import { createClient, getOrganizationClients } from "./client.service.js";

export const clients = new Hono<HonoAppEnv>()
  .basePath("/organizations/:orgId/clients")
  .use(auth("access_token"))
  /**
   * Create a new Client
   */
  .post(
    "/",
    zValidator("param", clientsBaseParamsSchema),
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
    zValidator("param", clientsBaseParamsSchema),
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
