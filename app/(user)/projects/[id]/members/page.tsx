"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  UserPlus,
  RefreshCw,
} from "lucide-react";

interface ProjectMember {
  member_id: string;
  project_id: string;
  user_id: string;
  role: "owner" | "admin" | "member" | "viewer";
  email: string;
  metadata: {
    sub?: string;
    name?: string;
    email?: string;
    job_title?: string;
    email_verified?: boolean;
    phone_verified?: boolean;
  };
}

export default function ProjectMembersPage() {
  const router = useRouter();
  const params = useParams();

  const projectId = String(
    params.id ?? "",
  );

  // const [sidebarCollapsed, setSidebarCollapsed] =
  //   useState(false);

  const [members, setMembers] = useState<
    ProjectMember[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] = useState(false);

const fetchMembers = async () => {
  if (!projectId) {
    console.error("Project ID is missing.");
    setIsLoading(false);
    setError(true);
    return;
  }

  setIsLoading(true);
  setError(false);

  try {
    const url = `/api/projects/project-members?project_id=eq.${projectId}`;

    const response = await fetch(url, {
      method: "GET",
    });

    const data = await response.json();

    if (response.status === 401) {
      router.replace("/login");
      return;
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
          "Failed to fetch project members",
      );
    }

    setMembers(
      Array.isArray(data) ? data : [],
    );
  } catch (error) {
    console.error(
      "Failed to fetch project members:",
      error,
    );

    setError(true);
  } finally {
    setIsLoading(false);
  }
};
  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const getMemberName = (
    member: ProjectMember,
  ) => {
    return (
      member.metadata?.name?.trim() ||
      member.email ||
      "Unknown User"
    );
  };

  const getMemberEmail = (
    member: ProjectMember,
  ) => {
    return (
      member.metadata?.email?.trim() ||
      member.email ||
      ""
    );
  };

  const getInitials = (name: string) => {
    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  const formatRole = (
    role: ProjectMember["role"],
  ) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const getRoleStyle = (
    role: ProjectMember["role"],
  ) => {
    if (role === "owner") {
      return "bg-primary text-white";
    }

    return "bg-[#D6E1FF] text-slate-neutral-medium";
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9F9FF]">
      {/* <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed(
            (previous) => !previous,
          )
        }
      /> */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <AppNavbar /> */}

        <main className="min-h-[calc(100vh-84px)] flex-1">
          <div className="mx-auto w-full max-w-[1280px] px-4 py-8 md:px-8 md:py-8 lg:px-12">
            {/* Desktop Header */}
            <div className="mb-8 hidden items-start justify-between md:flex">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em]">
                  <span className="text-slate-neutral-medium">
                    Projects
                  </span>

                  <span className="text-slate-neutral-light">
                    &gt;
                  </span>

                  <span className="text-slate-neutral-medium">
                    Project Name
                  </span>

                  <span className="text-slate-neutral-light">
                    &gt;
                  </span>

                  <span className="text-primary">
                    Members
                  </span>
                </div>

                <h1 className="text-[36px] font-semibold leading-tight tracking-[-0.03em] text-slate-neutral-dark">
                  Project Members
                </h1>
              </div>

              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-white shadow-[0_10px_20px_-12px_#003D9B] transition hover:bg-primary-container"
              >
                <UserPlus size={18} />
                Invite Member
              </button>
            </div>

            {/* Mobile Header */}
            <div className="mb-5 flex justify-center md:hidden">
              <h1 className="text-[32px] font-semibold leading-tight tracking-[-0.03em] text-slate-neutral-dark">
                Project Members
              </h1>
            </div>

            {/* Loading State */}
            {isLoading && (
              <>
                {/* Desktop Skeleton */}
                <div className="hidden overflow-hidden rounded-xl border border-[#E7EBF8] bg-white shadow-[0_0_0_4px_rgba(232,237,255,0.35)] md:block">
                  <div className="grid h-14 grid-cols-[1fr_160px] items-center bg-[#F8F9FE] px-8">
                    <div className="h-3 w-16 animate-pulse rounded bg-slate-neutral-light" />
                    <div className="h-3 w-10 animate-pulse rounded bg-slate-neutral-light" />
                  </div>

                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="grid min-h-23 grid-cols-[1fr_160px] items-center border-t border-[#E8ECF8] px-8"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 animate-pulse rounded-xl bg-slate-neutral-light" />

                        <div className="space-y-2">
                          <div className="h-3 w-28 animate-pulse rounded bg-slate-neutral-light" />
                          <div className="h-2.5 w-40 animate-pulse rounded bg-slate-neutral-light" />
                        </div>
                      </div>

                      <div className="h-5 w-16 animate-pulse rounded-full bg-slate-neutral-light" />
                    </div>
                  ))}
                </div>

                {/* Mobile Skeleton */}
                <div className="space-y-3 md:hidden">
                  {Array.from({
                    length: 6,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="flex min-h-20 items-center gap-4 rounded-lg bg-white px-4 py-4"
                    >
                      <div className="size-12 shrink-0 animate-pulse rounded-xl bg-slate-neutral-light" />

                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="h-3 w-28 animate-pulse rounded bg-slate-neutral-light" />
                        <div className="h-2.5 w-36 animate-pulse rounded bg-slate-neutral-light" />
                      </div>

                      <div className="h-5 w-14 animate-pulse rounded-full bg-slate-neutral-light" />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Error State */}
            {!isLoading && error && (
              <div className="flex min-h-64 space-y-3 flex-col items-center justify-center rounded-xl border border-[#E7EBF8] bg-white p-6 text-center">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="64" height="64" rx="12" fill="#FFDAD6"/>
                  <path d="M41.75 44.375L38.4375 41.125H25.125C23.2083 41.125 21.5833 40.4583 20.25 39.125C18.9167 37.7917 18.25 36.1667 18.25 34.25C18.25 32.6458 18.7448 31.2188 19.7344 29.9688C20.724 28.7188 22 27.9167 23.5625 27.5625C23.625 27.3958 23.6875 27.2344 23.75 27.0781C23.8125 26.9219 23.875 26.75 23.9375 26.5625L18.75 21.375L20.5 19.625L43.5 42.625L41.75 44.375ZM25.125 38.625H35.9375L25.875 28.5625C25.8333 28.7917 25.8021 29.0104 25.7812 29.2188C25.7604 29.4271 25.75 29.6458 25.75 29.875H25.125C23.9167 29.875 22.8854 30.3021 22.0312 31.1562C21.1771 32.0104 20.75 33.0417 20.75 34.25C20.75 35.4583 21.1771 36.4896 22.0312 37.3438C22.8854 38.1979 23.9167 38.625 25.125 38.625ZM44 39.5625L42.1875 37.8125C42.5417 37.5208 42.8073 37.1823 42.9844 36.7969C43.1615 36.4115 43.25 35.9792 43.25 35.5C43.25 34.625 42.9479 33.8854 42.3438 33.2812C41.7396 32.6771 41 32.375 40.125 32.375H38.25V29.875C38.25 28.1458 37.6406 26.6719 36.4219 25.4531C35.2031 24.2344 33.7292 23.625 32 23.625C31.4375 23.625 30.8958 23.6927 30.375 23.8281C29.8542 23.9635 29.3542 24.1771 28.875 24.4688L27.0625 22.6562C27.7917 22.1562 28.5677 21.776 29.3906 21.5156C30.2135 21.2552 31.0833 21.125 32 21.125C34.4375 21.125 36.5052 21.974 38.2031 23.6719C39.901 25.3698 40.75 27.4375 40.75 29.875C42.1875 30.0417 43.3802 30.6615 44.3281 31.7344C45.276 32.8073 45.75 34.0625 45.75 35.5C45.75 36.3125 45.5938 37.0677 45.2812 37.7656C44.9688 38.4635 44.5417 39.0625 44 39.5625Z" fill="#BA1A1A"/>
                </svg>

                <h2 className="text-taskly-logo text-black">Something Went Wrong</h2>
                <p className="max-w-md text-sm leading-6 text-slate-neutral-medium">
                  We&apos;re having trouble
                  retrieving your project members
                  right now. Please try again in a
                  moment.
                </p>

                <button
                  type="button"
                  onClick={fetchMembers}
                  className="mt-5 flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-container"
                >
                  <RefreshCw size={16} />
                  Retry Connection
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading &&
              !error &&
              members.length === 0 && (
                <div className="flex min-h-52 items-center justify-center rounded-xl border border-[#E7EBF8] bg-white px-6 text-center">
                  <p className="text-sm text-slate-neutral-medium">
                    This project doesn&apos;t have any
                    members yet.
                  </p>
                </div>
              )}

            {/* Members */}
            {!isLoading &&
              !error &&
              members.length > 0 && (
                <>
                  {/* Desktop */}
                  <div className="hidden overflow-hidden rounded-xl border border-[#E7EBF8] bg-white shadow-[0_0_0_4px_rgba(232,237,255,0.35)] md:block">
                    <div className="grid h-14 grid-cols-[1fr_160px] items-center bg-[#F8F9FE] px-8">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-neutral-medium">
                        Member
                      </p>

                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-slate-neutral-medium">
                        Role
                      </p>
                    </div>

                    {members.map((member) => {
                      const name =
                        getMemberName(member);

                      return (
                        <div
                          key={member.member_id}
                          className="grid min-h-23 grid-cols-[1fr_160px] items-center border-t border-[#E8ECF8] px-8"
                        >
                          <div className="flex min-w-0 items-center gap-4">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#DCE5FF] text-sm font-bold text-primary">
                              {getInitials(name)}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-slate-neutral-dark">
                                {name}
                              </p>

                              <p className="truncate text-xs text-slate-neutral-medium">
                                {getMemberEmail(
                                  member,
                                )}
                              </p>
                            </div>
                          </div>

                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${getRoleStyle(member.role)}`}
                            >
                              {formatRole(
                                member.role,
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile */}
                  <div className="space-y-3 md:hidden">
                    {members.map((member) => {
                      const name =
                        getMemberName(member);

                      return (
                        <div
                          key={member.member_id}
                          className="flex min-h-20 items-center gap-4 rounded-lg bg-white px-4 py-4"
                        >
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#DCE5FF] text-sm font-bold text-primary">
                            {getInitials(name)}
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-neutral-dark">
                              {name}
                            </p>

                            <p className="truncate text-xs text-slate-neutral-medium">
                              {getMemberEmail(
                                member,
                              )}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${getRoleStyle(member.role)}`}
                          >
                            {formatRole(
                              member.role,
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Invite Button */}
                  <button
                    type="button"
                    aria-label="Invite Member"
                    className="fixed bottom-20 right-4 z-20 flex size-11 items-center justify-center rounded-xl bg-primary text-white shadow-lg transition hover:bg-primary-container md:hidden"
                  >
                    <UserPlus size={18} />
                  </button>
                </>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}