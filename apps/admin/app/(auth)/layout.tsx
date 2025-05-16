import React from "react";

import { AppWrapper } from "@/components/app-wrapper";

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className="bg-muted">
      <AppWrapper className="flex justify-center items-center h-screen">
        <div className="border rounded-md max-w-lg w-full bg-background p-8 space-y-6">{children}</div>
      </AppWrapper>
    </div>
  );
}
