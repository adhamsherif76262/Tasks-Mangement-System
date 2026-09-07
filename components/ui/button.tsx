"use client";

import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
// type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
{
  variant: ButtonVariant;
//   size: ButtonSize;
  text: string;
  className?: string;
}
// box-shadow: 0px 25px 50px -12px #003D9B4D;

export default function Button({
  variant = "primary",
//   size = "md",
  text = "Template Button",
  className = "",
//   children,
  ...props
}: ButtonProps) {
//   const baseStyles =
//     "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-primary to-primary-container text-white",

    secondary:
      "bg-white text-primary-button-sm text-primary",

    ghost:
      "bg-transparent text-ghost-button text-slate-neutral-medium",
  };

//   const sizes: Record<ButtonSize, string> = {
//     sm: "h-8 px-4 text-sm",
//     md: "h-12 px-8 text-base",
//     lg: "text-sm",
//   };

  return (
    <button
    onClick={() => alert("Button clicked!")}
    //   className={`${baseStyles} ${variants[variant]} ${sizes[size]} rounded-[2px] ${className}`}
    //   className={`${variants[variant]} ${sizes[size]} ${className}`}
      className={`${variants[variant]} ${className}`}
      {...props}
    >
      {text}
    </button>
  );
}