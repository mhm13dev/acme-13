import type { Context } from "hono";
import { createMiddleware } from "hono/factory";
import type { UserWithoutSensitiveFields } from "../db/tables/users.table.js";
import type { Session } from "../db/tables/sessions.table.js";
import { verifyJwt } from "../routes/user/user.service.js";
import type { TokenType } from "../routes/user/user.types.js";
import { ApiResponseCode } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import type { HonoAppEnv } from "../app.js";

interface AuthMiddlewareEnv<T extends TokenType> extends HonoAppEnv {
  Variables: HonoAppEnv["Variables"] & {
    user: UserWithoutSensitiveFields;
    session: Pick<Session, "tokenFamily"> &
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
      const { user, jwtPayload } = await verifyJwt(tokenType, token);

      // Set `user` in the context
      ctx.set("user", user);

      // Set `session` in the context
      const baseSession = {
        tokenFamily: jwtPayload.token_family,
      } satisfies Pick<Session, "tokenFamily">;

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
