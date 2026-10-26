"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";
import Pagination from "@/components/Pagination";
interface ProjectsListProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
  onCreateProject: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoadingMore: boolean;
}
function PlusIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 8V16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M8 12H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

type PageState = "loading" | "success" | "empty" | "error";


function ProjectsList({
 projects,
  onCreateProject,
  currentPage,
  totalPages,
  onPageChange,
  isLoadingMore,
}: ProjectsListProps) {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[24px] font-bold leading-7 text-slate-neutral-dark max-md:text-[20px]">
            Projects
          </h1>

          <p className="mt-1 text-[11px] leading-4 text-slate-neutral-medium">
            Manage and curate your projects
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateProject}
          className="flex h-9.5 shrink-0 items-center justify-center rounded-[3px] bg-[#0052CC] px-5 text-[11px] font-bold text-white shadow-[0_3px_8px_rgba(0,61,155,0.18)] transition-colors hover:bg-primary max-md:hidden"
        >
          Create New Project
        </button>
      </div>

      {/* Project cards */}
      <div className="grid xl:grid-cols-3 gap-4 grid-cols-2 max-sm:grid-cols-1">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
          />
        ))}

        {/* Add project card */}
        <button
          type="button"
          onClick={onCreateProject}
          className="flex min-h-37.5 flex-col items-center justify-center border border-dashed border-[#D9DEEA] bg-white transition-colors hover:border-primary hover:bg-[#FBFCFF] max-md:hidden"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#EEF3FF] text-primary">
            <PlusIcon />
          </span>

          <span className="mt-3 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-neutral-dark">
            Add Project
          </span>
        </button>
      </div>

      {/* Mobile floating add button */}
      <button
        type="button"
        onClick={onCreateProject}
        aria-label="Create new project"
        className="fixed bottom-18 sm:bottom-3 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#0052CC] text-white shadow-[0_4px_12px_rgba(0,61,155,0.25)] md:hidden"
      >
        <PlusIcon size={18} />
      </button>

{isLoadingMore && (
  <div className="flex justify-center py-6 md:hidden">
    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#D9E2F5] border-t-primary" />
  </div>
)}

      <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={onPageChange}
/>
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
const [projects, setProjects] = useState<Project[]>([]);
const [pageState, setPageState] =
  useState<PageState>("loading");

  const [isMobile, setIsMobile] = useState(false);

const [currentPage, setCurrentPage] =
  useState(1);

const [totalCount, setTotalCount] =
  useState(0);

const [isLoadingMore, setIsLoadingMore] =
  useState(false);

  const PROJECTS_PER_PAGE = 10;
const totalPages = Math.ceil(
  totalCount / PROJECTS_PER_PAGE,
);

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(
      window.matchMedia("(max-width: 767px)")
        .matches,
    );
  };

  checkMobile();

  window.addEventListener(
    "resize",
    checkMobile,
  );

  return () => {
    window.removeEventListener(
      "resize",
      checkMobile,
    );
  };
}, []);



  // const fetchProjects = useCallback(async () => {
  //   setPageState("loading");

  //   try {
  //     const response = await fetch("/api/projects", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!response.ok) {
  //       if (response.status === 401) {
  //         router.replace("/login");
  //         return;
  //       }
  //       throw new Error("Failed to pull down project dataset.");
  //     }

  //     const result = await response.json();

  //     if (!Array.isArray(result)) {
  //       throw new Error("Invalid format received.");
  //     }

  //     setProjects(result);
  //     setPageState(result.length === 0 ? "empty" : "success");
  //   } catch (error) {
  //     console.error("Get projects client parsing error:", error);
  //     setProjects([]);
  //     setPageState("error");
  //   }
  // }, [router]);

  const fetchProjects = useCallback(
  async (
    page: number,
    append = false,
  ) => {
    const offset =
      (page - 1) * PROJECTS_PER_PAGE;

    if (append) {
      setIsLoadingMore(true);
    } else {
      setPageState("loading");
    }

    try {
      const response = await fetch(
        `/api/projects?limit=${PROJECTS_PER_PAGE}&offset=${offset}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        router.replace("/login");
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result?.error ||
            "Failed to load projects",
        );
      }

      if (!Array.isArray(result)) {
        throw new Error(
          "Invalid format received.",
        );
      }

      const contentRange =
        response.headers.get("Content-Range");

      let total = totalCount;

      if (contentRange) {
        const match =
          contentRange.match(/\/(\d+)$/);

        if (match) {
          total = Number(match[1]);
        }
      }

      setTotalCount(total);

      if (append) {
        setProjects((previousProjects) => {
          const existingIds = new Set(
            previousProjects.map(
              (project) => project.id,
            ),
          );

          const newProjects = result.filter(
            (project: Project) =>
              !existingIds.has(project.id),
          );

          return [
            ...previousProjects,
            ...newProjects,
          ];
        });
      } else {
        setProjects(result);
      }

      setPageState(
        result.length === 0 &&
          !append
          ? "empty"
          : "success",
      );
    } catch (error) {
      console.error(
        "Get projects client parsing error:",
        error,
      );

      if (!append) {
        setProjects([]);
        setPageState("error");
      }
    } finally {
      if (append) {
        setIsLoadingMore(false);
      }
    }
  },
  [router, totalCount],
);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProjects(1);
  }, [fetchProjects]);

  useEffect(() => {
  if (!isMobile) {
    return;
  }

  const handleScroll = () => {
    if (
      isLoadingMore ||
      pageState !== "success"
    ) {
      return;
    }

    const hasMore =
      projects.length < totalCount;

    if (!hasMore) {
      return;
    }

    const scrollPosition =
      window.innerHeight +
      window.scrollY;

    const threshold =
      document.documentElement
        .scrollHeight - 400;

    if (scrollPosition >= threshold) {
      const nextPage =
        Math.floor(
          projects.length /
            PROJECTS_PER_PAGE,
        ) + 1;

      fetchProjects(
        nextPage,
        true,
      );
    }
  };

  window.addEventListener(
    "scroll",
    handleScroll,
  );

  return () => {
    window.removeEventListener(
      "scroll",
      handleScroll,
    );
  };
}, [
  isMobile,
  isLoadingMore,
  pageState,
  projects.length,
  totalCount,
  fetchProjects,
]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}/epics`);
  };

  const handleCreateProject = () => {
    router.push("/projects/add");
  };

  const handlePageChange = (page: number) => {
  if (page === currentPage) {
    return;
  }

  setCurrentPage(page);
  fetchProjects(page);
};

  return (
    <div className="flex min-h-screen w-full bg-[#F9F9FF]">
      <main className="flex-1 px-5 py-6 max-md:px-4 max-xxs:px-3">
        {pageState === "loading" && <ProjectsLoadingState />}

        {pageState === "success" && (
          <ProjectsList
            projects={projects}
            onProjectClick={handleProjectClick}
            onCreateProject={handleCreateProject}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            isLoadingMore={isLoadingMore}
          />
        )}

        {pageState === "empty" && (
          <ProjectsEmptyState
            onCreateProject={handleCreateProject}
          />
        )}

        {pageState === "error" && (
          <ProjectsErrorState onRetry={()=>fetchProjects(1)} />
        )}
      </main>
    </div>
  );
}

function ProjectsLoadingState() {
  return (
    <div className="mx-auto w-full max-w-245">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="h-7 w-25 animate-pulse rounded bg-[#E7ECFC]" />

          <div className="mt-2 h-3 w-36 animate-pulse rounded bg-[#EEF1FA]" />
        </div>

        <div className="h-9.5 w-32 animate-pulse rounded bg-[#E5EBFC] max-md:hidden" />
      </div>

      <div className="grid grid-cols-3 gap-4 max-xlg:grid-cols-2 max-md:grid-cols-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectSkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}

function ProjectSkeletonCard() {
  return (
    <div className="min-h-37.5 rounded-[5px] bg-white px-4 py-4">
      <div className="h-20 w-full animate-pulse rounded-[2px] bg-[#EEF1FF] max-md:h-22" />

      <div className="mt-2.5 h-2.5 w-4/5 animate-pulse rounded bg-[#EEF1FF]" />

      <div className="mt-2 h-2.5 w-2/5 animate-pulse rounded bg-[#EEF1FF]" />
    </div>
  );
}

interface ProjectsEmptyStateProps {
  onCreateProject: () => void;
}

function ProjectsEmptyState({
  onCreateProject,
}: ProjectsEmptyStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-145px)] items-center justify-center">
      <div className="flex w-full max-w-105 flex-col items-center text-center">
        <EmptyProjectsIllustration />

        <h1 className="mt-7 text-[23px] font-bold text-slate-neutral-dark max-md:text-[20px]">
          No Projects
        </h1>

        <p className="mt-2 max-w-95 text-[11px] leading-5 text-slate-neutral-medium">
          You don’t have any projects yet. Start by defining
          your first architectural workspace to begin tracking
          tasks and epics.
        </p>

        <button
          type="button"
          onClick={onCreateProject}
          className="mt-6 flex h-9.5 items-center justify-center rounded-[3px] bg-[#0052CC] px-5 text-[11px] font-bold text-white shadow-[0_3px_8px_rgba(0,61,155,0.18)] hover:bg-primary"
        >
          Create New Project
        </button>
      </div>
    </div>
  );
}

interface ProjectsErrorStateProps {
  onRetry: () => void;
}

function ProjectsErrorState({
  onRetry,
}: ProjectsErrorStateProps) {
  return (
    <div className="flex min-h-[calc(100vh-145px)] items-center justify-center">
      <div className="flex w-full max-w-80 flex-col items-center text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#FFD9D5] text-[#D92D20]">
          <ErrorConnectionIcon />
        </div>

        <h1 className="mt-5 text-[13px] font-bold text-slate-neutral-dark">
          Something went wrong
        </h1>

        <p className="mt-1 max-w-65 text-[10px] leading-4 text-slate-neutral-medium">
          We&apos;re having trouble retrieving your projects
          right now. Please try again in a moment.
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-4 flex h-7.5 items-center justify-center rounded-[2px] bg-[#0052CC] px-4 text-[9px] font-bold text-white shadow-[0_3px_8px_rgba(0,61,155,0.18)] hover:bg-primary"
        >
          Retry Connection
        </button>
      </div>
    </div>
  );
}

// interface PaginationProps {
//   currentPage: number;
//   totalPages: number;
//   onPageChange: (page: number) => void;
// }

// interface PaginationButtonProps {
//   children: React.ReactNode;
//   active?: boolean;
//   disabled?: boolean;
//   onClick?: () => void;
// }

// function PaginationButton({
//   children,
//   active = false,
//   disabled = false,
//   onClick,
// }: PaginationButtonProps) {
//   return (
//     <button
//       type="button"
//       disabled={disabled}
//       onClick={onClick}
//       className={`flex h-6 w-6 items-center justify-center rounded-[2px] border text-[8px] font-medium ${
//         active
//           ? "border-primary bg-primary text-white"
//           : "border-[#E1E5EF] bg-white text-slate-neutral-dark"
//       } ${
//         disabled
//           ? "cursor-default opacity-50"
//           : "hover:border-primary hover:text-primary"
//       }`}
//     >
//       {children}
//     </button>
//   );
// }

// function Pagination({
//   currentPage,
//   totalPages,
//   onPageChange,
// }: PaginationProps) {
//   if (totalPages <= 1) {
//     return null;
//   }

//   const getPageNumbers = () => {
//     if (totalPages <= 5) {
//       return Array.from(
//         { length: totalPages },
//         (_, index) => index + 1,
//       );
//     }

//     if (currentPage <= 3) {
//       return [1, 2, 3, 4, "...", totalPages];
//     }

//     if (currentPage >= totalPages - 2) {
//       return [
//         1,
//         "...",
//         totalPages - 3,
//         totalPages - 2,
//         totalPages - 1,
//         totalPages,
//       ];
//     }

//     return [
//       1,
//       "...",
//       currentPage - 1,
//       currentPage,
//       currentPage + 1,
//       "...",
//       totalPages,
//     ];
//   };

//   return (
//     <div className="mt-16 sm:flex sm:justify-end border-t border-[#E5E8F0] pt-5 max-md:mb-20 max-md:mt-8 hidden">
//       <div className="flex items-center gap-1">
//         <PaginationButton
//           disabled={currentPage === 1}
//           onClick={() =>
//             onPageChange(currentPage - 1)
//           }
//         >
//           ‹
//         </PaginationButton>

//         {getPageNumbers().map(
//           (page, index) =>
//             page === "..." ? (
//               <span
//                 key={`ellipsis-${index}`}
//                 className="flex h-6 w-6 items-center justify-center text-[8px] text-slate-neutral-medium"
//               >
//                 ...
//               </span>
//             ) : (
//               <PaginationButton
//                 key={page}
//                 active={page === currentPage}
//                 onClick={() =>
//                   onPageChange(page as number)
//                 }
//               >
//                 {page}
//               </PaginationButton>
//             ),
//         )}

//         <PaginationButton
//           disabled={
//             currentPage === totalPages
//           }
//           onClick={() =>
//             onPageChange(currentPage + 1)
//           }
//         >
//           ›
//         </PaginationButton>
//       </div>
//     </div>
//   );
// }



function EmptyProjectsIllustration() {
  return (
    <div className="relative flex h-44 w-44 items-center justify-center rounded-[4px] bg-[#EEF2FF]">
      <div className="absolute left-0 top-0 h-full w-1.5 rounded-l bg-[#D8E2FB]" />

      <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#D4E0FF] text-primary shadow-[0_4px_12px_rgba(0,61,155,0.06)]">
        <WorkspaceIcon />
      </div>

      <div className="absolute right-7 top-7 flex h-7 w-7 rotate-[-5deg] items-center justify-center rounded-sm bg-white text-primary shadow-sm">
        <SmallCubeIcon />
      </div>

      <div className="absolute bottom-6 left-6 flex h-7 w-7 rotate-[10deg] items-center justify-center rounded-sm bg-white text-[#7B8497] shadow-sm">
        <SmallWarningIcon />
      </div>
    </div>
  );
}

function WorkspaceIcon() {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="6"
        r="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />

      <path
        d="M12 8V14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M12 11L8 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M12 11L16 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SmallCubeIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 4L19 8V16L12 20L5 16V8L12 4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M12 10L19 6"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 10L5 6"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 10V20"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SmallWarningIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 5L20 19H4L12 5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M12 10V14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <circle
        cx="12"
        cy="17"
        r="0.8"
        fill="currentColor"
      />
    </svg>
  );
}

function ErrorConnectionIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M8.5 8.5C7.17 9.4 6.5 10.67 6.5 12C6.5 13.33 7.17 14.6 8.5 15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M15.5 8.5C16.83 9.4 17.5 10.67 17.5 12C17.5 13.33 16.83 14.6 15.5 15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M4 4L20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}