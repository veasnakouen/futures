import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, value, ...props }, ref) => {
    const safeValue =
      typeof value === "string" || typeof value === "number"
        ? String(value)
        : value === null || value === undefined
        ? ""
        : value;

    return (
      <input
        {...props}
        type={type}
        value={safeValue}
        className={cn(
          "flex h-10 w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:focus-visible:ring-indigo-400/30 transition-all duration-200 focus:shadow-md disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
