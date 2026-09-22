"use client";
import * as React from "react";
import Image from 'next/image';
import { useState } from "react";
import { useRouter } from "next/navigation";

type InputVariant = "default" | "error";
type Type = "text" | "password";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: Type;
  label_class: string;
  variant: InputVariant;
  error?: string;
  helperText?: string;
  placeholder?: string;
  icon?: string;
  mobile?: boolean;
  className?: string;
}

const variantStyles: Record<InputVariant, string> = {
  default: "bg-surface-highest text-default-placeholder placeholder:text-default-placeholder",

  error: "bg-error-input-bg text-error-placeholder placeholder:text-error-placeholder",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      type,
      label_class,
      mobile,
      variant = "default",
      error,
      helperText,
      className = "",
      ...props
    },
    ref
  ) => {

    const router = useRouter();
  const [showPassword, setShowPassword] = useState(type === "password" ? false : true);

    return (
      <div className="flex w-full flex-col gap-2 relative">
        {label && (
          <label
            className={label_class}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={`
            h-11
            w-full
            pr-10
            ${variantStyles[variant]}
            ${className}
          `}
          {...props}
        />
 
        {(type === "password" && label.toLocaleLowerCase() === "password") && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 focus:outline-none flex items-center justify-center"
          >
            {showPassword ? (
              <Image 
                src="/Icons/Eye_Icon_Slashed.svg" 
                alt="Hide password" 
                width={18} 
                height={20} 
              />
            ) : (
              <Image 
                src="/Icons/Eye_Icon.svg" 
                alt="Show password" 
                width={18} 
                height={20} 
              />
            )}
          </button>
        )}
        {
          mobile && (
            <span className="absolute right-0 text-primary xxs:hidden text-primary-button-sm font-semibold hover:cursor-pointer" onClick={()=>{router.push("/forgot-password")}}>Forgot?</span>
          )
        }
        {(error || helperText) && (
          <p
            className={`text-helper-text ${
              variant === "error"
                ? "text-[#D92D20]"
                : "text-slate-neutral-light"
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";