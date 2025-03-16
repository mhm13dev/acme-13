import React from "react";
import { cn } from "@/utils/cn";

export const AppWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn("max-w-(--breakpoint-2xl) mx-auto p-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};
