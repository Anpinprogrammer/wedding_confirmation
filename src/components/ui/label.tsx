import * as React from "react";
import { cn } from "@/lib/utils";

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "mb-2 block font-body text-[15px] font-semibold text-ink/90",
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-clay">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";
