"use client";

import type { InputHTMLAttributes } from "react";

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
}

export default function Checkbox({
  label,
  error,
  className = "",
  id,
  ...props
}: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="flex items-center gap-2 cursor-pointer select-none"
      >
        <input
          id={id}
          type="checkbox"
          className={`h-4 w-4 cursor-pointer ${className}`}
          {...props}
        />

        <span className="text-sm">
          {label}
        </span>
      </label>

      {error && (
        <p className="text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}