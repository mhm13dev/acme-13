import { Hono } from "hono";
import { setSignedCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { authFormDataSchema } from "@repo/shared-lib/zod-schemas";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import {
  SESSION_TOKEN_COOKIE,
  type LoginUserResponse,
  type MeResponse,
  type SignupUserResponse,
} from "@repo/shared-lib/api-response/users";
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

    const { user, sessionId } = await loginUser({
      email,
      password,
    });

    // Set session token in cookie
    await setSignedCookie(ctx, SESSION_TOKEN_COOKIE, sessionId, env.COOKIE_SECRET, {
      path: "/",
      httpOnly: true,
      domain: env.BASE_DOMAIN,
      secure: true,
      sameSite: "Lax",
      maxAge: Math.floor(env.SESSION_EXPIRY / 1000),
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
          tokenPayload: ctx.get("tokenPayload"),
        },
      }),
      200
    );
  });
