import * as React from "react";

type InputVariant = "default" | "error";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
// {
  label: string;
  label_class: string;
  variant: InputVariant;
  error?: string;
  helperText?: string;
  placeholder?: string;
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

    return (
      <div className="flex w-full flex-col gap-2">
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
        //   id={inputId}
        //   required={required}
        //   aria-invalid={variant === "error"}
        //   aria-describedby={describedBy}
          className={`
            h-11
            w-full
            ${variantStyles[variant]}
            ${className}
          `}
          {...props}
        />

        {(error || helperText) && (
          <p
            // id={describedBy}
            className={`text-helper-text ${
              variant === "error"
                ? "text-[#D92D20]"
                : "text-[#6B7280]"
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