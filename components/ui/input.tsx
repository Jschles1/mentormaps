import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex text-black-darkest h-10 w-full rounded-sm border border-[rgba(130,143,163,0.25)] bg-background px-4 py-2 text-[0.813rem] lg:text-base ring-offset-dark-lavender placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-dark-lavender focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-orange",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
