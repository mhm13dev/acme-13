import * as argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import * as jose from "jose";
import cloneDeep from "clone-deep";
import { env } from "../../config/env.js";
import { db } from "../../db/index.js";
import {
  usersTable,
  type User,
  type UserWithoutSensitiveFields,
} from "../../db/tables/users.table.js";
import { sessionsTable, type Session } from "../../db/tables/sessions.table.js";
import { nanoid } from "../../utils/nanoid.js";
import { ApiResponseCode } from "../../utils/api-response.js";
import { ApiError } from "../../utils/api-error.js";
import type { IJwtPayload, TokenType } from "./user.types.js";

// Convert secrets to `Uint8Array`
const accessTokenSecret = new TextEncoder().encode(env.ACCESS_TOKEN_SECRET);
const refreshTokenSecret = new TextEncoder().encode(env.REFRESH_TOKEN_SECRET);

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
    .returning()
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
    .select()
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
  const tokenFamily = nanoid();
  const tokenPair = await generateTokenPair({ user, tokenFamily });

  // Create a session in the database
  await db
    .insert(sessionsTable)
    .values({
      userId: user.id,
      tokenFamily,
      refreshToken: await argon2.hash(tokenPair.refreshToken),
    })
    .execute();

  return { user: omitSensitiveUserFields(user), ...tokenPair };
}

/**
 * Login a user
 */
export async function refreshTokens(params: {
  user: UserWithoutSensitiveFields;
  session: Pick<Session, "tokenFamily"> & {
    refreshToken: string;
  };
}): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const {
    user,
    session: { refreshToken, tokenFamily },
  } = params;

  // Get session from database
  const session = await db
    .select({
      id: sessionsTable.id,
      refreshToken: sessionsTable.refreshToken,
    })
    .from(sessionsTable)
    .where(
      and(
        eq(sessionsTable.userId, user.id),
        eq(sessionsTable.tokenFamily, tokenFamily)
      )
    )
    .execute()
    .then((rows) => rows[0]);

  if (!session) {
    // User was logged out of this session
    throw new ApiError(
      ApiResponseCode.unauthorized,
      "Invalid refresh token",
      401
    );
  }

  // Verify refresh token
  if (!(await argon2.verify(session.refreshToken, refreshToken))) {
    // The refresh token was compromised. Logout the user from this session
    await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.id, session.id))
      .execute();
    throw new ApiError(
      ApiResponseCode.unauthorized,
      "Invalid refresh token",
      401
    );
  }

  // Generate JWT token pair
  const tokenPair = await generateTokenPair({ user, tokenFamily });

  // Update the session in the database
  await db
    .update(sessionsTable)
    .set({
      refreshToken: await argon2.hash(tokenPair.refreshToken),
    })
    .where(eq(sessionsTable.id, session.id))
    .execute();

  return {
    accessToken: tokenPair.accessToken,
    refreshToken: tokenPair.refreshToken,
  };
}

/**
 * Generate JWT token pair
 */
async function generateTokenPair(params: {
  user: Pick<User, "id" | "email">;
  tokenFamily: string;
}): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const { user, tokenFamily } = params;

  const alg = "HS256";
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

  return { accessToken, refreshToken };
}

/**
 * Load user function for `auth` middleware
 */
export async function loadUser(
  userId: number
): Promise<UserWithoutSensitiveFields> {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId))
    .execute();

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
 * Verify JWT (access / refresh token)
 */
export async function verifyJwt(
  type: TokenType,
  token: string
): Promise<{
  loadUser: () => Promise<UserWithoutSensitiveFields>;
  jwtPayload: IJwtPayload;
}> {
  const { payload } = await jose.jwtVerify<IJwtPayload>(
    token,
    type === "access_token" ? accessTokenSecret : refreshTokenSecret,
    {
      algorithms: ["HS256"],
    }
  );

  return {
    // Get user from database on demand
    loadUser: () => loadUser(Number(payload.sub)),
    jwtPayload: payload,
  };
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
