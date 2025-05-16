import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authFormDataSchema } from "@repo/shared-lib/zod-schemas";
import { ApiResponse, ApiResponseCode } from "@repo/shared-lib/api-response";
import type { LoginUserResponse, MeResponse, SignupUserResponse } from "@repo/shared-lib/api-response/users";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
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

    return ctx.json<LoginUserResponse>(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "User logged in successfully",
        data: {
          user,
          accessToken,
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
