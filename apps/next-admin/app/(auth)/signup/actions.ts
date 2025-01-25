"use server";

import { env } from "@/config/env";
import { AuthFormData } from "@repo/shared-lib/zod-schemas/auth.schema";
import { loginUser } from "../login/actions";

interface SignupUserErrorResponse {
  response_code: string;
  message: string;
}

export type SignupUserResponse = SignupUserErrorResponse;

/**
 * Signup a user.
 */
export const signupUser = async (
  authFormData: AuthFormData
): Promise<SignupUserResponse | void> => {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/signup`, {
    method: "POST",
    body: JSON.stringify(authFormData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return await response.json();
  }

  // Login user after signup
  await loginUser(authFormData);
};
