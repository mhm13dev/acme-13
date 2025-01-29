import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authFormDataSchema } from "@repo/shared-lib/zod-schemas";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import type {
  LoginUserResponse,
  MeResponse,
  RefreshTokensResponse,
  SignupUserResponse,
} from "@repo/shared-lib/api-response/users";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { loginUser, refreshTokens, signupUser } from "./user.service.js";

export const users = new Hono<HonoAppEnv>()
  .basePath("/users")
  /**
   * Signup a new user
   * @returns `SignupUserResponse`
   */
  .post("/signup", zValidator("json", authFormDataSchema), async (ctx) => {
    const { email, password } = ctx.req.valid("json");

    const user = await signupUser({ email, password });

    return ctx.json<SignupUserResponse>(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "User created successfully",
        data: {
          user,
        },
      }),
      201
    );
  })
  /**
   * Login a user
   * @returns `LoginUserResponse`
   */
  .post("/login", zValidator("json", authFormDataSchema), async (ctx) => {
    const { email, password } = ctx.req.valid("json");

    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });

    return ctx.json<LoginUserResponse>(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "User logged in successfully",
        data: {
          user,
          accessToken,
          refreshToken,
        },
      }),
      200
    );
  })
  /**
   * Refresh tokens
   * @returns `RefreshTokensResponse`
   */
  .post("/refresh-tokens", auth("refresh_token"), async (ctx) => {
    const { accessToken, refreshToken } = await refreshTokens({
      user: await ctx.get("user").load(),
      tokenPayload: ctx.get("tokenPayload"),
    });

    return ctx.json<RefreshTokensResponse>(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "Tokens refreshed successfully",
        data: {
          accessToken,
          refreshToken,
        },
      }),
      200
    );
  })
  /**
   * Get Current User
   * @returns `MeResponse`
   */
  .get("/me", auth("access_token"), async (ctx) => {
    return ctx.json<MeResponse>(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "Current user",
        data: {
          user: await ctx.get("user").load(),
        },
      }),
      200
    );
  });
