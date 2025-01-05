import { createMiddleware } from "hono/factory";
import type { UserWithoutSensitiveFields } from "../db/tables/users.table.js";
import { verifyJwt } from "../routes/user/user.service.js";
import { ApiResponse, ApiResponseCode } from "../utils/api-response.js";
import type { HonoAppEnv } from "../app.js";

interface AuthMiddlewareEnv extends HonoAppEnv {
  Variables: HonoAppEnv["Variables"] & {
    user: UserWithoutSensitiveFields;
  };
}

/**
 * Middleware to verify the access token and set the user in the context
 */
export const auth = (tokenType: "access_token" | "refresh_token") =>
  createMiddleware<AuthMiddlewareEnv>(async (ctx, next) => {
    const token = ctx.req.header("Authorization")?.split("Bearer ")[1]?.trim();

    if (!token) {
      return ctx.json(
        new ApiResponse({
          response_code:
            tokenType === "access_token"
              ? ApiResponseCode.access_token_required
              : ApiResponseCode.refresh_token_required,
          message: `${
            tokenType === "access_token" ? "Access" : "Refresh"
          } token is required`,
        }),
        401
      );
    }

    // Verify the access token
    const user = await verifyJwt(tokenType, token);

    // Set the user in the context
    ctx.set("user", user);

    return next();
  });
