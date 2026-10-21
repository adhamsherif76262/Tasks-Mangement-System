/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import {Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  MailCheck,
} from "lucide-react";

type ApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: unknown;
};

function getProjectId(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;

  const possibleIds = [
    record.project_id,
    record.projectId,
    record.id,
  ];

  for (const candidate of possibleIds) {
    if (
      typeof candidate === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        candidate,
      )
    ) {
      return candidate;
    }
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const id = getProjectId(item);
      if (id) return id;
    }
  }

  return null;
}

function getAcceptanceError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";

  if (
    normalized.includes("expired") &&
    normalized.includes("invitation")
  ) {
    return "This invitation has expired. Please contact the project admin to request a new invitation.";
  }

  if (
    normalized.includes("invalid") &&
    normalized.includes("invitation")
  ) {
    return "This invitation link is invalid. Please contact the project admin to request a new invitation.";
  }

  if (
    normalized.includes("already accepted") ||
    normalized.includes("already been accepted")
  ) {
    return "This invitation has already been accepted. If you believe this is a mistake, please contact the project admin.";
  }

  return (
    message ||
    "Something went wrong while accepting the invitation. Please try again."
  );
}

function InvitePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const requestInProgress = useRef(false);
  const redirectStarted = useRef(false);

  const checkAuthentication = useCallback(async () => {
    if (!token) {
      setError(
        "This invitation link is invalid. Please contact the project admin to request a new invitation.",
      );
      setIsCheckingAuth(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/user", {
        method: "GET",
        cache: "no-store",
      });

      if (response.status === 401) {
        const redirect = `/invite?token=${encodeURIComponent(token)}`;

        router.replace(
          `/login?redirect=${encodeURIComponent(redirect)}`,
        );
        return;
      }

      if (!response.ok) {
        throw new Error("Unable to verify your login session.");
      }

      setIsAuthenticated(true);
    } catch {
      setError(
        "We couldn't verify your login session. Please refresh the page and try again.",
      );
    } finally {
      setIsCheckingAuth(false);
    }
  }, [router, token]);

  useEffect(() => {
    void checkAuthentication();
  }, [checkAuthentication]);

  const handleAcceptInvitation = async () => {
    if (
      !token ||
      !isAuthenticated ||
      requestInProgress.current
    ) {
      return;
    }

    requestInProgress.current = true;
    setIsAccepting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = (await response.json()) as ApiResponse;

      if (response.status === 401) {
        const redirect = `/invite?token=${encodeURIComponent(token)}`;

        router.replace(
          `/login?redirect=${encodeURIComponent(redirect)}`,
        );
        return;
      }

      if (!response.ok || result.success !== true) {
        setError(getAcceptanceError(result.error || result.message));
        return;
      }

      setSuccess("Invitation accepted successfully.");

      const projectId = getProjectId(result.data);

      window.setTimeout(() => {
        if (redirectStarted.current) return;

        redirectStarted.current = true;

        if (projectId) {
          router.replace(
            `/project/${encodeURIComponent(projectId)}/tasks`,
          );
        } else {
          router.replace("/project");
        }
      }, 1200);
    } catch {
      setError(
        "Something went wrong while accepting the invitation. Please try again.",
      );
    } finally {
      requestInProgress.current = false;
      setIsAccepting(false);
    }
  };

  const isBusy = isCheckingAuth || isAccepting;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F9FF] px-4 py-10">
      <section className="w-full max-w-[480px] rounded-2xl border border-[#E7EBF8] bg-white px-6 py-10 text-center shadow-[0_24px_48px_0_#041B3C0F] sm:px-10">
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-[#EAF0FF] text-[#0046B8]">
          {success ? (
            <CheckCircle2 size={32} />
          ) : error ? (
            <CircleAlert size={32} />
          ) : isBusy ? (
            <LoaderCircle size={32} className="animate-spin" />
          ) : (
            <MailCheck size={32} />
          )}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[#0B2144]">
          {success
            ? "Invitation Accepted"
            : error
              ? "Invitation Issue"
              : isCheckingAuth
                ? "Verifying Invitation"
                : "Accept Project Invitation"}
        </h1>

        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#526487]">
          {success
            ? "Invitation accepted successfully. Redirecting you now..."
            : error
              ? error
              : isCheckingAuth
                ? "Please wait while we verify your invitation and login session."
                : "You've been invited to join a project on Taskly. Accept the invitation to continue to your workspace."}
        </p>

        {!token && !isCheckingAuth && (
          <button
            type="button"
            onClick={() => router.replace("/projects")}
            className="mt-8 h-12 w-full rounded-lg bg-[#0046B8] px-5 text-sm font-semibold text-white transition hover:bg-[#003D9B]"
          >
            Back to Projects
          </button>
        )}

        {token && isAuthenticated && !success && (
          <button
            type="button"
            onClick={handleAcceptInvitation}
            disabled={isBusy || Boolean(error && isCheckingAuth)}
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0046B8] px-5 text-sm font-semibold text-white transition hover:bg-[#003D9B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isAccepting && (
              <LoaderCircle size={18} className="animate-spin" />
            )}
            {isAccepting ? "Accepting Invitation..." : "Accept Invitation"}
          </button>
        )}

        {error && token && (
          <button
            type="button"
            onClick={() => router.replace("/projects")}
            className="mt-3 h-11 w-full rounded-lg border border-[#DCE3F1] bg-white px-5 text-sm font-semibold text-[#526487] transition hover:bg-slate-50"
          >
            Back to Projects
          </button>
        )}
      </section>
    </main>
  );
}


export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
          <div className="flex items-center gap-3 text-slate-600">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            <span>Loading invitation...</span>
          </div>
        </main>
      }
    >
      <InvitePageContent />
    </Suspense>
  );
}