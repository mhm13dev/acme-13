import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ApiResponse, ApiResponseCode } from "../../utils/api-response.js";
import { signupUserSchema } from "./user.schema.js";
import { signupUser } from "./user.service.js";

export const users = new Hono()
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
  });
