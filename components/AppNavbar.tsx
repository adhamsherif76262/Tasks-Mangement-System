"use client";

import { useEffect, useState } from "react";

interface UserMetadata {
  name?: string;
  job_title?: string;
}

interface AuthUser {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
}

interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: AuthUser;
}

interface UserResponse {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
}

interface AppUser {
  name: string;
  jobTitle: string;
}

interface AppNavbarProps {
  onMenuClick?: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEYS;

function getInitials(name: string): string {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return "U";
  }

  const nameParts = trimmedName.split(/\s+/);

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase();
  }

  const firstNameInitial = nameParts[0].charAt(0);
  const lastNameInitial = nameParts[nameParts.length - 1].charAt(0);

  return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
}

function formatName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map(
      (part) =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(),
    )
    .join(" ");
}

export default function AppNavbar({
  onMenuClick,
}: AppNavbarProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!BASE_URL) {
          throw new Error(
            "NEXT_PUBLIC_BASE_URL is not configured.",
          );
        }

        if (!API_KEY) {
          throw new Error(
            "NEXT_PUBLIC_SECRET_KEYS is not configured.",
          );
        }

        const storedSession =
          localStorage.getItem("auth_session") ??
          sessionStorage.getItem("auth_session");

        if (!storedSession) {
          console.error("No authenticated session found.");
          return;
        }

        const session: AuthSession = JSON.parse(storedSession);

        if (!session.access_token) {
          console.error("No access token found.");
          return;
        }

        const response = await fetch(
          `${BASE_URL}/auth/v1/user`,
          {
            method: "GET",
            headers: {
              apikey: API_KEY,
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => null);

          console.error(
            "Failed to fetch authenticated user:",
            errorData,
          );

          return;
        }

        const result: UserResponse = await response.json();

        const name =
          result.user_metadata?.name?.trim() ||
          session.user?.user_metadata?.name?.trim() ||
          "User";

        const jobTitle =
          result.user_metadata?.job_title?.trim() ||
          session.user?.user_metadata?.job_title?.trim() ||
          "";

        setUser({
          name: formatName(name),
          jobTitle,
        });
      } catch (error) {
        console.error(
          "Error fetching authenticated user:",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const displayName = user?.name || "User";
  const initials = getInitials(displayName);
  const jobTitle = user?.jobTitle || "";

  return (
    <header
      className="
        sticky
        top-0
        z-40
        flex
        h-21
        w-full
        items-center
        justify-between
        border-b
        border-[#E2E5EE]
        bg-[#F9F9FF]
        px-8
        max-xlg:h-12
        max-xlg:px-4
      "
    >
      {/* Mobile / Tablet left side */}
      <div className="flex items-center gap-2 max-xlg:flex xlg:hidden">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-md
            text-slate-neutral-dark
            hover:bg-[#EEF2FF]
          "
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M5 7H19M5 12H19M5 17H19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <span
          className="
            text-taskly-logo
            font-bold
            text-slate-neutral-dark
          "
        >
          TASKLY
        </span>
      </div>

      <div className="hidden xlg:block" />

      {/* User information */}
      <div
        className="
          flex
          min-w-0
          items-center
          gap-4
          max-xlg:gap-2.5
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-col
            items-end
            justify-center
          "
        >
          {isLoading ? (
            <>
              <div
                className="
                  h-4
                  w-32
                  animate-pulse
                  rounded
                  bg-[#E1E5EF]
                  max-xlg:h-3
                  max-xlg:w-20
                "
              />

              <div
                className="
                  mt-1
                  h-3
                  w-24
                  animate-pulse
                  rounded
                  bg-[#E1E5EF]
                  max-xlg:h-2
                  max-xlg:w-16
                "
              />
            </>
          ) : (
            <>
              <p
                className="
                  max-w-48
                  truncate
                  text-right
                  text-[16px]
                  font-bold
                  leading-5
                  text-slate-neutral-dark
                  max-sm:max-w-36
                  max-xxs:max-w-28
                  max-xlg:text-[11px]
                  max-xlg:leading-4
                  max-sm:hidden
                "
              >
                {displayName}
              </p>

              {jobTitle && (
                <p
                  className="
                    max-w-48
                    truncate
                    text-right
                    text-[13px]
                    font-bold
                    uppercase
                    tracking-[0.08em]
                    text-primary
                    max-sm:max-w-36
                    max-xxs:max-w-28
                    max-xxs:text-[10px]
                    max-xlg:text-[7px]
                    max-xlg:leading-3
                    max-sm:hidden
                  "
                >
                  {jobTitle}
                </p>
              )}
            </>
          )}
        </div>

        {/* Avatar */}
        <div
          className="
            flex
            h-13
            w-13
            shrink-0
            items-center
            justify-center
            rounded-[10px]
            bg-primary-container
            text-[20px]
            font-bold
            text-white
            max-xlg:h-8
            max-xlg:w-8
            max-xlg:rounded-[7px]
            max-xlg:text-[11px]
          "
          aria-label={`Avatar for ${displayName}`}
        >
          {isLoading ? "..." : initials}
        </div>
      </div>
    </header>
  );
}