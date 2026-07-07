import * as React from "react";
import { cn } from "@/lib/utils";
export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "sm" | "md" | "lg" | "xl";
}
export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  const spinnerLines = Array.from({ length: 12 }).map((_, i) => (
    <line
      key={i}
      x1="12"
      y1="2"
      x2="12"
      y2="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      transform={`rotate(${i * 30} 12 12)`}
      opacity={0.1 + (i / 12) * 0.9}
    />
  ));

  return (
    <svg
      className={cn(
        "animate-spin text-blue-600 dark:text-blue-400",
        sizeClasses[size],
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...props}
    >
      {spinnerLines}
    </svg>
  );
}
