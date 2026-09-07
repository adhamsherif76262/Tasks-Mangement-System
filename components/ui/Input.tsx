"use client";
import * as React from "react";
import Image from 'next/image';
import { useState } from "react";

type InputVariant = "default" | "error";
type Type = "text" | "password";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
// {
  label: string;
  type: Type;
  label_class: string;
  variant: InputVariant;
  error?: string;
  helperText?: string;
  placeholder?: string;
  icon?: string;
//   required?: boolean;
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
      variant = "default",
      error,
      helperText,
      className = "",
    //   required,
    //   id,
      ...props
    },
    ref
  ) => {
    // const generatedId = React.useId();

    // const inputId = id ?? generatedId;

    // const describedBy =
    //   error || helperText
    //     ? `${inputId}-description`
    //     : undefined;
  const [showPassword, setShowPassword] = useState(type === "password" ? false : true);

    return (
      <div className="flex w-full flex-col gap-2 relative">
        {label && (
          <label
            // htmlFor={inputId}
            className={label_class}
          >
            {label}

            {/* {required && (
              <span className="ml-1 text-[#D92D20]">*</span>
            )} */}
          </label>
        )}

        <input
          ref={ref}
          type={showPassword ? "text" : "password"}
        //   id={inputId}
        //   required={required}
        //   aria-invalid={variant === "error"}
        //   aria-describedby={describedBy}
          className={`
            h-11
            w-full
            pr-10
            ${variantStyles[variant]}
            ${className}
          `}
          {...props}
        />
 
 
        {/* 4. Position the icon absolute inside the input and add a click handler */}

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

        {(error || helperText) && (
          <p
            // id={describedBy}
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