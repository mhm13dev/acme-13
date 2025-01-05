import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import * as jose from "jose";
import cloneDeep from "clone-deep";
import { db } from "../../db/index.js";
import {
  usersTable,
  type User,
  type UserWithoutSensitiveFields,
} from "../../db/tables/users.table.js";
import { sessionsTable } from "../../db/tables/sessions.table.js";
import { nanoid } from "../../utils/nanoid.js";
import { ApiResponseCode } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import type { IJwtPayload } from "./user.types.js";

const accessTokenSecret = new TextEncoder().encode(
  process.env.JWT_ACCESS_TOKEN_SECRET
);
const refreshTokenSecret = new TextEncoder().encode(
  process.env.JWT_REFRESH_TOKEN_SECRET
);

/**
 * Signup a new user
 */
export async function signupUser(params: {
  email: string;
  password: string;
}): Promise<UserWithoutSensitiveFields> {
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

  return omitSensitiveUserFields(user);
}

/**
 * Login a user
 */
export async function loginUser(params: {
  email: string;
  password: string;
}): Promise<{
  user: UserWithoutSensitiveFields;
  accessToken: string;
  refreshToken: string;
}> {
  const { email, password } = params;

  // Get user from database
  const user = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      password: usersTable.password,
      created_at: usersTable.created_at,
      updated_at: usersTable.updated_at,
    })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .execute()
    .then((rows) => rows[0]);

  if (!user || !(await argon2.verify(user.password, password))) {
    throw new ApiError(
      ApiResponseCode.resource_not_found,
      "User not found",
      404
    );
  }

  // Generate JWT token pair
  const tokenPair = await generateTokenPair(user);

  // Create a session in the database
  await db
    .insert(sessionsTable)
    .values({
      userId: user.id,
      tokenFamily: tokenPair.tokenFamily,
      refreshToken: await argon2.hash(tokenPair.refreshToken),
    })
    .execute();

  return { user: omitSensitiveUserFields(user), ...tokenPair };
}

/**
 * Generate JWT token pair
 */
async function generateTokenPair(user: User): Promise<{
  accessToken: string;
  refreshToken: string;
  tokenFamily: string;
}> {
  const alg = "HS256";
  const tokenFamily = nanoid();
  const payload: IJwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    token_family: tokenFamily,
  };

  const [accessToken, refreshToken] = await Promise.all([
    new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("15m")
      .sign(accessTokenSecret),
    new jose.SignJWT(payload)
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(refreshTokenSecret),
  ]);

  return { accessToken, refreshToken, tokenFamily };
}

/**
 * Verify JWT (access / refresh token)
 */
export async function verifyJwt(
  type: "access_token" | "refresh_token",
  token: string
): Promise<UserWithoutSensitiveFields> {
  const { payload } = await jose.jwtVerify<IJwtPayload>(
    token,
    type === "access_token" ? accessTokenSecret : refreshTokenSecret,
    {
      algorithms: ["HS256"],
    }
  );

  const user = await db
    .select({
      id: usersTable.id,
      email: usersTable.email,
      created_at: usersTable.created_at,
      updated_at: usersTable.updated_at,
    })
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(payload.sub, 10)))
    .execute()
    .then((rows) => rows[0]);

  if (!user) {
    throw new ApiError(
      ApiResponseCode.resource_not_found,
      "User not found",
      404
    );
  }

  return omitSensitiveUserFields(user);
}

/**
 * Omit sensitive fields from user object
 */
function omitSensitiveUserFields<T>(user: T): UserWithoutSensitiveFields<T> {
  const userCopy = cloneDeep(user);
  return {
    ...userCopy,
    password: undefined,
  };
}
