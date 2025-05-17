import { AxiosError } from "axios";
import { type AuthFormData } from "@repo/shared-lib/zod-schemas";
import { type ApiResponse } from "@repo/shared-lib/api-response";
import { type LoginUserResponse, type SignupUserResponse } from "@repo/shared-lib/api-response/users";
import { axiosApi } from "@/lib/axios";

/**
 * Signup a user.
 */
export const signupUser = async (authFormData: AuthFormData): Promise<ApiResponse> => {
  try {
    await axiosApi.post<SignupUserResponse>("/users/signup", authFormData);
    return await loginUser(authFormData);
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return {
      message: "Something went wrong",
      response_code: "internal_server_error",
      data: null,
    };
  }
};

/**
 * Login a user.
 */
export const loginUser = async (authFormData: AuthFormData): Promise<ApiResponse> => {
  try {
    const { data } = await axiosApi.post<LoginUserResponse>("/users/login", authFormData);
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return {
      message: "Something went wrong",
      response_code: "internal_server_error",
      data: null,
    };
  }
};

/**
 * Logout a user.
 */
export const logoutUser = async (): Promise<ApiResponse> => {
  try {
    const { data } = await axiosApi.post<ApiResponse>("/users/logout");
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response?.data;
    }
    return {
      message: "Something went wrong",
      response_code: "internal_server_error",
      data: null,
    };
  }
};
