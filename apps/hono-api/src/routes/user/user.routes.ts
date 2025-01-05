import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { auth } from "../../middlewares/auth.middleware.js";
import type { HonoAppEnv } from "../../app.js";
import { ApiResponse, ApiResponseCode } from "../../utils/api-response.js";
import { loginUserSchema, signupUserSchema } from "./user.schema.js";
import { loginUser, signupUser } from "./user.service.js";

export const users = new Hono<HonoAppEnv>()
  .basePath("/users")
  /**
   * Signup a new user
   */
  .post("/signup", zValidator("json", signupUserSchema), async (ctx) => {
    const { email, password } = ctx.req.valid("json");

    const user = await signupUser({ email, password });

    return ctx.json(
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
   */
  .post("/login", zValidator("json", loginUserSchema), async (ctx) => {
    const { email, password } = ctx.req.valid("json");

    const { user, accessToken, refreshToken } = await loginUser({
      email,
      password,
    });

    return ctx.json(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "User logged in successfully",
        data: {
          user,
          accessToken,
          refreshToken,
        },
      })
    );
  })
  /**
   * Get Current User
   */
  .get("/me", auth("access_token"), async (ctx) => {
    return ctx.json(
      new ApiResponse({
        response_code: ApiResponseCode.ok,
        message: "Current user",
        data: {
          user: ctx.get("user"),
        },
      })
    );
  });
