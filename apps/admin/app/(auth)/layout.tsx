import React from "react";
import { AppWrapper } from "@/components/app-wrapper";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <AppWrapper className="py-0 max-w-xl text-black min-h-screen flex flex-col justify-center">
      <div className="border px-4 py-10 rounded-xl space-y-6">{children}</div>
    </AppWrapper>
  );
}
