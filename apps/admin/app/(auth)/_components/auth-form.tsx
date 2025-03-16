"use client";
import React, { useId } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  authFormDataSchema,
  type AuthFormData,
} from "@repo/shared-lib/zod-schemas";
import { ApiResponse } from "@repo/shared-lib/api-response";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    const response = await onSubmitAction(formData);

    if (!response) {
      // Indicates success from server action and redirects to specified page
      return;
    }

    // There was an error
    setError("root", {
      message: response.message,
    });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor={`email-${authFormId}`}>Email</Label>
        <Input
          id={`email-${authFormId}`}
          type="email"
          placeholder="johndoe@example.com"
          {...register("email")}
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`password-${authFormId}`}>Password</Label>
        <Input
          id={`password-${authFormId}`}
          type="password"
          placeholder="********"
          {...register("password")}
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>

      <div className="space-y-2">
        <Button
          disabled={Object.keys(errors).length > 0 && !errors.root}
          className="w-full"
        >
          {formType === "login" ? "Login" : "Sign up"}
        </Button>

        <p className="text-red-500 text-sm text-center">
          {errors.root?.message}
        </p>
      </div>
    </form>
  );
};
