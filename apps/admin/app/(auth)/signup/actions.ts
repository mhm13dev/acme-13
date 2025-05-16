"use server";

import { env } from "@/config/env";
import { AuthFormData } from "@repo/shared-lib/zod-schemas";
import { ApiResponse } from "@repo/shared-lib/api-response";
import { loginUser } from "../login/actions";

/**
 * Signup a user.
 */
export const signupUser = async (authFormData: AuthFormData): Promise<ApiResponse | void> => {
  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/users/signup`, {
    method: "POST",
    body: JSON.stringify(authFormData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return (await response.json()) as ApiResponse;
  }

  // Login user after signup
  await loginUser(authFormData);
};
