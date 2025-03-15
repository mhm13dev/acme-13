import { createMiddleware } from "hono/factory";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import type { IJwtPayload } from "@repo/shared-lib/api-response/users";
import type { UserWithoutSensitiveFields } from "@repo/shared-lib/db";
import { verifyAccessToken } from "../modules/user/user.service.js";
import { ApiError } from "../utils/api-error.js";
import type { HonoAppEnv } from "../app.js";

export type TokenPayload = Pick<IJwtPayload, "email" | "exp"> & {
  userId: number;
  accessToken: string;
};

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
 * Middleware to verify the access token
 * - Sets `user` in the context
 * - Sets `tokenPayload` in the context
 */
export const auth = createMiddleware<AuthMiddlewareEnv>(async (ctx, next) => {
  try {
    const token = ctx.req.header("Authorization")?.split("Bearer ")[1]?.trim();

    if (!token) {
      throw new ApiError(
        ApiResponseCode.access_token_required,
        "Access token is required",
        401
      );
    }

    // Verify the access token
    const { loadUser, jwtPayload } = await verifyAccessToken(token);

    // Set `user` promise in the context
    ctx.set("user", { load: loadUser });

    // Set `tokenPayload` in the context
    const tokenPayload = {
      userId: Number(jwtPayload.sub),
      email: jwtPayload.email,
      exp: jwtPayload.exp,
      accessToken: token,
    } satisfies TokenPayload;

    ctx.set("tokenPayload", tokenPayload);

    return next();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(ApiResponseCode.unauthorized, "Unauthorized", 401);
  }
});
