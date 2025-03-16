import React from "react";

import { AppRoutes } from "@/config/routes";
import { authWrapper } from "@/lib/auth/auth-wrapper";
import { TypographyH3 } from "@/components/ui/typography/h3";
import { AuthForm } from "../_components/auth-form";
import { AuthFooter } from "../_components/auth-footer";
import { loginUser } from "./actions";

export function LoginPage() {
  return (
    <>
      <TypographyH3 className="text-center">Login to your account</TypographyH3>

      <AuthForm formType="login" onSubmitAction={loginUser} />

      <AuthFooter formType="login" />
    </>
  );
}

export default authWrapper(LoginPage, AppRoutes.auth.login.auth);
