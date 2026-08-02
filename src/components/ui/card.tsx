import * as React from "react";
import { cn } from "@/lib/utils";

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-champagne/40 bg-white/60 backdrop-blur-sm shadow-[0_2px_20px_rgba(58,46,34,0.06)]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";
