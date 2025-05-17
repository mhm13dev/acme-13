import React from "react";
import { cn } from "@/lib/utils";

export const AppWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn("max-w-(--breakpoint-3xl) mx-auto p-4", className)} {...props}>
      {children}
    </div>
  );
};
