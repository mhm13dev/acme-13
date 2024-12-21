import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signupUserSchema } from "./user.schema.js";
import { signupUser } from "./user.service.js";

export const users = new Hono()
  .basePath("/users")
  /**
   * Signup a new user
   */
  .post("/signup", zValidator("json", signupUserSchema), async (ctx) => {
    try {
      const { email, password } = ctx.req.valid("json");

      const user = await signupUser({ email, password });

      return ctx.json(
        {
          response_code: "ok",
          message: "User created successfully",
          data: {
            user,
          },
        },
        201
      );
    } catch (error) {
      console.error(error);
      return ctx.json({
        response_code: "error",
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  });
