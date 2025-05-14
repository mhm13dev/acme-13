import * as argon2 from "argon2";
import { eq } from "drizzle-orm";
import * as jose from "jose";
import cloneDeep from "clone-deep";
import { ApiResponseCode } from "@repo/shared-lib/api-response";
import type { IJwtPayload } from "@repo/shared-lib/api-response/users";
import {
  db,
  usersTable,
  type User,
  type UserWithoutSensitiveFields,
} from "@repo/db";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/api-error.js";

// Prepare JWT secret
const accessTokenPrivateKey = await jose.importPKCS8(
  env.ACCESS_TOKEN_PRIVATE_KEY_PEM,
  env.JWT_ALGORITHM
);
const accessTokenPublicKey = await jose.importSPKI(
  env.ACCESS_TOKEN_PUBLIC_KEY_PEM,
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

  // Generate access token
  const { accessToken } = await generateAccessToken({ user });

  return { user: omitSensitiveUserFields(user), accessToken };
}

/**
 * Generate access token
 */
async function generateAccessToken(params: {
  user: Pick<User, "id" | "email">;
}): Promise<{ accessToken: string }> {
  const { user } = params;

  const payload: IJwtPayload = {
    sub: user.id.toString(),
    email: user.email,
  };

  const accessTokenExpiresAt =
    Math.floor(Date.now() / 1000) + env.ACCESS_TOKEN_EXPIRY;

  const accessToken = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: env.JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(accessTokenExpiresAt)
    .sign(accessTokenPrivateKey);

  return { accessToken };
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
 * Verify access token
 */
export async function verifyAccessToken(token: string): Promise<{
  loadUser: () => Promise<UserWithoutSensitiveFields>;
  jwtPayload: IJwtPayload;
}> {
  try {
    const { payload } = await jose.jwtVerify<IJwtPayload>(
      token,
      accessTokenPublicKey,
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
      "Invalid access token. Please login again.",
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
