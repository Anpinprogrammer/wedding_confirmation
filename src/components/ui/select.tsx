import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, children, ...props }, ref) => {
    return (
      <div className={cn("relative", className)}>
        <select
          ref={ref}
          className={cn(
            "h-12 w-full appearance-none rounded-lg border bg-white/70 px-4 pr-10 text-base font-medium text-ink",
            "border-ink/20 transition-colors duration-150",
            "focus-ring focus:border-champagne-dark/60",
            error && "border-clay/70 focus:ring-clay/40"
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
      </div>
    );
  }
);
Select.displayName = "Select";
