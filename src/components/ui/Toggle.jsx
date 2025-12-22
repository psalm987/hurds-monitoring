import * as React from "react";
import { cn } from "../../lib/utils";

const Toggle = React.forwardRef(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const handleClick = () => {
      if (onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={handleClick}
        className={cn(
          "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 shadow-inner",
          checked
            ? "bg-primary border-primary shadow-primary/20"
            : "bg-input border-border",
          className
        )}
        ref={ref}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-all duration-300",
            checked
              ? "translate-x-5 bg-white"
              : "translate-x-0.5 bg-muted-foreground/30"
          )}
        />
      </button>
    );
  }
);

Toggle.displayName = "Toggle";

export { Toggle };
