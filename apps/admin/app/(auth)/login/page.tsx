import React from "react";
import { authWrapper } from "@/app/(auth)/lib/auth-wrapper";
import { AppRoutes } from "@/config/routes";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";

export function LoginPage() {
  return (
    <>
      <TypographyH3 className="text-center">Login to your account</TypographyH3>

      <AuthForm formType="login" />

      <AuthFooter formType="login" />
    </>
  );
}

export default authWrapper(LoginPage, AppRoutes.auth.login.auth);
