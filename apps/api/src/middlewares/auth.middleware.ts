import { createMiddleware } from "hono/factory";
import { getSignedCookie } from "hono/cookie";
import { env } from "@repo/env/server";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import { SESSION_TOKEN_COOKIE, type TokenPayload } from "@repo/shared-lib/api-response/users";
import type { UserWithoutSensitiveFields } from "@repo/db";
import { verifySession } from "../modules/user/user.service.ts";
import { ApiError } from "../utils/api-error.ts";
import type { HonoAppEnv } from "../app.ts";

interface AuthMiddlewareEnv extends HonoAppEnv {
  Variables: HonoAppEnv["Variables"] & {
    /**
     * Current User.
     * - `User` is retrieved from the database on demand by calling `.load()` method
     */
    user: { load: () => Promise<UserWithoutSensitiveFields> };
    tokenPayload: TokenPayload;
  };
}

/**
 * Middleware to verify the session token
 * - Sets `user` in the context
 * - Sets `tokenPayload` in the context
 */
export const auth = createMiddleware<AuthMiddlewareEnv>(async (ctx, next) => {
  try {
    const sessionToken = await getSignedCookie(ctx, env.COOKIE_SECRET, SESSION_TOKEN_COOKIE);

    if (!sessionToken) {
      throw new ApiError(ApiResponseCode.unauthorized, "Unauthorized", 401);
    }

    // Verify the session token
    const { loadUser, tokenPayload } = await verifySession(sessionToken);

    // Set `user` loader function in the context
    ctx.set("user", { load: loadUser });
    // Set `tokenPayload` in the context
    ctx.set("tokenPayload", tokenPayload);

    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(ApiResponseCode.unauthorized, "Unauthorized", 401);
  }
});
