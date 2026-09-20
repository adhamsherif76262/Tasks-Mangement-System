"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter , usePathname } from "next/navigation";

interface AppSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

type ProjectLink = "Epics" | "Tasks" | "Members" | "Details";

interface ProjectNavigationLink {
  label: ProjectLink;
  section: "epics" | "tasks" | "members" | "edit";
  href: string;
}

function TasklyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 3L20 7.5V16.5L12 21L4 16.5V7.5L12 3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 8L16 10.25V14.75L12 17L8 14.75V10.25L12 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 8V17"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function FolderIcon({
  size = 20,
}: {
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3.5 6.5C3.5 5.67 4.17 5 5 5H9L11 7H19C19.83 7 20.5 7.67 20.5 8.5V17.5C20.5 18.33 19.83 19 19 19H5C4.17 19 3.5 18.33 3.5 17.5V6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StatisticsIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M5 18V12" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 18V9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M13 18V6" stroke="currentColor" strokeWidth="1.7" />
      <path d="M17 18V11" stroke="currentColor" strokeWidth="1.7" />
      <path d="M21 18V4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EpicsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="8"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="15"
        y="3"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="15"
        y="15"
        width="6"
        height="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 11H12C13.66 11 15 9.66 15 8V6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 11C13.66 11 15 12.34 15 14V18"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function TasksIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 7.5L6.5 10L10.5 5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 8H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M4 15.5L6.5 18L10.5 13.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 16H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MembersIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 19C3 15.69 5.69 13 9 13C12.31 13 15 15.69 15 19"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M15 11C17.21 11 19 12.79 19 15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16 19H21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DetailsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 11V16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle
        cx="12"
        cy="7.5"
        r="1"
        fill="currentColor"
      />
    </svg>
  );
}

function ChevronIcon({
  direction = "down",
}: {
  direction?: "up" | "down";
}) {
  return (
    <svg
      className={
        direction === "up"
          ? "-rotate-180"
          : "rotate-0"
      }
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10 5H5C4.45 5 4 5.45 4 6V18C4 18.55 4.45 19 5 19H10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 8L18 12L14 16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12H18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CollapseIconLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 5L8 12L15 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function CollapseIconRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 5L16 12L9 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ProjectLinkIcon({
  link,
}: {
  link: string;
}) {
  switch (link) {
    case "Epics":
      return <EpicsIcon />;

    case "Tasks":
      return <TasksIcon />;

    case "Members":
      return <MembersIcon />;

    case "Details":
      return <DetailsIcon />;
  }
}


interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEYS;

export default function AppSidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: AppSidebarProps) {

  const [projectOpen, setProjectOpen] = useState(true);
  const [projectPopupOpen, setProjectPopupOpen] =  useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const projectRouteMatch = pathname.match(
  /^\/projects\/([^/]+)\/(epics|tasks|members|edit)(?:\/.*)?$/,
);

const activeProjectId = projectRouteMatch?.[1] ?? null;
const activeProjectSection = projectRouteMatch?.[2] ?? null;

const isInsideProject = Boolean(activeProjectId);

  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const projectLinks = activeProjectId
  ? [
      {
        label: "Epics",
        section: "epics",
        href: `/projects/${activeProjectId}/epics`,
      },
      {
        label: "Tasks",
        section: "tasks",
        href: `/projects/${activeProjectId}/tasks`,
      },
      {
        label: "Members",
        section: "members",
        href: `/projects/${activeProjectId}/members`,
      },
      {
        label: "Details",
        section: "edit",
        href: `/projects/${activeProjectId}/edit`,
      },
    ]
  : [];

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const storedSession =
        localStorage.getItem("auth_session") ??
        sessionStorage.getItem("auth_session");

      if (storedSession && BASE_URL && API_KEY) {
        try {
          const session: AuthSession = JSON.parse(storedSession);

          if (session.access_token) {
            await fetch(`${BASE_URL}/auth/v1/logout`, {
              method: "POST",
              headers: {
                apikey: API_KEY,
                Authorization: `Bearer ${session.access_token}`,
                "Content-Type": "application/json",
              },
            });
          }
        } catch (error) {
          console.error("Logout API error:", error);
        }
      }
    } finally {
      // Always clear the local authentication state,
      // even if the API request fails.
      localStorage.removeItem("auth_session");
      localStorage.removeItem("auth_session_expires");
      sessionStorage.removeItem("auth_session");

      router.replace("/login");
    }
  };

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!projectPopupOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(
          event.target as Node,
        )
      ) {
        setProjectPopupOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [projectPopupOpen]);

  useEffect(() => {
    if (!collapsed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProjectPopupOpen(false);
    }
  }, [collapsed]);

  const isMobile = mobileOpen;

  const sidebarContent = (
    <>
      {/* Brand */}

      <div
        className={`
          flex
          h-18
          shrink-0
          items-center
          border-b
          border-[#E2E5EE]
          ${
            isMobile
              ? "justify-between px-5"
              : collapsed
                ? "justify-center"
                : "gap-2 px-5"
          }
        `}
      >
        <div
          className={`
            flex
            items-center
            gap-2
            ${
              !isMobile && collapsed
                ? "justify-center"
                : ""
            }
          `}
        >
          <span className="shrink-0 text-primary">
            <TasklyIcon />
          </span>

          {(isMobile || !collapsed) && (
            <span className="text-taskly-logo text-slate-neutral-dark">
              TASKLY
            </span>
          )}
        </div>

        {isMobile && (
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close menu"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              text-slate-neutral-medium
            "
          >
            <CloseIcon />
          </button>
        )}
      </div>

      <div
        className={`
          flex
          flex-1
          flex-col
          ${
            isMobile
              ? "px-5 pt-3"
              : "px-4 pt-3"
          }
        `}
      >
        {/* Main Navigation */}

        <nav className="flex flex-col gap-1">
          <button
          onClick={()=> router.push("/projects")}
            type="button"
            className={`
              flex
              h-9
              w-full
              items-center
              rounded-sm
              bg-white
              text-primary
              transition-colors
              ${
                collapsed && !isMobile
                  ? "justify-center"
                  : "gap-3 px-2"
              }
            `}
          >
            <FolderIcon size={19} />

            {(isMobile || !collapsed) && (
              <span className="text-body-md">
                Projects
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={()=> router.push("/statistics")}
            className={`
              flex
              h-9
              w-full
              items-center
              rounded-sm
              text-slate-neutral-dark
              transition-colors
              hover:bg-white
              ${
                collapsed && !isMobile
                  ? "justify-center"
                  : "gap-3 px-2"
              }
            `}
          >
            <StatisticsIcon />

            {(isMobile || !collapsed) && (
              <span className="text-body-md">
                My Statistics
              </span>
            )}
          </button>
        </nav>

        {/* Divider */}

        <div className="my-4 h-px bg-[#DEE2EF]" />

        {/* Active Project */}

        {/* {collapsed && !isMobile ? (
          <div
            ref={popupRef}
            className="relative flex justify-center"
          >
            <button
              type="button"
              aria-label="Open active project links"
              aria-expanded={projectPopupOpen}
              onClick={() =>
                setProjectPopupOpen(
                  (previous) => !previous,
                )
              }
              className={`
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-sm
                transition-colors
                ${
                  projectPopupOpen
                    ? "bg-white text-primary"
                    : "text-slate-neutral-dark hover:bg-white"
                }
              `}
            >
              <FolderIcon size={21} />
            </button>

            {projectPopupOpen && (
              <div
                className="
                  absolute
                  left-full
                  top-0
                  z-100
                  w-61.25
                  rounded-r-lg
                  rounded-bl-lg
                  bg-[#D5E2FF]
                  py-2
                  shadow-[0px_8px_24px_rgba(4,27,60,0.08)]
                "
              >
                {projectLinks.map((link) => (
                  <button
                    key={link}
                    type="button"
                    onClick={() =>
                      setProjectPopupOpen(false)
                    }
                    className="
                      flex
                      h-11
                      w-full
                      items-center
                      gap-3
                      px-4
                      text-left
                      text-slate-neutral-dark
                      hover:bg-[#C9D9FC]
                    "
                  >
                    <ProjectLinkIcon link={link} />

                    <span className="text-body-md">
                      {link}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white">
            <button
              type="button"
              onClick={() =>
                setProjectOpen(
                  (previous) => !previous,
                )
              }
              aria-expanded={projectOpen}
              className="
                flex
                h-11
                w-full
                items-center
                gap-3
                bg-[#D5E2FF]
                px-3
                text-left
                text-slate-neutral-dark
              "
            >
              <FolderIcon size={20} />

              <span
                className="
                  min-w-0
                  flex-1
                  truncate
                  text-body-md
                  font-semibold
                "
              >
                Active Project Name
              </span>

              <span className="shrink-0 text-default-placeholder">
                <ChevronIcon
                  direction={
                    projectOpen ? "up" : "down"
                  }
                />
              </span>
            </button>

            {projectOpen && (
              <div className="py-1">
                {projectLinks.map((link) => {
                  const isActive =
                    link === "Epics";

                  return (
                    <button
                      key={link}
                      type="button"
                      onClick={() => {
                        if (isMobile) {
                          onMobileClose?.();
                        }
                      }}
                      className={`
                        mx-1
                        flex
                        h-10
                        w-[calc(100%-8px)]
                        items-center
                        gap-3
                        rounded-full
                        px-3
                        text-left
                        transition-colors
                        ${
                          isActive
                            ? "bg-[#F0F3FF] text-slate-neutral-dark"
                            : "text-slate-neutral-dark hover:bg-[#F5F6FC]"
                        }
                      `}
                    >
                      <ProjectLinkIcon link={link} />

                      <span className="text-body-md">
                        {link}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )} */}


{/* Active Project */}

{isInsideProject &&
  (collapsed && !isMobile ? (
    <div
      ref={popupRef}
      className="relative flex justify-center"
    >
      <button
        type="button"
        aria-label="Open active project links"
        aria-expanded={projectPopupOpen}
        onClick={() =>
          setProjectPopupOpen(
            (previous) => !previous,
          )
        }
        className={`
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-sm
          transition-colors
          ${
            projectPopupOpen
              ? "bg-white text-primary"
              : "text-slate-neutral-dark hover:bg-white"
          }
        `}
      >
        <FolderIcon size={21} />
      </button>

      {projectPopupOpen && (
        <div
          className="
            absolute
            left-full
            ml-4
            top-0
            p-2
            z-100
            w-61.25
            rounded-md
            bg-[#D5E2FF]             
            shadow-[0px_8px_24px_rgba(4,27,60,0.08)]
          "
        >
          {projectLinks.map((link) => (
            <button
              key={link.section}
              type="button"
              onClick={() => {
                setProjectPopupOpen(false);
                router.push(link.href);
              }}
              className={`
                flex
                h-11
                w-full
                items-center
                gap-3
                px-4
                text-left
                text-slate-neutral-dark
                hover:bg-[#C9D9FC]
                ${
                  activeProjectSection === link.section
                    ? "bg-[#C9D9FC]"
                    : ""
                }
              `}
            >
              <ProjectLinkIcon link={link.label} />

              <span className="text-body-md">
                {link.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="overflow-hidden rounded-lg bg-white">
      <button
        type="button"
        onClick={() =>
          setProjectOpen(
            (previous) => !previous,
          )
        }
        aria-expanded={projectOpen}
        className="
          flex
          h-11
          w-full
          items-center
          gap-3
          bg-[#D5E2FF]
          px-3
          text-left
          text-slate-neutral-dark
        "
      >
        <FolderIcon size={20} />

        <span
          className="
            min-w-0
            flex-1
            truncate
            text-body-md
            font-semibold
          "
        >
          Active Project
        </span>

        <span className="shrink-0 text-default-placeholder">
          <ChevronIcon
            direction={
              projectOpen ? "up" : "down"
            }
          />
        </span>
      </button>

      {projectOpen && (
        <div className="py-1">
          {projectLinks.map((link) => {
            const isActive =
              activeProjectSection === link.section;

            return (
              <button
                key={link.section}
                type="button"
                onClick={() => {
                  router.push(link.href);

                  if (isMobile) {
                    onMobileClose?.();
                  }
                }}
                className={`
                  mx-1
                  flex
                  h-10
                  w-[calc(100%-8px)]
                  items-center
                  gap-3
                  rounded-full
                  px-3
                  text-left
                  transition-colors
                  ${
                    isActive
                      ? "bg-[#F0F3FF] text-slate-neutral-dark"
                      : "text-slate-neutral-dark hover:bg-[#F5F6FC]"
                  }
                `}
              >
                <ProjectLinkIcon link={link.label} />

                <span className="text-body-md">
                  {link.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  ))}

        {/* Footer */}

        <div className="mt-auto pb-5">
          {!isMobile && (
            <>
              <div className="mb-3 h-px bg-[#DEE2EF]" />

              <button
                type="button"
                onClick={onToggle}
                className={`
                  flex
                  h-9
                  w-full
                  items-center
                  text-slate-neutral-dark
                  hover:text-primary
                  ${
                    collapsed
                      ? "justify-center"
                      : "gap-2 px-1"
                  }
                `}
              >
                {collapsed && (
                  <CollapseIconRight />
                )}
                {!collapsed && (
                  <CollapseIconLeft />
                )}

                {!collapsed && (
                  <span className="text-body-md">
                    Collapse
                  </span>
                )}
              </button>
            </>
          )}

          <button
           onClick={handleLogout}
        disabled={isLoggingOut}
            type="button"
            className={`
              flex
              h-9
              w-full
              items-center
              text-semantic-error
              hover:opacity-80
              ${
                collapsed && !isMobile
                  ? "justify-center"
                  : "gap-2 px-1"
              }
            `}
          >
            <LogoutIcon />

            {(isMobile || !collapsed) && (
              <span className="text-body-md">
                Logout
              </span>
            )}

              {/* {!collapsed && (
          <span>
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        )} */}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}

      <aside
        className={`
          relative
          z-40
          hidden
          min-h-screen
          shrink-0
          flex-col
          bg-[#F1F3FF]
          text-slate-neutral-dark
          transition-[width]
          duration-200
          ease-in-out
          xlg:flex
          ${collapsed ? "w-20" : "w-60"}
        `}
      >
        {sidebarContent}
      </aside>

      {/* Mobile / Tablet Sidebar */}

      {mobileOpen && (
        <aside
          className="
            fixed
            inset-0
            z-60
            flex
            h-screen
            w-fit
            max-xxs:w-screen
            flex-col
            bg-[#F1F3FF]
            text-slate-neutral-dark
            xlg:hidden
          "
        >
          {sidebarContent}
        </aside>
      )}
    </>
  );
}