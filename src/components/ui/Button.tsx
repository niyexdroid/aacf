"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    let buttonClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50";

    // Add variant classes
    if (variant === "primary") {
      buttonClasses +=
        " bg-orange-500 text-white hover:bg-orange-600 shadow-lg hover:shadow-xl";
    } else if (variant === "secondary") {
      buttonClasses += " bg-gray-200 text-gray-900 hover:bg-gray-300";
    } else if (variant === "outline") {
      buttonClasses +=
        " border-2 border-orange-500 bg-transparent text-orange-500 hover:bg-orange-50";
    }

    // Add size classes
    if (size === "sm") {
      buttonClasses += " h-9 px-4 py-2 text-sm";
    } else if (size === "md") {
      buttonClasses += " h-10 px-6 py-2";
    } else if (size === "lg") {
      buttonClasses += " h-11 px-8 py-2 text-lg";
    }

    // Add custom classes if provided
    if (className) {
      buttonClasses += " " + className;
    }

    return <button ref={ref} className={buttonClasses} {...props} />;
  },
);
Button.displayName = "Button";
