import * as argon2 from "argon2";
import { db } from "../../db/index.js";
import { usersTable, type User } from "../../db/tables/users.table.js";

/**
 * Signup a new user
 */
export async function signupUser(params: {
  email: string;
  password: string;
}): Promise<Omit<User, "password">> {
  const { email, password } = params;

  // Hash password
  const hashedPassword = await argon2.hash(password);

  // Insert user into database
  const [user] = await db
    .insert(usersTable)
    .values({
      email,
      password: hashedPassword,
    })
    .returning({
      id: usersTable.id,
      email: usersTable.email,
      created_at: usersTable.created_at,
      updated_at: usersTable.updated_at,
    })
    .execute();

  return user;
}
