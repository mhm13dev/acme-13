"use client";
import React, { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  authFormDataSchema,
  type AuthFormData,
} from "@repo/shared-lib/zod-schemas";
import { ApiResponse } from "@repo/shared-lib/api-response";
import { cn } from "@/utils/cn";
import { FormType } from "./auth.types";

interface Props {
  formType: FormType;
  onSubmitAction: (formData: AuthFormData) => Promise<ApiResponse | void>;
}

export const AuthForm: React.FC<Props> = ({ formType, onSubmitAction }) => {
  const authFormId = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authFormDataSchema),
  });

  const onSubmit = async (formData: AuthFormData) => {
    try {
      const response = await onSubmitAction(formData);

      if (!response) {
        // Indicates success from server action and redirects to specified page
        return;
      }

      // There was an error
      setError("root", {
        message: response.message,
      });
    } catch (error) {
      console.error(error);
      setError("root", {
        message: `Something went wrong while ${
          formType === "login" ? "logging in" : "signing up"
        }. Please try again.`,
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <label
          htmlFor={`email-${authFormId}`}
          className="block text-sm font-medium text-gray-00"
        >
          Email
        </label>
        <input
          type="email"
          id={`email-${authFormId}`}
          className={cn(
            "block rounded-md w-full p-2 border-none focus:outline-hidden focus:border-none ring-2",
            errors.email
              ? "ring-red-500 focus:ring-red-500"
              : "ring-slate-200 focus:ring-black"
          )}
          placeholder="johndoe@example.com"
          required
          {...register("email")}
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor={`password-${authFormId}`}
          className="block text-sm font-medium text-gray-00"
        >
          Password
        </label>
        <input
          type="password"
          id={`password-${authFormId}`}
          className={cn(
            "block rounded-md w-full p-2 border-none focus:outline-hidden focus:border-none ring-2",
            errors.password
              ? "ring-red-500 focus:ring-red-500"
              : "ring-slate-200 focus:ring-black"
          )}
          placeholder="********"
          required
          {...register("password")}
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>
      <div className="space-y-2">
        <button
          disabled={Object.keys(errors).length > 0 && !errors.root}
          className="bg-black text-white py-2 px-4 rounded-md font-medium block w-full focus:outline-hidden focus:border-none focus:ring-2 focus:ring-black cursor-pointer"
        >
          {formType === "login" ? "Login" : "Sign up"}
        </button>
        <p className="text-red-500 text-sm text-center">
          {errors.root?.message}
        </p>
      </div>
    </form>
  );
};
