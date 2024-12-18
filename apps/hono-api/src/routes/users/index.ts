import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as argon2 from "argon2";
import { usersTable } from "../../db/tables/users.table.js";
import { db } from "../../db/index.js";
import { signupUserSchema } from "./users.schema.js";

export const users = new Hono().basePath("/users");

/**
 * Signup a new user
 */
users.post("/signup", zValidator("json", signupUserSchema), async (ctx) => {
  try {
    const userInput = ctx.req.valid("json");

    // Hash password
    const hashedPassword = await argon2.hash(userInput.password);

    // Insert user into database
    const [user] = await db
      .insert(usersTable)
      .values({
        email: userInput.email,
        password: hashedPassword,
      })
      .returning({
        id: usersTable.id,
        email: usersTable.email,
        created_at: usersTable.created_at,
        updated_at: usersTable.updated_at,
      })
      .execute();

    return ctx.json({
      response_code: "ok",
      message: "User created successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    return ctx.json({
      response_code: "error",
      message: error instanceof Error ? error.message : "An error occurred",
    });
  }
});
