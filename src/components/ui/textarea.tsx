import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-white/70 px-4 py-3 text-base font-medium text-ink placeholder:font-normal placeholder:text-ink/40",
          "border-ink/20 transition-colors duration-150 resize-none",
          "focus-ring focus:border-champagne-dark/60",
          error && "border-clay/70 focus:ring-clay/40",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
