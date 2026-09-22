"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEYS;

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
});

type ForgotPasswordFormValues = z.infer<
  typeof forgotPasswordSchema
>;

type RequestState = "idle" | "success" | "error";

const RESEND_DELAY_SECONDS = 5 * 60;
const MAX_RESEND_ATTEMPTS = 3;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [requestState, setRequestState] =
    useState<RequestState>("idle");

  const [requestError, setRequestError] =
    useState("");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [resendAttempts, setResendAttempts] =
    useState(0);

  const [remainingSeconds, setRemainingSeconds] =
    useState(0);

  const timerRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
    },
  });

  const isResendDisabled =
    isSubmitting ||
    remainingSeconds > 0 ||
    resendAttempts >= MAX_RESEND_ATTEMPTS;

  /*
   * Clear the timer when the component unmounts.
   */
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  /*
   * Start the 5-minute resend countdown.
   */
  const startResendTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setRemainingSeconds(RESEND_DELAY_SECONDS);

    timerRef.current = setInterval(() => {
      setRemainingSeconds((previous) => {
        if (previous <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  const formatRemainingTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSecondsPart = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSecondsPart,
    ).padStart(2, "0")}`;
  };

  /*
   * Send password recovery email.
   */
  const sendResetEmail = async (email: string) => {
    if (!BASE_URL) {
      throw new Error(
        "Password reset is temporarily unavailable.",
      );
    }

    if (!API_KEY) {
      throw new Error(
        "Password reset is temporarily unavailable.",
      );
    }

    const response = await fetch(
      `${BASE_URL}/auth/v1/recover`,
      {
        method: "POST",
        headers: {
          apikey: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      },
    );

    if (!response.ok) {
      /*
       * We intentionally do not expose the raw server response
       * because the forgot-password flow must not reveal
       * sensitive account information.
       */
      throw new Error(
        "We couldn't send the reset link right now. Please try again later.",
      );
    }
  };

  /*
   * Initial password reset request.
   */
  const handleForgotPassword = async (
    data: ForgotPasswordFormValues,
  ) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setRequestError("");

    try {
      await sendResetEmail(data.email.trim());

      /*
       * Always show the same success state regardless
       * of whether the email belongs to an account.
       */
      setRequestState("success");

      /*
       * The initial request does NOT count as a resend.
       */
      startResendTimer();
    } catch (error) {
      console.error("Forgot password error:", error);

      setRequestState("error");

      setRequestError(
        error instanceof Error
          ? error.message
          : "We couldn't send the reset link right now. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /*
   * Resend password reset email.
   */
  const handleResend = async () => {
    if (isResendDisabled || isSubmitting) return;

    const email = getValues("email").trim();

    if (!email) {
      setRequestState("error");
      setRequestError(
        "Please enter your email address first.",
      );
      return;
    }

    setIsSubmitting(true);
    setRequestError("");

    try {
      await sendResetEmail(email);

      /*
       * This is a successful resend, so increment
       * the resend attempt counter.
       */
      setResendAttempts((previous) => previous + 1);

      setRequestState("success");

      startResendTimer();
    } catch (error) {
      console.error("Resend password reset error:", error);

      setRequestState("error");

      setRequestError(
        error instanceof Error
          ? error.message
          : "We couldn't resend the reset link right now. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendAttemptsRemaining =
    MAX_RESEND_ATTEMPTS - resendAttempts;

  return (
    <main className="min-h-screen w-full bg-[#F9F9FF]">

      {/* Page Content */}
      <div className="flex w-full flex-col items-center p-4 py-10 max-xxs:pt-8 max-xxs:my-auto">
        {/* Forgot Password Card */}
        <section className="w-full xxs:max-w-[36%] mx-[400px] xxs:mt-[150px] my-auto min-h-[375spx] rounded-[4px] bg-white px-5 py-5 shadow-[0px_8px_24px_rgba(4,27,60,0.04)] max-xxs:px-4 max-xxs:py-4">
          <div>
            <h1 className="text-headline-lg py-4 px-2 font-bold leading-5 text-slate-neutral-dark">
              Forgot password?
            </h1>

            <p className="mt-1 text-body-md leading-3 text-slate-neutral-medium py-4 px-2">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(handleForgotPassword)}
            noValidate
            className="mt-4"
          >
            {/* Email */}
            <div>
              {/* <label
                htmlFor="email"
                className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#526487]"
              >
                Email Address
              </label> */}

              {/* <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                disabled={
                  isSubmitting ||
                  requestState === "success"
                }
                {...register("email")}
                className={`
                  mt-1
                  h-8
                  w-full
                  rounded-[2px]
                  border
                  bg-[#D5E1FB]
                  px-2
                  text-[9px]
                  text-slate-neutral-dark
                  outline-none
                  transition-colors
                  placeholder:text-[#94A5C8]
                  focus:border-primary
                  disabled:cursor-not-allowed
                  disabled:opacity-70
                  ${
                    errors.email
                      ? "border-semantic-error"
                      : "border-transparent"
                  }
                `}
              /> */}

            <Input
              {...register("email")}
              type="text"

              variant={
                errors.email
                  ? "error"
                  : "default"
              }

              label="Email Address"

              label_class="
                text-label-xs
                uppercase
                ml-1
                mb-0
                text-slate-neutral-medium
              "

              helperText={
                errors.email?.message || ""
              }

              placeholder="Enter Your Email"

              className="
                rounded-sm
                py-3.5
                px-4
              "
            />
              {/* {errors.email && (
                <p className="mt-1 text-[8px] leading-3 text-semantic-error">
                  {errors.email.message}
                </p>
              )} */}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                isSubmitting ||
                requestState === "success"
              }
              className="
                mt-[24px]
                flex
                h-8
                py-6
                w-full
                items-center
                justify-center
                rounded-[2px]
                bg-[#0052CC]
                px-4
                text-primary-button-lg
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
                ? "Sending..."
                : "Send Reset Link"}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => router.push("/login")}
              disabled={isSubmitting}
              className="
                mx-auto
                mt-3
                flex
                items-center
                justify-center
                text-back-to-login
                font-medium
                text-primary
                transition-colors
                hover:text-primary-container
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span className="mr-1"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.825 9L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7H16V9H3.825Z" fill="#003D9B"/>
</svg></span>
              Back to log in
            </button>
          </form>
        </section>

        {/* Error */}
        {requestState === "error" && requestError && (
          <div className="mt-3 w-full max-xxs:mb-[150px] max-w-112 rounded-[4px] bg-[#FFE7E7] px-4 py-3 text-center text-[9px] leading-4 text-semantic-error">
            {requestError}
          </div>
        )}

        {/* Success */}
        {requestState === "success" && (
          <section className="mt-3 w-full max-xxs:mb-[150px] max-w-112 rounded-[4px] bg-[#82F9BE]/30 px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <SuccessIcon/>

              <p className="text-success-message py-4 leading-3 text-[#075B3D]">
                If an account exists with this email,
                we’ve sent a password reset link.
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-label-xs font-bold uppercase tracking-[0.08em] text-[#075B3D]/70">
                Don't receive an email?
              </span>

              <button
                type="button"
                onClick={handleResend}
                disabled={isResendDisabled}
                className="
                  shrink-0
                  text-label-xs
                  font-bold
                  uppercase
                  tracking-[0.08em]
                  text-primary
                  transition-colors
                  disabled:cursor-not-allowed
                  disabled:text-[#7B86A0]
                "
              >
                {remainingSeconds > 0
                  ? `Resend in ${formatRemainingTime(
                      remainingSeconds,
                    )}`
                  : resendAttempts >=
                      MAX_RESEND_ATTEMPTS
                    ? "Resend unavailable"
                    : "Resend"}
              </button>
            </div>

            {remainingSeconds === 0 &&
              resendAttempts > 0 &&
              resendAttempts < MAX_RESEND_ATTEMPTS && (
                <p className="mt-1 text-right text-[7px] text-[#075B3D]/70">
                  {resendAttemptsRemaining} resend{" "}
                  {resendAttemptsRemaining === 1
                    ? "attempt"
                    : "attempts"}{" "}
                  remaining
                </p>
              )}
          </section>
        )}
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Icons                                                                      */
/* -------------------------------------------------------------------------- */

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

function SuccessIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="5.8333" cy="5.8333" r="5.8333" fill="#004E32"/>
  <path d="M5.01667 8.51667L9.12917 4.40417L8.3125 3.5875L5.01667 6.88333L3.35417 5.22083L2.5375 6.0375L5.01667 8.51667Z" fill="#FFFFFF"/>
</svg>

  );
}