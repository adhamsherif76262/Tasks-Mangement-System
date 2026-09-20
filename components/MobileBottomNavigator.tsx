import React from 'react'

import { useRouter, usePathname } from "next/navigation";

type IconName =
  | "cube"
  | "folder"
  | "statistics"
  | "epics"
  | "tasks"
  | "members"
  | "details"
  | "chevron-up"
  | "chevron-down"
  | "chevron-left"
  | "menu"
  | "close"
  | "logout";


  
function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "cube":
      return (
        <svg {...commonProps}>
          <path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z" />
          <path d="m4.5 6.5 7.5 4 7.5-4" />
          <path d="M12 10.5V22" />
          <path d="m8.5 4 7.5 4.25v5.5L12 16l-4-2.25v-5.5L8.5 4Z" />
        </svg>
      );

    case "folder":
      return (
        <svg {...commonProps}>
          <path d="M3 6.5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11Z" />
        </svg>
      );

    case "statistics":
      return (
        <svg {...commonProps}>
          <path d="M5 19V10" />
          <path d="M9 19V7" />
          <path d="M13 19v-5" />
          <path d="M17 19V4" />
        </svg>
      );

    case "epics":
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="5" height="5" rx="1" />
          <rect x="16" y="15" width="5" height="5" rx="1" />
          <rect x="16" y="4" width="5" height="5" rx="1" />
          <path d="M8 6.5h8" />
          <path d="M8 8.5c4 0 5 1.5 5 4.5v2" />
          <path d="M13 13h3" />
        </svg>
      );

    case "tasks":
      return (
        <svg {...commonProps}>
          <path d="m3.5 6.5 2 2 3-3" />
          <path d="M11 6.5h10" />
          <path d="m3.5 14 2 2 3-3" />
          <path d="M11 14h10" />
        </svg>
      );

    case "members":
      return (
        <svg {...commonProps}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M17 14c2.3.7 4 2.8 4 6" />
        </svg>
      );

    case "details":
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v6" />
          <path d="M12 7h.01" />
        </svg>
      );

    case "chevron-up":
      return (
        <svg {...commonProps}>
          <path d="m6 14 6-6 6 6" />
        </svg>
      );

    case "chevron-down":
      return (
        <svg {...commonProps}>
          <path d="m6 10 6 6 6-6" />
        </svg>
      );

    case "chevron-left":
      return (
        <svg {...commonProps}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );

    case "menu":
      return (
        <svg {...commonProps}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );

    case "close":
      return (
        <svg {...commonProps}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "logout":
      return (
        <svg {...commonProps}>
          <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
          <path d="M14 8l4 4-4 4" />
          <path d="M18 12H9" />
        </svg>
      );

    default:
      return null;
  }
}

export default function MobileBottomNavigator() {
  
  const router = useRouter();
  const pathname = usePathname();
  const projectRouteMatch = pathname.match(
  /^\/projects\/([^/]+)\/(epics|tasks|members|edit)(?:\/.*)?$/,
);

const activeProjectId = projectRouteMatch?.[1] ?? null;

  const links = activeProjectId ?[
    {
      label: "Epics",
      href: `/projects/${activeProjectId}/epics`,
      icon: "epics" as IconName,
    },
    {
      label: "Tasks",
      href: `/projects/${activeProjectId}/tasks`,
      icon: "tasks" as IconName,
    },
    {
      label: "Projects",
      href: "/projects",
      icon: "folder" as IconName,
    },
    {
      label: "Members",
      href: `/projects/${activeProjectId}/members`,
      icon: "members" as IconName,
    },
    {
      label: "Details",
      href: `/projects/${activeProjectId}/edit`,
      icon: "details" as IconName,
    },
  ]:[
    {
      label: "Projects",
      href: "/projects",
      icon: "folder" as IconName,
    },
  ];

  return (
    <nav
      className={`
        fixed
        inset-x-0
        bottom-0
        z-40
        grid
        h-16
        ${links.length > 1 ? "grid-cols-5" : "grid-cols-1"}
        border-t
        border-slate-neutral-light/60
        bg-surface-low
        sm:hidden
      `}
    >
      {links.map((link) => {
        const isActive = link.label === "" ? pathname.startsWith(link.href) : pathname === link.href;

        return (
          <a
            key={link.label}
            href={link.href}
            className={`
              flex
              flex-col
              items-center
              justify-center
              gap-0.5
              ${
                isActive
                  ? "text-primary"
                  : "text-slate-neutral-medium"
              }
            `}
          >
            <Icon name={link.icon} size={17} />

            <span className="text-[8px]  leading-3">
              {link.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}


