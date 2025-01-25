import React from "react";
import { cn } from "@/utils/cn";

export const AuthHeading: React.FC<
  React.HTMLAttributes<HTMLHeadingElement>
> = ({ className, ...props }) => {
  return (
    <h1
      className={cn("font-semibold text-center text-2xl", className)}
      {...props}
    />
  );
};
