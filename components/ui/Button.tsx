"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-moveo-primary text-white active:bg-moveo-primaryDark disabled:bg-moveo-border disabled:text-moveo-muted",
  secondary: "bg-moveo-primarySoft text-moveo-primary active:bg-moveo-border",
  ghost: "bg-transparent text-moveo-ink border border-moveo-border active:bg-moveo-border/40",
  danger: "bg-moveo-danger text-white active:opacity-90",
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ variant = "primary", fullWidth = true, className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        className={`${fullWidth ? "w-full" : ""} rounded-2xl px-6 py-4 text-base font-semibold tracking-tight transition-colors disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
