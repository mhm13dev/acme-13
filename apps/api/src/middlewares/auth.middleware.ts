import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import type { UserWithoutSensitiveFields, Session } from "@repo/shared-lib/db";
import { verifyJwt } from "../modules/user/user.service.js";
import type { IJwtPayload, TokenType } from "../modules/user/user.types.js";
import { ApiError } from "../utils/api-error.js";
import type { HonoAppEnv } from "../app.js";

export type TokenPayload<T extends TokenType | unknown = unknown> = Pick<
  Session,
  "tokenFamily" | "userId"
> &
  Pick<IJwtPayload, "email" | "exp"> &
  (T extends "access_token"
    ? {
        accessToken: string;
      }
    : T extends "refresh_token"
    ? {
        refreshToken: string;
      }
    : unknown);

interface AuthMiddlewareEnv<T extends TokenType> extends HonoAppEnv {
  Variables: HonoAppEnv["Variables"] & {
    /**
     * Current User.
     * - `User` is retrieved from the database on demand by calling `.load()` method
     */
    user: { load: () => Promise<UserWithoutSensitiveFields> };
    tokenPayload: TokenPayload<T>;
  };
}

/**
 * Middleware to verify the access / refresh tokens
 * - Sets `user` in the context
 * - Sets `tokenPayload` in the context
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

      // Set `tokenPayload` in the context
      const baseTokenPayload = {
        tokenFamily: jwtPayload.token_family,
        userId: Number(jwtPayload.sub),
        email: jwtPayload.email,
        exp: jwtPayload.exp,
      } satisfies TokenPayload;

      switch (tokenType) {
        case "access_token":
          (ctx as Context<AuthMiddlewareEnv<"access_token">>).set(
            "tokenPayload",
            {
              ...baseTokenPayload,
              accessToken: token,
            } satisfies TokenPayload<"access_token">
          );
          break;

        case "refresh_token":
          (ctx as Context<AuthMiddlewareEnv<"refresh_token">>).set(
            "tokenPayload",
            {
              ...baseTokenPayload,
              refreshToken: token,
            } satisfies TokenPayload<"refresh_token">
          );
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
