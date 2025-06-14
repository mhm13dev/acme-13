import { randomBytes } from "node:crypto";
import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import cloneDeep from "clone-deep";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import type { TokenPayload } from "@repo/shared-lib/api-response/users";
import { db, sessionsTable, usersTable, type Session, type UserWithoutSensitiveFields } from "@repo/db";
import { env } from "../../config/env.ts";
import { ApiError } from "../../utils/api-error.ts";

/**
 * Signup a new user
 */
export async function signupUser(params: { email: string; password: string }): Promise<UserWithoutSensitiveFields> {
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

  if (!user) {
    throw new ApiError(ApiResponseCode.internal_server_error, "Failed to create user", 500);
  }

  return omitSensitiveUserFields(user);
}

/**
 * Login a user
 */
export async function loginUser(params: { email: string; password: string }): Promise<{
  user: UserWithoutSensitiveFields;
  sessionId: string;
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
    throw new ApiError(ApiResponseCode.resource_not_found, "User not found", 404);
  }

  // Generate session
  const session = await generateSession({ userId: user.id });

  return { user: omitSensitiveUserFields(user), sessionId: session.sessionId };
}

/**
 * Logout a user
 */
export async function logoutUser(sessionId: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.sessionId, sessionId)).execute();
}

/**
 * Generate Session
 */
async function generateSession(params: { userId: number }): Promise<Session> {
  const { userId } = params;

  // Generate session ID with prefix and timestamp
  const prefix = "sess";
  const timestamp = Date.now().toString(36); // timestamp in base36
  const randomComponent = randomBytes(32).toString("base64url"); // random component in base64url
  const sessionId = `${prefix}:${timestamp}:${randomComponent}`; // session id

  const [session] = await db
    .insert(sessionsTable)
    .values({
      sessionId,
      userId,
      expiresAt: new Date(Date.now() + env.SESSION_EXPIRY),
    })
    .returning()
    .execute();

  if (!session) {
    throw new ApiError(ApiResponseCode.internal_server_error, "Failed to generate session", 500);
  }

  return session;
}

/**
 * Load user function for `auth` middleware
 */
export async function loadUser(userId: number): Promise<UserWithoutSensitiveFields> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).execute();

  if (!user) {
    throw new ApiError(ApiResponseCode.resource_not_found, "User not found", 404);
  }

  return omitSensitiveUserFields(user);
}

/**
 * Verify Session
 */
export async function verifySession(sessionId: string): Promise<{
  loadUser: () => Promise<UserWithoutSensitiveFields>;
  tokenPayload: TokenPayload;
}> {
  try {
    const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.sessionId, sessionId)).execute();

    if (!session) {
      throw Error("Invalid session token");
    }

    if (session.expiresAt < new Date()) {
      await db.delete(sessionsTable).where(eq(sessionsTable.sessionId, sessionId)).execute();
      throw Error("Session expired");
    }

    return {
      // Get user from database on demand
      loadUser: () => loadUser(Number(session.userId)),
      tokenPayload: {
        userId: session.userId,
        sessionId: session.sessionId,
        expiresAt: session.expiresAt,
      },
    };
  } catch {
    throw new ApiError(ApiResponseCode.unauthorized, "Invalid access token. Please login again.", 401);
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
