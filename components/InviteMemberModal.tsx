/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  UserRoundPlus,
  Mail,
  LoaderCircle,
  CheckCircle2,
} from "lucide-react";

interface InviteMemberModalProps {
  isOpen: boolean;
  projectId: string;
  onClose: () => void;
}

export default function InviteMemberModal({
  isOpen,
  projectId,
  onClose,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [requestError, setRequestError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submittingRef = useRef(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submittingRef.current) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setEmailError("");
      setRequestError("");
      setSuccessMessage("");
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (submittingRef.current) return;

    const normalizedEmail = email.trim();

    setEmailError("");
    setRequestError("");
    setSuccessMessage("");

    if (!projectId || projectId === "undefined" || projectId === "null") {
      setRequestError(
        "The project could not be identified. Please refresh the page and try again.",
      );
      return;
    }

    if (!normalizedEmail) {
      setEmailError("Email address is required.");
      emailInputRef.current?.focus();
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!validEmail.test(normalizedEmail)) {
      setEmailError("Please enter a valid email address.");
      emailInputRef.current?.focus();
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(projectId)}/invite-member`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
          }),
        },
      );

      const result = await response.json().catch(() => null);

      if (response.status === 401) {
        setRequestError(
          "Your session has expired. Please log in again.",
        );
        return;
      }

      if (!response.ok || result?.success !== true) {
        throw new Error(
          result?.error ||
            "Unable to send the invitation. Please try again.",
        );
      }

      setEmail("");
      setSuccessMessage("Invitation sent successfully.");
    } catch (error) {
      setRequestError(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the invitation. Please try again.",
      );
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-slate-950/40 backdrop-blur-[3px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !submittingRef.current
        ) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-member-title"
        className="relative w-full max-h-[90dvh] overflow-y-auto rounded-t-2xl bg-white px-6 pb-8 pt-8 shadow-2xl sm:max-w-[448px] sm:rounded-lg sm:px-8 sm:pb-8 sm:pt-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close invitation dialog"
          className="absolute right-6 top-6 rounded-md p-1 text-[#777D8D] transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="mb-3 flex size-12 items-center justify-center rounded-lg bg-[#F0F3FF] text-[#003FA8]">
          <UserRoundPlus size={24} strokeWidth={2} />
        </div>

        <h2
          id="invite-member-title"
          className="pr-8 text-[23px] font-semibold leading-7 tracking-[-0.04em] text-[#0B2144]"
        >
          Invite Team Member
        </h2>

        <p className="mt-2 text-sm leading-5 text-[#526487]">
          Send an invitation to join the{" "}
          <span className="font-medium">project</span> workspace.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mt-6">
            <label
              htmlFor="invite-member-email"
              className="mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#526487]"
            >
              Email Address
            </label>

            <div
              className={`flex h-12 items-center rounded-[5px] border bg-[#D9E3FF] px-4 transition focus-within:ring-2 focus-within:ring-[#0046B8]/20 ${
                emailError
                  ? "border-red-500"
                  : "border-transparent"
              }`}
            >
              <input
                ref={emailInputRef}
                id="invite-member-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter email address"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (emailError) setEmailError("");
                  if (requestError) setRequestError("");
                  if (successMessage) setSuccessMessage("");
                }}
                disabled={isSubmitting}
                aria-invalid={Boolean(emailError)}
                aria-describedby={
                  emailError ? "invite-email-error" : undefined
                }
                className="min-w-0 flex-1 bg-transparent text-sm text-[#172B4D] outline-none placeholder:text-[#8C9AB8] disabled:opacity-60"
              />

              <Mail
                size={17}
                strokeWidth={1.7}
                className="ml-3 shrink-0 text-[#65728D]"
                aria-hidden="true"
              />
            </div>

            {emailError && (
              <p
                id="invite-email-error"
                role="alert"
                className="mt-1.5 text-xs text-red-600"
              >
                {emailError}
              </p>
            )}
          </div>

          {requestError && (
            <p
              role="alert"
              className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm leading-5 text-red-700"
            >
              {requestError}
            </p>
          )}

          {successMessage && (
            <p
              role="status"
              className="mt-3 flex items-start gap-2 rounded-md bg-green-50 px-3 py-2.5 text-sm leading-5 text-green-800"
            >
              <CheckCircle2
                size={17}
                className="mt-0.5 shrink-0"
              />
              <span>{successMessage}</span>
            </p>
          )}

          <div className="mt-10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-12 min-w-[112px] rounded-lg px-4 text-sm font-semibold text-[#526487] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-lg bg-[#0046B8] px-4 text-sm font-semibold text-white shadow-[0_8px_14px_-8px_rgba(0,45,130,0.55)] transition hover:bg-[#003D9B] disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none sm:min-w-[186px]"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  Sending...
                </>
              ) : (
                "Send Invitation"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
