import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormType } from "./types";

interface Props {
  formType: FormType;
}

export const AuthFooter: React.FC<Props> = ({ formType }) => {
  return (
    <div>
      <p className="text-center text-sm">
        {formType === "login" ? "Don't" : "Already"} have an account?{" "}
        <Button variant="link" className="p-0 h-auto" asChild>
          <Link href={formType === "login" ? "/signup" : "/login"}>{formType === "login" ? "Sign up" : "Login"}</Link>
        </Button>
      </p>
    </div>
  );
};
