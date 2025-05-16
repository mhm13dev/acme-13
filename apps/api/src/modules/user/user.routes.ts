import { Hono } from "hono";
import { setCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { authFormDataSchema } from "@repo/shared-lib/zod-schemas";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import type { LoginUserResponse, MeResponse, SignupUserResponse } from "@repo/shared-lib/api-response/users";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { env } from "../../config/env.js";
import { loginUser, signupUser } from "./user.service.js";

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

    const { user, accessToken } = await loginUser({
      email,
      password,
    });

    // Set access token in cookie
    setCookie(ctx, "accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      domain: env.BASE_DOMAIN,
      secure: true,
      sameSite: "Lax",
      maxAge: env.ACCESS_TOKEN_EXPIRY,
    });

    return ctx.json<LoginUserResponse>(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "User logged in successfully",
        data: {
          user,
        },
      }),
      200
    );
  })
  /**
   * Get Current User
   * @returns `MeResponse`
   */
  .get("/me", auth, async (ctx) => {
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
