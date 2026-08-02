import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-lg border bg-white/70 px-4 text-base font-medium text-ink placeholder:font-normal placeholder:text-ink/40",
          "border-ink/20 transition-colors duration-150",
          "focus-ring focus:border-champagne-dark/60",
          error && "border-clay/70 focus:ring-clay/40",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
