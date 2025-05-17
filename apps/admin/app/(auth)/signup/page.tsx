import React from "react";
import { AppRoutes } from "@/config/routes";
import { AuthWrapper } from "@/components/auth/wrapper";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";

export function SignupPage() {
  return (
    <>
      <TypographyH3 className="text-center">Create an account</TypographyH3>

      <AuthForm formType="signup" />

      <AuthFooter formType="signup" />
    </>
  );
}

export default AuthWrapper(SignupPage, AppRoutes.auth.signup.auth);
