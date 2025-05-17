"use client";
import React, { useId } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authFormDataSchema, type AuthFormData } from "@repo/shared-lib/zod-schemas";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AppRoutes } from "@/config/routes";
import { loginUser, signupUser } from "@/lib/api/auth";
import { FormType } from "./types";

const submitActions = {
  login: loginUser,
  signup: signupUser,
} as const;

interface Props {
  formType: FormType;
}

export const AuthForm: React.FC<Props> = ({ formType }) => {
  const router = useRouter();
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
    const submitAction = submitActions[formType];

    const response = await submitAction(formData);

    if (response.response_code === "ok") {
      router.push(AppRoutes.organization.select.path);
    } else {
      setError("root", {
        message: response.message,
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor={`email-${authFormId}`}>Email</Label>
        <Input id={`email-${authFormId}`} type="email" placeholder="johndoe@example.com" {...register("email")} />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`password-${authFormId}`}>Password</Label>
        <Input id={`password-${authFormId}`} type="password" placeholder="********" {...register("password")} />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>
      </div>

      <div className="space-y-2">
        <Button type="submit" disabled={Object.keys(errors).length > 0 && !errors.root} className="w-full">
          {formType === "login" ? "Login" : "Sign up"}
        </Button>

        <p className="text-red-500 text-sm text-center">{errors.root?.message}</p>
      </div>
    </form>
  );
};
