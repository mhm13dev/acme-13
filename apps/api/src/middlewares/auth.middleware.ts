import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import type { UserWithoutSensitiveFields, Session } from "@repo/shared-lib/db";
import { verifyJwt } from "../routes/user/user.service.js";
import type { TokenType } from "../routes/user/user.types.js";
import { ApiError } from "../utils/api-error.js";
import type { HonoAppEnv } from "../app.js";

interface AuthMiddlewareEnv<T extends TokenType> extends HonoAppEnv {
  Variables: HonoAppEnv["Variables"] & {
    /**
     * Current User.
     * - `User` is retrieved from the database on demand by calling `.load()` method
     */
    user: { load: () => Promise<UserWithoutSensitiveFields> };
    session: Pick<Session, "tokenFamily" | "userId"> &
      (T extends "access_token"
        ? {
            accessToken: string;
          }
        : T extends "refresh_token"
        ? {
            refreshToken: string;
          }
        : never);
  };
}

/**
 * Middleware to verify the access / refresh tokens
 * - Sets `user` in the context
 * - Sets `session` related info in the context
 */
export const auth = <T extends TokenType>(tokenType: T) =>
  createMiddleware<AuthMiddlewareEnv<T>>(async (ctx, next) => {
    try {
      const token = ctx.req
        .header("Authorization")
        ?.split("Bearer ")[1]
        ?.trim();

      if (!token) {
        throw new ApiError(
          tokenType === "access_token"
            ? ApiResponseCode.access_token_required
            : ApiResponseCode.refresh_token_required,
          `${
            tokenType === "access_token" ? "Access" : "Refresh"
          } token is required`,
          401
        );
      }

      // Verify the access token
      const { loadUser, jwtPayload } = await verifyJwt(tokenType, token);

      // Set `user` promise in the context
      ctx.set("user", { load: loadUser });

      // Set `session` in the context
      const baseSession = {
        tokenFamily: jwtPayload.token_family,
        userId: Number(jwtPayload.sub),
      } satisfies Pick<Session, "tokenFamily" | "userId">;

      switch (tokenType) {
        case "access_token":
          (ctx as Context<AuthMiddlewareEnv<"access_token">>).set("session", {
            ...baseSession,
            accessToken: token,
          });
          break;

        case "refresh_token":
          (ctx as Context<AuthMiddlewareEnv<"refresh_token">>).set("session", {
            ...baseSession,
            refreshToken: token,
          });
          break;
      }

      return next();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(ApiResponseCode.unauthorized, "Unauthorized", 401);
    }
  });
