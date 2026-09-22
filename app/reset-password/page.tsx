"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEYS;

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(64, "Password must not exceed 64 characters.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
  .regex(/[0-9]/, "Password must contain at least one digit.")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character.",
  );

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<
  typeof resetPasswordSchema
>;

type PasswordRequirement = {
  key:
    | "length"
    | "uppercase"
    | "lowercase"
    | "digit"
    | "special";
  label: string;
  isValid: (password: string) => boolean;
};

const passwordRequirements: PasswordRequirement[] = [
  {
    key: "length",
    label: "8-64 characters",
    isValid: (password) =>
      password.length >= 8 && password.length <= 64,
  },
  {
    key: "uppercase",
    label: "Uppercase letter",
    isValid: (password) => /[A-Z]/.test(password),
  },
  {
    key: "lowercase",
    label: "Lowercase letter",
    isValid: (password) => /[a-z]/.test(password),
  },
  {
    key: "digit",
    label: "At least one digit",
    isValid: (password) => /[0-9]/.test(password),
  },
  {
    key: "special",
    label: "Special character (e.g. !@#$%)",
    isValid: (password) => /[^A-Za-z0-9]/.test(password),
  },
];

export default function ResetPasswordPage() {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string | null>(
    null,
  );

  const [isCheckingRecoveryLink, setIsCheckingRecoveryLink] =
    useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [IsSuccess, setIsSuccess] = useState(false);
  const [Countdown, setCountdown] = useState(0);

  const [resetError, setResetError] = useState("");

  const [isPasswordUpdated, setIsPasswordUpdated] =
    useState(false);

  const [redirectSeconds, setRedirectSeconds] = useState(3);

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password") ?? "";
  const confirmPassword = watch("confirmPassword") ?? "";

  /*
   * Read the recovery information from the URL hash.
   *
   * Example:
   * /reset-password#access_token=...&refresh_token=...&type=recovery
   */
  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) {
      setIsCheckingRecoveryLink(false);
      return;
    }

    const hashParams = new URLSearchParams(
      hash.substring(1),
    );

    const type = hashParams.get("type");
    const token = hashParams.get("access_token");

    if (type !== "recovery" || !token) {
      setAccessToken(null);
      setIsCheckingRecoveryLink(false);
      return;
    }

    setAccessToken(token);
    setIsCheckingRecoveryLink(false);

    /*
     * Remove the token from the visible browser URL while
     * keeping it available in component state.
     *
     * The token is therefore not displayed in the UI and
     * does not remain visible in the address bar.
     */
    window.history.replaceState(
      null,
      "",
      window.location.pathname,
    );
  }, []);

  /*
   * Redirect to login after a successful password update.
   */
  useEffect(() => {
    if (!isPasswordUpdated) return;

    if (redirectSeconds <= 0) {
      router.replace("/login");
      return;
    }

    const timeout = window.setTimeout(() => {
      setRedirectSeconds((previous) => previous - 1);
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [isPasswordUpdated, redirectSeconds, router]);

  const requirementStatus = useMemo(() => {
    return passwordRequirements.map((requirement) => ({
      ...requirement,
      valid: requirement.isValid(password),
    }));
  }, [password]);

//   const updatePassword = async (
//     data: ResetPasswordFormValues,
//   ) => {
//     if (isSubmitting) return;

//     if (!accessToken) {
//       setResetError("Invalid or expired reset link.");
//       return;
//     }

//     setIsSubmitting(true);
//     setResetError("");

//     try {
//       if (!BASE_URL) {
//         throw new Error(
//           "Password reset is temporarily unavailable.",
//         );
//       }

//       if (!API_KEY) {
//         throw new Error(
//           "Password reset is temporarily unavailable.",
//         );
//       }

//       const response = await fetch(
//         `${BASE_URL}/auth/v1/user`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             apikey: API_KEY,
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             password: data.password,
//           }),
//         },
//       );

//       const responseData = await response
//         .json()
//         .catch(() => null);

//       if (!response.ok) {
//         /*
//          * A failed recovery-token request can mean that
//          * the recovery link is invalid or expired.
//          */
//         const apiMessage =
//           responseData?.message ||
//           responseData?.error_description ||
//           responseData?.error;

//         if (
//           response.status === 401 ||
//           response.status === 403 ||
//           !apiMessage
//         ) {
//           throw new Error(
//             "Invalid or expired reset link.",
//           );
//         }

//         throw new Error(apiMessage);
//       }

//       setIsPasswordUpdated(true);
//     } catch (error) {
//       console.error("Reset password error:", error);

//       setResetError(
//         error instanceof Error
//           ? error.message
//           : "Unable to update your password. Please try again.",
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
  if (!accessToken) {
    setResetError("Invalid or expired reset link.");
    return;
  }

  if (!BASE_URL || !API_KEY) {
    setResetError("Password reset is temporarily unavailable. Please try again later.");
    return;
  }

  setIsSubmitting(true);
  setResetError("");

  try {
    const response = await fetch(`${BASE_URL}/auth/v1/user`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: data.password,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const apiError =
        result?.msg ||
        result?.message ||
        result?.error_description ||
        result?.error;

      if (
        apiError?.toLowerCase().includes("same") ||
        apiError?.toLowerCase().includes("old password") ||
        apiError?.toLowerCase().includes("different")
      ) {
        setResetError(
          "Your new password must be different from your current password.",
        );
      } else {
        setResetError(
          apiError ||
            "We couldn't update your password. Please try again.",
        );
      }

      return;
    }

    // Success
    setIsSuccess(true);
    setCountdown(3);
  } catch (error) {
    console.error("Password update error:", error);

    setResetError(
      "We couldn't update your password. Please try again later.",
    );
  } finally {
    setIsSubmitting(false);
  }
};

  /*
   * Recovery link is still being inspected.
   */
  if (isCheckingRecoveryLink) {
    return (
      <main className="min-h-screen w-full bg-[#F9F9FF]">
        {/* <TasklyHeader /> */}

        <div className="flex w-full justify-center px-4 pt-20">
          <div className="h-80 w-full max-w-112 animate-pulse rounded-[4px] bg-white" />
        </div>
      </main>
    );
  }

  /*
   * No valid recovery token.
   */
  if (!accessToken) {
    return (
      <main className="min-h-screen w-full bg-[#F9F9FF]">
        {/* <TasklyHeader /> */}

        <div className="flex w-full justify-center px-4 pt-20 max-xxs:pt-12">
          <section className="w-full max-w-112 rounded-[4px] bg-white px-7 py-7 shadow-[0px_8px_24px_rgba(4,27,60,0.04)] max-xxs:px-4">
            <h1 className="text-[18px] font-bold leading-6 text-slate-neutral-dark">
              Create a New Password
            </h1>

            <p className="mt-2 text-[9px] leading-3.5 text-slate-neutral-medium">
              Your password reset link is invalid or has
              expired.
            </p>

            <p className="mt-5 text-[10px] font-medium text-semantic-error">
              Invalid or expired reset link.
            </p>

            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="
                mt-6
                flex
                h-9.5
                w-full
                items-center
                justify-center
                rounded-[2px]
                bg-[#0052CC]
                text-[10px]
                font-bold
                text-white
                shadow-[0px_4px_10px_rgba(0,61,155,0.18)]
                transition-colors
                hover:bg-primary
              "
            >
              Back to log in
            </button>
          </section>
        </div>
      </main>
    );
  }

  /*
   * Successful password update.
   */
  if (isPasswordUpdated) {
    return (
      <main className="min-h-screen w-full bg-[#F9F9FF]">
        {/* <TasklyHeader /> */}

        <div className="flex w-full justify-center px-4 pt-20 max-xxs:pt-12">
          <section className="w-full max-w-112 rounded-[4px] bg-white px-7 py-7 shadow-[0px_8px_24px_rgba(4,27,60,0.04)] max-xxs:px-4">
            <h1 className="text-[18px] font-bold leading-6 text-slate-neutral-dark">
              Create a New Password
            </h1>

            <div className="mt-5 rounded-[4px] bg-[#82F9BE]/30 px-4 py-4">
              <div className="flex items-start gap-2">
                <SuccessIcon />

                <p className="text-[9px] leading-4 text-[#075B3D]">
                  Your password has been updated
                  successfully. You can now log in
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-[9px] text-slate-neutral-medium">
              Redirecting to login in{" "}
              <span className="font-bold text-primary">
                {redirectSeconds}
              </span>{" "}
              {redirectSeconds === 1
                ? "second"
                : "seconds"}
              ...
            </p>

            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="
                mt-5
                flex
                h-9.5
                w-full
                items-center
                justify-center
                rounded-[2px]
                bg-[#0052CC]
                text-[10px]
                font-bold
                text-white
                shadow-[0px_4px_10px_rgba(0,61,155,0.18)]
                transition-colors
                hover:bg-primary
              "
            >
              Back to log in
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#F9F9FF]">
      {/* <TasklyHeader /> */}

      <div className="flex w-full justify-center px-4 pt-20 max-xxs:pt-12">
        <section className="w-full max-w-112 rounded-[4px] bg-white px-7 py-7 shadow-[0px_8px_24px_rgba(4,27,60,0.04)] max-xxs:px-4 max-xxs:py-5">
          {/* Heading */}
          <div>
            <h1 className="text-[18px] font-bold leading-6 text-slate-neutral-dark">
              Create a New Password
            </h1>

            <p className="mt-2 text-[9px] leading-3.5 text-slate-neutral-medium">
              Create a new, strong password to secure your
              workstation access.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleResetPassword)}
            noValidate
            className="mt-7"
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#526487]"
              >
                New Password
              </label>

              <div className="relative mt-1">
                <input
                  id="new-password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  {...register("password")}
                  className={`
                    h-11
                    w-full
                    rounded-[2px]
                    border
                    bg-[#EEF1FC]
                    px-3
                    pr-10
                    text-[11px]
                    text-slate-neutral-dark
                    outline-none
                    transition-colors
                    placeholder:text-[#8D96AA]
                    focus:border-primary
                    disabled:cursor-not-allowed
                    disabled:opacity-70
                    ${
                      errors.password
                        ? "border-semantic-error"
                        : "border-transparent"
                    }
                  `}
                />

                <button
                  type="button"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  onClick={() =>
                    setShowPassword(
                      (previous) => !previous,
                    )
                  }
                  disabled={isSubmitting}
                  className="
                    absolute
                    right-2.5
                    top-1/2
                    -translate-y-1/2
                    text-[#7B8498]
                    transition-colors
                    hover:text-primary
                    disabled:cursor-not-allowed
                  "
                >
                  <EyeIcon
                    visible={showPassword}
                  />
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-[8px] leading-3 text-semantic-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mt-5">
              <label
                htmlFor="confirm-password"
                className="text-[8px] font-bold uppercase tracking-[0.08em] text-[#526487]"
              >
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("confirmPassword")}
                className={`
                  mt-1
                  h-11
                  w-full
                  rounded-[2px]
                  border
                  bg-[#EEF1FC]
                  px-3
                  text-[11px]
                  text-slate-neutral-dark
                  outline-none
                  transition-colors
                  placeholder:text-[#8D96AA]
                  focus:border-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                  ${
                    errors.confirmPassword
                      ? "border-semantic-error"
                      : "border-transparent"
                  }
                `}
              />

              {errors.confirmPassword && (
                <p className="mt-1 text-[8px] leading-3 text-semantic-error">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Security Requirements */}
            <div className="mt-5 rounded-[3px] bg-[#F3F5FC] px-4 py-3.5">
              <p className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#526487]">
                Security Requirements
              </p>

              <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-2 max-xxs:grid-cols-1">
                {requirementStatus.map((requirement) => (
                  <div
                    key={requirement.key}
                    className="flex min-w-0 items-center gap-1.5"
                  >
                    <RequirementIcon
                      valid={requirement.valid}
                    />

                    <span
                      className={`
                        text-[8px] leading-3
                        ${
                          requirement.valid
                            ? "text-slate-neutral-dark"
                            : "text-[#8A93A7]"
                        }
                      `}
                    >
                      {requirement.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* API Error */}
            {resetError && (
              <p className="mt-4 text-center text-[9px] leading-4 text-semantic-error">
                {resetError}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                mt-5
                flex
                h-9.5
                w-full
                items-center
                justify-center
                rounded-[2px]
                bg-[#0052CC]
                text-[10px]
                font-bold
                text-white
                shadow-[0px_4px_10px_rgba(0,61,155,0.18)]
                transition-colors
                hover:bg-primary
                disabled:cursor-not-allowed
                disabled:opacity-70
              "
            >
              {isSubmitting
                ? "Updating..."
                : "Update Password"}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => router.replace("/login")}
              disabled={isSubmitting}
              className="
                mx-auto
                mt-4
                flex
                items-center
                justify-center
                text-[9px]
                font-medium
                text-primary
                transition-colors
                hover:text-primary-container
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span className="mr-1">←</span>
              Back to log in
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared UI                                                                  */
/* -------------------------------------------------------------------------- */

// function TasklyHeader() {
//   return (
//     <div className="px-5 pt-5 max-xxs:px-4 max-xxs:pt-4">
//       <div className="flex items-center gap-1.5">
//         <TasklyLogoIcon />

//         <span className="text-[11px] font-bold tracking-[-0.03em] text-primary">
//           TASKLY
//         </span>
//       </div>
//     </div>
//   );
// }

function TasklyLogoIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3.5L20 7.8V16.2L12 20.5L4 16.2V7.8L12 3.5Z"
        fill="currentColor"
        className="text-primary"
      />

      <path
        d="M8.5 9.2H15.5M12 9.2V15.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M2.5 12C4.5 8.5 7.7 6.5 12 6.5C16.3 6.5 19.5 8.5 21.5 12C19.5 15.5 16.3 17.5 12 17.5C7.7 17.5 4.5 15.5 2.5 12Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        <circle
          cx="12"
          cy="12"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.6"
        />
      </svg>
    );
  }

  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M10.6 6.7C11.05 6.57 11.52 6.5 12 6.5C16.3 6.5 19.5 8.5 21.5 12C20.7 13.4 19.7 14.55 18.5 15.4M8.1 8.1C5.8 8.9 4 10.25 2.5 12C4.5 15.5 7.7 17.5 12 17.5C13.35 17.5 14.6 17.25 15.75 16.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RequirementIcon({
  valid,
}: {
  valid: boolean;
}) {
  if (valid) {
    return (
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="#08744E"
          strokeWidth="1.7"
        />

        <path
          d="M8 12.2L10.7 15L16 9"
          stroke="#08744E"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="#B8BFCE"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="#08744E"
      />

      <path
        d="M8 12.2L10.7 15L16.5 9"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}