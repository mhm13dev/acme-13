import crypto from "node:crypto";
import * as argon2 from "argon2";
import { and, eq, lt, or } from "drizzle-orm";
import * as jose from "jose";
import cloneDeep from "clone-deep";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import {
  usersTable,
  sessionsTable,
  type User,
  type UserWithoutSensitiveFields,
  type Session,
} from "@repo/shared-lib/db";
import { env } from "../../config/env.js";
import { db } from "../../db/index.js";
import { nanoid } from "../../utils/nanoid.js";
import { ApiError } from "../../utils/api-error.js";
import type { TokenPayload } from "../../middlewares/auth.middleware.js";
import type { IJwtPayload, TokenType } from "./user.types.js";

// Prepare JWT secrets
const accessTokenPrivateKey = await jose.importPKCS8(
  env.ACCESS_TOKEN_PRIVATE_KEY_PEM,
  env.JWT_ALGORITHM
);
const accessTokenPublicKey = await jose.importSPKI(
  env.ACCESS_TOKEN_PUBLIC_KEY_PEM,
  env.JWT_ALGORITHM
);
const refreshTokenPrivateKey = await jose.importPKCS8(
  env.REFRESH_TOKEN_PRIVATE_KEY_PEM,
  env.JWT_ALGORITHM
);
const refreshTokenPublicKey = await jose.importSPKI(
  env.REFRESH_TOKEN_PUBLIC_KEY_PEM,
  env.JWT_ALGORITHM
);

/**
 * Signup a new user
 */
export async function signupUser(params: {
  email: string;
  password: string;
}): Promise<UserWithoutSensitiveFields> {
  const { email, password } = params;

  // Check if user already exists
  const [existingUser] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .execute();

  if (existingUser) {
    throw new ApiError(ApiResponseCode.conflict, "User already exists!", 409);
  }

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
      refreshToken: encryptRefreshToken(tokenPair.refreshToken),
      expiresAt: tokenPair.refreshTokenExpiresAt,
    })
    .execute();

  return { user: omitSensitiveUserFields(user), ...tokenPair };
}

/**
 * Refresh tokens
 */
export async function refreshTokens(params: {
  user: UserWithoutSensitiveFields;
  tokenPayload: TokenPayload<"refresh_token">;
}): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const { user, tokenPayload } = params;

  // Get session from database
  const session = await db
    .select()
    .from(sessionsTable)
    .where(
      and(
        eq(sessionsTable.userId, user.id),
        eq(sessionsTable.tokenFamily, tokenPayload.tokenFamily)
      )
    )
    .execute()
    .then((rows) => rows[0]);

  if (!session) {
    // User was logged out of this session
    throw new ApiError(
      ApiResponseCode.unauthorized,
      "Session expired. Please login again.",
      401
    );
  }

  // Decrypt the refresh tokens from the session
  const decryptedRefreshTokenFromSession = decryptRefreshToken(
    session.refreshToken
  );
  const decryptedPreviousRefreshTokenFromSession = session.previousRefreshToken
    ? decryptRefreshToken(session.previousRefreshToken)
    : null;

  /**
   * If it is an old refresh token of the same token family,
   * that means it was already used before and it's a replay attack.
   * We should invalidate the session.
   */
  if (
    decryptedRefreshTokenFromSession !== tokenPayload.refreshToken &&
    decryptedPreviousRefreshTokenFromSession !== tokenPayload.refreshToken
  ) {
    // Invalidate the session
    await invalidateSession({ session, user });
    throw new ApiError(
      ApiResponseCode.unauthorized,
      "Refresh token was already used. Please login again.",
      401
    );
  }

  /**
   * If the refresh token is the previous refresh token,
   * and it's `previousUsedAt` is within the 30 seconds time frame,
   * then we consider it a valid request but instead of generating a new refresh token,
   * we return the currently active refresh token with a newly generated access token.
   *
   * Else, we consider it a replay attack with recently used refresh token outside the allowed time frame.
   * In this case, we invalidate the session.
   */
  if (decryptedPreviousRefreshTokenFromSession === tokenPayload.refreshToken) {
    if (
      !session.previousUsedAt ||
      new Date().getTime() - session.previousUsedAt.getTime() > 30000
    ) {
      // Invalidate the session
      await invalidateSession({ session, user });
      throw new ApiError(
        ApiResponseCode.unauthorized,
        "Refresh token was recently used. Please login again.",
        401
      );
    }

    // Generate JWT token pair
    const tokenPair = await generateTokenPair({
      user,
      tokenFamily: tokenPayload.tokenFamily,
    });

    return {
      // New access token
      accessToken: tokenPair.accessToken,
      // Current active refresh token
      refreshToken: decryptedRefreshTokenFromSession,
    };
  }

  /**
   * From here, we can assume that the refresh token is the current active refresh token and is valid.
   * So, we can generate a new token pair and update the session in the database.
   */

  // Generate JWT token pair
  const tokenPair = await generateTokenPair({
    user,
    tokenFamily: tokenPayload.tokenFamily,
    // Use the same expiry as the previous refresh token to avoid infinite refresh token lifetime
    refreshTokenExpiresAt: tokenPayload.exp,
  });

  // Update the session in the database
  await db
    .update(sessionsTable)
    .set({
      refreshToken: encryptRefreshToken(tokenPair.refreshToken),
      previousRefreshToken: encryptRefreshToken(tokenPayload.refreshToken),
      previousUsedAt: new Date(),
    })
    .where(eq(sessionsTable.id, session.id))
    .execute();

  return {
    accessToken: tokenPair.accessToken,
    refreshToken: tokenPair.refreshToken,
  };
}

/**
 * Invalidate a session.
 * Delete the provided session and other expired sessions of the user from the database.
 */
async function invalidateSession(params: {
  session: Session;
  user: UserWithoutSensitiveFields;
}) {
  const { session, user } = params;

  await db
    .delete(sessionsTable)
    .where(
      or(
        eq(sessionsTable.id, session.id),
        and(
          eq(sessionsTable.userId, user.id),
          lt(sessionsTable.expiresAt, new Date())
        )
      )
    )
    .execute();
}

/**
 * Generate JWT token pair
 */
async function generateTokenPair(params: {
  user: Pick<User, "id" | "email">;
  tokenFamily: string;
  /**
   * Expiry time for the refresh token in seconds.
   * - It should be set to the required expiry time in future.
   * We won't calculate it based on the current time in this function.
   */
  refreshTokenExpiresAt?: number;
}): Promise<{
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
}> {
  const {
    user,
    tokenFamily,
    refreshTokenExpiresAt: refreshTokenExpiresAtParam,
  } = params;

  const payload: IJwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    token_family: tokenFamily,
  };

  const accessTokenExpiresAt =
    Math.floor(Date.now() / 1000) + env.ACCESS_TOKEN_EXPIRY;
  const refreshTokenExpiresAt =
    refreshTokenExpiresAtParam ??
    Math.floor(Date.now() / 1000) + env.REFRESH_TOKEN_EXPIRY;

  const [accessToken, refreshToken] = await Promise.all([
    new jose.SignJWT(payload)
      .setProtectedHeader({ alg: env.JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(accessTokenExpiresAt)
      .sign(accessTokenPrivateKey),
    new jose.SignJWT(payload)
      .setProtectedHeader({ alg: env.JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(refreshTokenExpiresAt)
      .sign(refreshTokenPrivateKey),
  ]);

  return {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt: new Date(refreshTokenExpiresAt * 1000),
  };
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
  try {
    const { payload } = await jose.jwtVerify<IJwtPayload>(
      token,
      type === "access_token" ? accessTokenPublicKey : refreshTokenPublicKey,
      {
        algorithms: [env.JWT_ALGORITHM],
      }
    );
    return {
      // Get user from database on demand
      loadUser: () => loadUser(Number(payload.sub)),
      jwtPayload: payload,
    };
  } catch (error) {
    throw new ApiError(
      ApiResponseCode.unauthorized,
      `Invalid ${
        type === "access_token" ? "access" : "refresh"
      } token. Please login again.`,
      401
    );
  }
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

/**
 * Encrypt Refresh Token with AES-256-GCM
 */
function encryptRefreshToken(refreshToken: string): string {
  // Generate a 12-byte IV
  const iv = crypto.randomBytes(12);

  // Create a cipher instance
  const cipher = crypto.createCipheriv(
    env.REFRESH_TOKEN_ENCRYPTION_ALGORITHM,
    env.REFRESH_TOKEN_ENCRYPTION_KEY,
    iv
  );

  // Encrypt the refresh token
  const encrypted = Buffer.concat([
    cipher.update(refreshToken, "utf8"),
    cipher.final(),
  ]);

  // Get the authentication tag
  const authTag = cipher.getAuthTag();

  // Combine IV, authTag, and encrypted refresh token
  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

/**
 * Decrypt Refresh Token with AES-256-GCM
 */
function decryptRefreshToken(encryptedRefreshToken: string): string {
  // Decode the base64-encoded refresh token
  const data = Buffer.from(encryptedRefreshToken, "base64");

  // Extract the IV, authTag, and encrypted refresh token
  const iv = data.subarray(0, 12);
  const authTag = data.subarray(12, 28);
  const encrypted = data.subarray(28);

  // Create a decipher instance
  const decipher = crypto.createDecipheriv(
    env.REFRESH_TOKEN_ENCRYPTION_ALGORITHM,
    env.REFRESH_TOKEN_ENCRYPTION_KEY,
    iv
  );

  // Set the authentication tag
  decipher.setAuthTag(authTag);

  // Decrypt and return the refresh token
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
