import React from "react";
import Link from "next/link";
import { FormType } from "./auth.types";

interface Props {
  formType: FormType;
}

export const AuthFooter: React.FC<Props> = ({ formType }) => {
  return (
    <p className="text-center text-sm">
      {formType === "login" ? "Don't" : "Already"} have an account?{" "}
      <Link
        href={formType === "login" ? "/signup" : "/login"}
        className="font-medium focus:outline-hidden focus:border-none focus:ring-2 focus:ring-black"
      >
        {formType === "login" ? "Sign up" : "Login"}
      </Link>
    </p>
  );
};
