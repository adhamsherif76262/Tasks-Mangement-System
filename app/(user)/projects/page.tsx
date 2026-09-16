// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// import AppNavbar from "@/components/AppNavbar";

// export default function ProjectsPage() {
//   const router = useRouter();

//   useEffect(() => {
//     const storedSession =
//       localStorage.getItem("auth_session") ??
//       sessionStorage.getItem("auth_session");

//     if (!storedSession) {
//       router.replace("/login");
//     }
//   }, [router]);

//   return (
//     <div className="flex min-h-screen w-full bg-[#F9F9FF]">
//       {/* Desktop Sidebar will be added here */}

//       <div className="flex min-w-0 flex-1 flex-col">
//         <AppNavbar />

//         <main className="min-h-[calc(100vh-84px)] flex-1">
//           {/* Projects page content will be implemented later */}
//         </main>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import AppNavbar from "@/components/AppNavbar";
// import AppSidebar from "@/components/AppSidebar";

// export default function ProjectsPage() {
//   const router = useRouter();
//   const [sidebarCollapsed, setSidebarCollapsed] =
//     useState(false);

//   useEffect(() => {
//     const storedSession =
//       localStorage.getItem("auth_session") ??
//       sessionStorage.getItem("auth_session");

//     if (!storedSession) {
//       router.replace("/login");
//     }
//   }, [router]);

//   return (
//     <div className="flex min-h-screen w-full bg-[#F9F9FF]">
//       <AppSidebar
//         collapsed={sidebarCollapsed}
//         onToggle={() =>
//           setSidebarCollapsed(
//             (previous) => !previous,
//           )
//         }
//       />

//       <div className="flex min-w-0 flex-1 flex-col">
//         <AppNavbar />

//         <main className="min-h-[calc(100vh-84px)] flex-1">
//           {/* Projects page content will be implemented here */}
//         </main>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// import AppNavbar from "@/components/AppNavbar";
// import AppSidebar from "@/components/AppSidebar";

// export default function ProjectsPage() {
//   const router = useRouter();
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

//   useEffect(() => {
//     const storedSession =
//       localStorage.getItem("auth_session") ??
//       sessionStorage.getItem("auth_session");

//     if (!storedSession) {
//       router.replace("/login");
//     }
//   }, [router]);

//   return (
//     <div className="flex min-h-screen w-full bg-[#F9F9FF]">
//       <AppSidebar
//         collapsed={sidebarCollapsed}
//         onToggle={() => setSidebarCollapsed((previous) => !previous)}
//       />

//       <div className="flex min-w-0 flex-1 flex-col">
//         <AppNavbar />

//         <main className="min-h-[calc(100vh-84px)] flex-1">
//           {/* Projects page content will be implemented here */}
//         </main>
//       </div>
//     </div>
//   );
// }






"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import MobileBottomNavigator from "@/components/MobileBottomNavigator";

export default function ProjectsPage() {
  const router = useRouter();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const storedSession =
      localStorage.getItem("auth_session") ??
      sessionStorage.getItem("auth_session");

    if (!storedSession) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen w-full bg-surface-low">
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((previous) => !previous)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppNavbar
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-84px)] flex-1">
          {/* Projects page content will be implemented here */}
          {/* <MobileBottomNavigator /> */}
        </main>
      </div>
    </div>
  );
}









// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";

// interface AuthSession {
//   access_token: string;
//   token_type: string;
//   expires_in: number;
//   expires_at: number;
//   refresh_token: string;
//   user?: {
//     id: string;
//     email: string;
//     role: string;
//     user_metadata?: {
//       name?: string;
//       job_title?: string;
//     };
//   };
// }

// interface UserResponse {
//   id: string;
//   email?: string;
//   user_metadata?: {
//     name?: string;
//     job_title?: string;
//   };
// }

// interface CurrentUser {
//   name: string;
//   jobTitle: string;
// }

// type IconName =
//   | "cube"
//   | "folder"
//   | "statistics"
//   | "epics"
//   | "tasks"
//   | "members"
//   | "details"
//   | "chevron-up"
//   | "chevron-down"
//   | "chevron-left"
//   | "menu"
//   | "close"
//   | "logout";

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEYS;

// const projectLinks = [
//   {
//     label: "Epics",
//     href: "/projects/epics",
//     icon: "epics" as IconName,
//   },
//   {
//     label: "Tasks",
//     href: "/projects/tasks",
//     icon: "tasks" as IconName,
//   },
//   {
//     label: "Members",
//     href: "/projects/members",
//     icon: "members" as IconName,
//   },
//   {
//     label: "Details",
//     href: "/projects/details",
//     icon: "details" as IconName,
//   },
// ];

// const primaryLinks = [
//   {
//     label: "Projects",
//     href: "/projects",
//     icon: "folder" as IconName,
//   },
//   {
//     label: "My Statistics",
//     href: "/statistics",
//     icon: "statistics" as IconName,
//   },
// ];

// function Icon({
//   name,
//   size = 20,
//   strokeWidth = 1.8,
// }: {
//   name: IconName;
//   size?: number;
//   strokeWidth?: number;
// }) {
//   const commonProps = {
//     width: size,
//     height: size,
//     viewBox: "0 0 24 24",
//     fill: "none",
//     stroke: "currentColor",
//     strokeWidth,
//     strokeLinecap: "round" as const,
//     strokeLinejoin: "round" as const,
//     "aria-hidden": true,
//   };

//   switch (name) {
//     case "cube":
//       return (
//         <svg {...commonProps}>
//           <path d="m12 2 8 4.5v11L12 22l-8-4.5v-11L12 2Z" />
//           <path d="m4.5 6.5 7.5 4 7.5-4" />
//           <path d="M12 10.5V22" />
//           <path d="m8.5 4 7.5 4.25v5.5L12 16l-4-2.25v-5.5L8.5 4Z" />
//         </svg>
//       );

//     case "folder":
//       return (
//         <svg {...commonProps}>
//           <path d="M3 6.5a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11Z" />
//         </svg>
//       );

//     case "statistics":
//       return (
//         <svg {...commonProps}>
//           <path d="M5 19V10" />
//           <path d="M9 19V7" />
//           <path d="M13 19v-5" />
//           <path d="M17 19V4" />
//         </svg>
//       );

//     case "epics":
//       return (
//         <svg {...commonProps}>
//           <rect x="3" y="4" width="5" height="5" rx="1" />
//           <rect x="16" y="15" width="5" height="5" rx="1" />
//           <rect x="16" y="4" width="5" height="5" rx="1" />
//           <path d="M8 6.5h8" />
//           <path d="M8 8.5c4 0 5 1.5 5 4.5v2" />
//           <path d="M13 13h3" />
//         </svg>
//       );

//     case "tasks":
//       return (
//         <svg {...commonProps}>
//           <path d="m3.5 6.5 2 2 3-3" />
//           <path d="M11 6.5h10" />
//           <path d="m3.5 14 2 2 3-3" />
//           <path d="M11 14h10" />
//         </svg>
//       );

//     case "members":
//       return (
//         <svg {...commonProps}>
//           <circle cx="9" cy="8" r="3" />
//           <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
//           <path d="M16 5.5a3 3 0 0 1 0 5.8" />
//           <path d="M17 14c2.3.7 4 2.8 4 6" />
//         </svg>
//       );

//     case "details":
//       return (
//         <svg {...commonProps}>
//           <circle cx="12" cy="12" r="9" />
//           <path d="M12 10v6" />
//           <path d="M12 7h.01" />
//         </svg>
//       );

//     case "chevron-up":
//       return (
//         <svg {...commonProps}>
//           <path d="m6 14 6-6 6 6" />
//         </svg>
//       );

//     case "chevron-down":
//       return (
//         <svg {...commonProps}>
//           <path d="m6 10 6 6 6-6" />
//         </svg>
//       );

//     case "chevron-left":
//       return (
//         <svg {...commonProps}>
//           <path d="m15 18-6-6 6-6" />
//         </svg>
//       );

//     case "menu":
//       return (
//         <svg {...commonProps}>
//           <path d="M4 7h16" />
//           <path d="M4 12h16" />
//           <path d="M4 17h16" />
//         </svg>
//       );

//     case "close":
//       return (
//         <svg {...commonProps}>
//           <path d="m6 6 12 12" />
//           <path d="m18 6-12 12" />
//         </svg>
//       );

//     case "logout":
//       return (
//         <svg {...commonProps}>
//           <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
//           <path d="M14 8l4 4-4 4" />
//           <path d="M18 12H9" />
//         </svg>
//       );

//     default:
//       return null;
//   }
// }

// function getAuthSession(): AuthSession | null {
//   if (typeof window === "undefined") {
//     return null;
//   }

//   const storedSession =
//     localStorage.getItem("auth_session") ||
//     sessionStorage.getItem("auth_session");

//   if (!storedSession) {
//     return null;
//   }

//   try {
//     return JSON.parse(storedSession) as AuthSession;
//   } catch {
//     localStorage.removeItem("auth_session");
//     sessionStorage.removeItem("auth_session");

//     return null;
//   }
// }

// function getInitials(name: string) {
//   const normalizedName = name.trim().replace(/\s+/g, " ");

//   if (!normalizedName) {
//     return "--";
//   }

//   const parts = normalizedName.split(" ");

//   if (parts.length === 1) {
//     return parts[0].slice(0, 2).toUpperCase();
//   }

//   return (
//     `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`
//   ).toUpperCase();
// }

// function UserAvatar({ name }: { name: string }) {
//   const initials = useMemo(() => getInitials(name), [name]);

//   return (
//     <div
//       className="
//         flex
//         size-12
//         shrink-0
//         items-center
//         justify-center
//         rounded-lg
//         bg-primary-container
//         text-white
//         text-primary-button-lg
//         font-semibold
//       "
//       aria-label={`${name} avatar`}
//     >
//       {initials}
//     </div>
//   );
// }

// function TasklyLogo({
//   collapsed = false,
// }: {
//   collapsed?: boolean;
// }) {
//   return (
//     <div
//       className={`
//         flex
//         items-center
//         gap-2
//         text-slate-neutral-dark
//         ${collapsed ? "justify-center" : ""}
//       `}
//     >
//       <span className="text-primary">
//         <Icon name="cube" size={20} strokeWidth={1.9} />
//       </span>

//       {!collapsed && (
//         <span className="text-taskly-logo">
//           TASKLY
//         </span>
//       )}
//     </div>
//   );
// }

// function ProjectAccordion({
//   open,
//   onToggle,
//   collapsed = false,
//   onProjectLinkClick,
// }: {
//   open: boolean;
//   onToggle: () => void;
//   collapsed?: boolean;
//   onProjectLinkClick?: () => void;
// }) {
//   const [showPopup, setShowPopup] = useState(false);
//   const popupRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!showPopup) {
//       return;
//     }

//     const handleOutsideClick = (event: MouseEvent) => {
//       if (
//         popupRef.current &&
//         !popupRef.current.contains(event.target as Node)
//       ) {
//         setShowPopup(false);
//       }
//     };

//     document.addEventListener(
//       "mousedown",
//       handleOutsideClick
//     );

//     return () => {
//       document.removeEventListener(
//         "mousedown",
//         handleOutsideClick
//       );
//     };
//   }, [showPopup]);

//   if (collapsed) {
//     return (
//       <div
//         ref={popupRef}
//         className="relative flex justify-center"
//       >
//         <button
//           type="button"
//           onClick={() => setShowPopup((previous) => !previous)}
//           aria-label="Open active project links"
//           aria-expanded={showPopup}
//           className="
//             flex
//             size-10
//             items-center
//             justify-center
//             rounded-md
//             text-slate-neutral-dark
//             transition-colors
//             hover:bg-white
//           "
//         >
//           <Icon name="folder" size={21} />
//         </button>

//         {showPopup && (
//           <div
//             className="
//               absolute
//               left-[calc(100%+16px)]
//               top-1/2
//               z-50
//               w-61
//               -translate-y-1/2
//               overflow-hidden
//               rounded-lg
//               bg-surface-highest
//               shadow-[0px_8px_24px_0px_#041B3C1A]
//             "
//           >
//             <div className="flex flex-col gap-1 p-2">
//               {projectLinks.map((link) => (
//                 <a
//                   key={link.label}
//                   href={link.href}
//                   onClick={() => {
//                     setShowPopup(false);
//                     onProjectLinkClick?.();
//                   }}
//                   className="
//                     flex
//                     items-center
//                     gap-3
//                     rounded-md
//                     px-3
//                     py-2.5
//                     text-slate-neutral-dark
//                     transition-colors
//                     hover:bg-white/60
//                   "
//                 >
//                   <Icon name={link.icon} size={21} />

//                   <span className="text-primary-button-lg">
//                     {link.label}
//                   </span>
//                 </a>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-hidden rounded-lg bg-white">
//       <button
//         type="button"
//         onClick={onToggle}
//         aria-expanded={open}
//         className="
//           flex
//           h-14
//           w-full
//           items-center
//           gap-4
//           bg-surface-highest
//           px-4
//           text-left
//           text-slate-neutral-dark
//           transition-colors
//           hover:bg-[#D1DEFC]
//         "
//       >
//         <Icon name="folder" size={22} />

//         <span className="min-w-0 flex-1 truncate text-title-md font-semibold">
//           Active Project Name
//         </span>

//         <Icon
//           name={open ? "chevron-up" : "chevron-down"}
//           size={21}
//           strokeWidth={2}
//         />
//       </button>

//       {open && (
//         <div className="py-2">
//           {projectLinks.map((link) => (
//             <a
//               key={link.label}
//               href={link.href}
//               onClick={onProjectLinkClick}
//               className="
//                 mx-2
//                 flex
//                 items-center
//                 gap-4
//                 rounded-full
//                 px-3
//                 py-2.5
//                 text-slate-neutral-dark
//                 transition-colors
//                 hover:bg-surface-low
//               "
//             >
//               <Icon name={link.icon} size={21} />

//               <span className="text-title-md">
//                 {link.label}
//               </span>
//             </a>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function Sidebar({
//   collapsed,
//   onCollapse,
//   activeProjectOpen,
//   onActiveProjectToggle,
//   mobile = false,
//   onCloseMobile,
// }: {
//   collapsed: boolean;
//   onCollapse?: () => void;
//   activeProjectOpen: boolean;
//   onActiveProjectToggle: () => void;
//   mobile?: boolean;
//   onCloseMobile?: () => void;
// }) {
//   return (
//     <aside
//       className={`
//         flex
//         h-full
//         flex-col
//         bg-surface-low
//         text-slate-neutral-dark
//         ${mobile ? "w-full" : collapsed ? "w-20" : "w-46"}
//       `}
//     >
//       <div
//         className={`
//           flex
//           shrink-0
//           items-center
//           ${collapsed ? "justify-center px-2" : "px-4"}
//           py-5
//         `}
//       >
//         <TasklyLogo collapsed={collapsed} />

//         {mobile && (
//           <button
//             type="button"
//             onClick={onCloseMobile}
//             aria-label="Close navigation menu"
//             className="
//               ml-auto
//               flex
//               size-9
//               items-center
//               justify-center
//               rounded-md
//               text-slate-neutral-medium
//               hover:bg-white
//             "
//           >
//             <Icon name="close" size={19} />
//           </button>
//         )}
//       </div>

//       <div
//         className={`
//           border-t
//           border-slate-neutral-light/40
//           ${collapsed ? "mx-3" : "mx-4"}
//         `}
//       />

//       <nav
//         className={`
//           flex
//           flex-1
//           flex-col
//           ${collapsed ? "px-2" : "px-4"}
//           pt-4
//         `}
//       >
//         <div className="flex flex-col gap-1">
//           {primaryLinks.map((link, index) => {
//             const isActive = index === 0;

//             return (
//               <a
//                 key={link.label}
//                 href={link.href}
//                 onClick={onCloseMobile}
//                 title={collapsed ? link.label : undefined}
//                 className={`
//                   flex
//                   h-10
//                   items-center
//                   gap-3
//                   rounded-md
//                   px-3
//                   text-slate-neutral-dark
//                   transition-colors
//                   ${
//                     isActive
//                       ? "bg-white text-primary"
//                       : "hover:bg-white/70"
//                   }
//                   ${collapsed ? "justify-center px-0" : ""}
//                 `}
//               >
//                 <Icon name={link.icon} size={20} />

//                 {!collapsed && (
//                   <span className="text-body-md">
//                     {link.label}
//                   </span>
//                 )}
//               </a>
//             );
//           })}
//         </div>

//         <div
//           className={`
//             my-4
//             border-t
//             border-slate-neutral-light/50
//             ${collapsed ? "mx-1" : ""}
//           `}
//         />

//         <ProjectAccordion
//           collapsed={collapsed}
//           open={activeProjectOpen}
//           onToggle={onActiveProjectToggle}
//           onProjectLinkClick={onCloseMobile}
//         />
//       </nav>

//       <div
//         className={`
//           shrink-0
//           border-t
//           border-slate-neutral-light/40
//           ${collapsed ? "mx-3" : "mx-4"}
//         `}
//       />

//       <div
//         className={`
//           flex
//           flex-col
//           gap-1
//           ${collapsed ? "px-2" : "px-4"}
//           py-4
//         `}
//       >
//         {!mobile && (
//           <button
//             type="button"
//             onClick={onCollapse}
//             title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
//             className={`
//               flex
//               h-10
//               items-center
//               gap-3
//               rounded-md
//               px-3
//               text-slate-neutral-dark
//               transition-colors
//               hover:bg-white/70
//               ${collapsed ? "justify-center px-0" : ""}
//             `}
//           >
//             <Icon
//               name="chevron-left"
//               size={21}
//             />

//             {!collapsed && (
//               <span className="text-body-md">
//                 Collapse
//               </span>
//             )}
//           </button>
//         )}

//         <button
//           type="button"
//           className={`
//             flex
//             h-10
//             items-center
//             gap-3
//             rounded-md
//             px-3
//             text-semantic-error
//             transition-colors
//             hover:bg-semantic-error/5
//             ${collapsed ? "justify-center px-0" : ""}
//           `}
//         >
//           <Icon name="logout" size={20} />

//           {!collapsed && (
//             <span className="text-body-md">
//               Logout
//             </span>
//           )}
//         </button>
//       </div>
//     </aside>
//   );
// }

// function Navbar({
//   user,
//   onMenuClick,
// }: {
//   user: CurrentUser;
//   onMenuClick: () => void;
// }) {
//   return (
//     <header
//       className="
//         sticky
//         top-0
//         z-30
//         flex
//         h-20
//         shrink-0
//         items-center
//         justify-between
//         border-b
//         border-slate-neutral-light/50
//         bg-surface-low
//         px-4
//         sm:px-6
//         lg:px-8
//       "
//     >
//       <button
//         type="button"
//         onClick={onMenuClick}
//         aria-label="Open navigation menu"
//         className="
//           flex
//           size-10
//           items-center
//           justify-center
//           rounded-md
//           text-slate-neutral-dark
//           hover:bg-white
//           xlg:hidden
//         "
//       >
//         <Icon name="menu" size={20} />
//       </button>
//       <span className="xlg:hidden text-taskly-logo">TASKLY</span>
//       <div className="ml-auto flex min-w-0 items-center gap-3">
//         <div
//           className="
//             hidden
//             min-w-0
//             text-right
//             sm:block
//           "
//         >
//           <p
//             className="
//               max-w-48
//               truncate
//               text-primary-button-lg
//               font-semibold
//               text-slate-neutral-dark
//               lg:max-w-64
//             "
//           >
//             {user.name}
//           </p>

//           <p
//             className="
//               mt-0.5
//               truncate
//               text-label-sm
//               uppercase
//               text-primary
//             "
//           >
//             {user.jobTitle}
//           </p>
//         </div>

//         <UserAvatar name={user.name} />
//       </div>
//     </header>
//   );
// }

// function MobileBottomNavigation() {
//   const links = [
//     {
//       label: "Epics",
//       href: "/projects/epics",
//       icon: "epics" as IconName,
//     },
//     {
//       label: "Tasks",
//       href: "/projects/tasks",
//       icon: "tasks" as IconName,
//     },
//     {
//       label: "Projects",
//       href: "/projects",
//       icon: "folder" as IconName,
//     },
//     {
//       label: "Members",
//       href: "/projects/members",
//       icon: "members" as IconName,
//     },
//     {
//       label: "Details",
//       href: "/projects/details",
//       icon: "details" as IconName,
//     },
//   ];

//   return (
//     <nav
//       className="
//         fixed
//         inset-x-0
//         bottom-0
//         z-40
//         grid
//         h-16
//         grid-cols-5
//         border-t
//         border-slate-neutral-light/60
//         bg-surface-low
//         md:hidden
//       "
//     >
//       {links.map((link) => {
//         const isActive = link.label === "Projects";

//         return (
//           <a
//             key={link.label}
//             href={link.href}
//             className={`
//               flex
//               flex-col
//               items-center
//               justify-center
//               gap-0.5
//               ${
//                 isActive
//                   ? "text-primary"
//                   : "text-slate-neutral-medium"
//               }
//             `}
//           >
//             <Icon name={link.icon} size={17} />

//             <span className="text-[8px] leading-3">
//               {link.label}
//             </span>
//           </a>
//         );
//       })}
//     </nav>
//   );
// }

// function MobileSidebar({
//   open,
//   onClose,
//   activeProjectOpen,
//   onActiveProjectToggle,
// }: {
//   open: boolean;
//   onClose: () => void;
//   activeProjectOpen: boolean;
//   onActiveProjectToggle: () => void;
// }) {
//   if (!open) {
//     return null;
//   }

//   return (
//     <div className="fixed inset-0 z-50 xlg:hidden w-full">
      
//       <button
//         type="button"
//         aria-label="Close navigation menu"
//         onClick={onClose}
//         className="
//           absolute
//           inset-0
//           bg-slate-neutral-dark/30
//         "
//       />

//       <div
//         className="
//           relative
//           h-full
//           w-fit
//           max-xxs:w-full
//           bg-surface-low
//           shadow-[8px_0px_30px_0px_#041B3C1A]
//         "
//       >
//         <Sidebar
//           collapsed={false}
//           activeProjectOpen={activeProjectOpen}
//           onActiveProjectToggle={onActiveProjectToggle}
//           mobile
//           onCloseMobile={onClose}
//         />
//       </div>
//     </div>
//   );
// }

// function LoadingScreen() {
//   return (
//     <main
//       className="
//         flex
//         min-h-screen
//         items-center
//         justify-center
//         bg-surface-low
//       "
//     >
//       <div className="flex flex-col items-center gap-4">
//         <div
//           className="
//             size-8
//             animate-spin
//             rounded-full
//             border-2
//             border-primary/20
//             border-t-primary
//           "
//         />

//         <p className="text-body-md text-slate-neutral-medium">
//           Loading your workspace...
//         </p>
//       </div>
//     </main>
//   );
// }

// function ErrorScreen({
//   message,
//   onRetry,
//   onLogin,
// }: {
//   message: string;
//   onRetry: () => void;
//   onLogin: () => void;
// }) {
//   return (
//     <main
//       className="
//         flex
//         min-h-screen
//         items-center
//         justify-center
//         bg-surface-low
//         px-6
//       "
//     >
//       <div
//         className="
//           w-full
//           max-w-md
//           rounded-lg
//           bg-white
//           p-8
//           text-center
//           shadow-[0px_24px_48px_0px_#041B3C0F]
//         "
//       >
//         <div
//           className="
//             mx-auto
//             mb-5
//             flex
//             size-12
//             items-center
//             justify-center
//             rounded-full
//             bg-error-input-bg
//             text-semantic-error
//           "
//         >
//           <Icon name="details" size={24} />
//         </div>

//         <h1 className="text-headline-lg text-slate-neutral-dark">
//           Unable to load your account
//         </h1>

//         <p className="mt-3 text-body-md text-slate-neutral-medium">
//           {message}
//         </p>

//         <div className="mt-6 flex flex-col gap-3">
//           <button
//             type="button"
//             onClick={onRetry}
//             className="
//               rounded-lg
//               bg-primary
//               px-5
//               py-3
//               text-primary-button-lg
//               font-semibold
//               text-white
//               hover:bg-primary-container
//             "
//           >
//             Try Again
//           </button>

//           <button
//             type="button"
//             onClick={onLogin}
//             className="
//               rounded-lg
//               px-5
//               py-3
//               text-primary-button-lg
//               font-semibold
//               text-primary
//               hover:bg-surface-low
//             "
//           >
//             Return to Login
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default function ProjectsPage() {
//   const router = useRouter();

//   const [user, setUser] = useState<CurrentUser | null>(
//     null
//   );

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const [sidebarCollapsed, setSidebarCollapsed] =
//     useState(false);

//   const [mobileMenuOpen, setMobileMenuOpen] =
//     useState(false);

//   const [activeProjectOpen, setActiveProjectOpen] =
//     useState(true);

//   const loadUser = async () => {
//     setLoading(true);
//     setError("");

//     const session = getAuthSession();

//     if (!session?.access_token) {
//       router.replace("/login");
//       return;
//     }

//     if (!BASE_URL || !API_KEY) {
//       setError(
//         "The application API configuration is missing."
//       );
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${BASE_URL}/auth/v1/user`,
//         {
//           method: "GET",
//           headers: {
//             apikey: API_KEY,
//             Authorization: `Bearer ${session.access_token}`,
//             "Content-Type": "application/json",
//           },
//           cache: "no-store",
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             result?.error_description ||
//             "Your session could not be verified."
//         );
//       }

//       const userResponse =
//         result as UserResponse;

//       const name =
//         userResponse.user_metadata?.name?.trim() ||
//         session.user?.user_metadata?.name?.trim();

//       const jobTitle =
//         userResponse.user_metadata?.job_title?.trim() ||
//         session.user?.user_metadata?.job_title?.trim();

//       if (!name) {
//         throw new Error(
//           "Your account does not contain a user name."
//         );
//       }

//       setUser({
//         name,
//         jobTitle: jobTitle || "User",
//       });
//     } catch (requestError) {
//       console.error(
//         "Failed to retrieve authenticated user:",
//         requestError
//       );

//       setError(
//         requestError instanceof Error
//           ? requestError.message
//           : "Something went wrong while loading your account."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     loadUser();
//   },[]);

//   const handleReturnToLogin = () => {
//     localStorage.removeItem("auth_session");
//     localStorage.removeItem("auth_session_expires");
//     sessionStorage.removeItem("auth_session");

//     router.replace("/login");
//   };

//   if (loading) {
//     return <LoadingScreen />;
//   }

//   if (!user) {
//     return (
//       <ErrorScreen
//         message={
//           error ||
//           "We could not retrieve your account information."
//         }
//         onRetry={loadUser}
//         onLogin={handleReturnToLogin}
//       />
//     );
//   }

//   return (
//     <main className="min-h-screen bg-surface-low">
//       <div className="flex min-h-screen">
//         {/* Desktop Sidebar */}
//         <div className="hidden shrink-0 xlg:block">
//           <Sidebar
//             collapsed={sidebarCollapsed}
//             onCollapse={() =>
//               setSidebarCollapsed(
//                 (previous) => !previous
//               )
//             }
//             activeProjectOpen={
//               activeProjectOpen
//             }
//             onActiveProjectToggle={() =>
//               setActiveProjectOpen(
//                 (previous) => !previous
//               )
//             }
//           />
//         </div>

//         {/* Main Application Area */}
//         <div className="flex min-w-0 flex-1 flex-col">
//           <Navbar
//             user={user}
//             onMenuClick={() =>
//               setMobileMenuOpen(true)
//             }
//           />

//           <section
//             className="
//               flex-1
//               px-4
//               py-6
//               pb-24
//               sm:px-6
//               md:pb-6
//               lg:px-8
//             "
//           >
//             {/* Projects page content will be implemented here. */}
//           </section>
//         </div>
//       </div>

//       {/* Tablet / Mobile Sidebar */}
//       <MobileSidebar
//         open={mobileMenuOpen}
//         onClose={() => setMobileMenuOpen(false)}
//         activeProjectOpen={
//           activeProjectOpen
//         }
//         onActiveProjectToggle={() =>
//           setActiveProjectOpen(
//             (previous) => !previous
//           )
//         }
//       />

//       {/* Mobile Bottom Navigation */}
//       <MobileBottomNavigation />
//     </main>
//   );
// }