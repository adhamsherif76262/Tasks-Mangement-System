import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters")
      .refine(
        (value) => !/\s/.test(value),
        "Password must not contain whitespace"
      )
      .refine(
        (value) => /[A-Z]/.test(value),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (value) => /[a-z]/.test(value),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (value) => /[0-9]/.test(value),
        "Password must contain at least one number"
      )
      .refine(
        (value) => /[!@#$%^&*]/.test(value),
        "Password must contain at least one special character"
      ),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormData = z.infer<typeof loginSchema>;
