"use client";

import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
interface ButtonProps{
  variant: ButtonVariant;
  text: string;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  variant = "primary",
  text = "Template Button",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-primary to-primary-container text-white",

    secondary:
      "bg-white text-primary-button-sm text-primary",

    ghost:
      "bg-transparent text-ghost-button text-slate-neutral-medium",
  };

  return (
    <button
      className={`${variants[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {text}
    </button>
  );
}