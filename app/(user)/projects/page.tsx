"use client";

interface ProjectsListProps {
  projects: Project[];
  onProjectClick: (projectId: string) => void;
  onCreateProject: () => void;
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

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/ProjectCard";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

type PageState = "loading" | "success" | "empty" | "error";


function ProjectsList({
  projects,
  onProjectClick,
  onCreateProject,
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
      <div className="grid grid-cols-3 gap-4 max-xlg:grid-cols-2 max-md:grid-cols-1">
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
        className="fixed bottom-13 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-[5px] bg-[#0052CC] text-white shadow-[0_4px_12px_rgba(0,61,155,0.25)] xlg:hidden"
      >
        <PlusIcon size={18} />
      </button>

      <Pagination />
    </div>
  );
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [pageState, setPageState] = useState<PageState>("loading");

  const fetchProjects = useCallback(async () => {
    setPageState("loading");

    try {
      const response = await fetch("/api/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        throw new Error("Failed to pull down project dataset.");
      }

      const result = await response.json();

      if (!Array.isArray(result)) {
        throw new Error("Invalid format received.");
      }

      setProjects(result);
      setPageState(result.length === 0 ? "empty" : "success");
    } catch (error) {
      console.error("Get projects client parsing error:", error);
      setProjects([]);
      setPageState("error");
    }
  }, [router]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}/epics`);
  };

  const handleCreateProject = () => {
    router.push("/projects/add");
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
          />
        )}

        {pageState === "empty" && (
          <ProjectsEmptyState
            onCreateProject={handleCreateProject}
          />
        )}

        {pageState === "error" && (
          <ProjectsErrorState onRetry={fetchProjects} />
        )}
      </main>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

interface ProjectCardLinkProps {
  icon: React.ReactNode;
  label: string;
}

function ProjectCardLink({
  icon,
  label,
}: ProjectCardLinkProps) {
  return (
    <span className="flex items-center gap-0.5 text-[7px] font-semibold text-primary">
      {icon}
      {label}
    </span>
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

function Pagination() {
  return (
    <div className="mt-16 flex justify-end border-t border-[#E5E8F0] pt-5 max-md:mb-20 max-md:mt-8">
      <div className="flex items-center gap-1">
        <PaginationButton disabled>
          ‹
        </PaginationButton>

        <PaginationButton active>
          1
        </PaginationButton>

        <PaginationButton>
          2
        </PaginationButton>

        <PaginationButton>
          3
        </PaginationButton>

        <PaginationButton>
          ...
        </PaginationButton>

        <PaginationButton>
          15
        </PaginationButton>

        <PaginationButton>
          ›
        </PaginationButton>
      </div>
    </div>
  );
}

interface PaginationButtonProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}

function PaginationButton({
  children,
  active = false,
  disabled = false,
}: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex h-6 w-6 items-center justify-center rounded-[2px] border text-[8px] font-medium ${
        active
          ? "border-primary bg-primary text-white"
          : "border-[#E1E5EF] bg-white text-slate-neutral-dark"
      } ${
        disabled
          ? "cursor-default opacity-50"
          : "hover:border-primary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

function FolderIcon({ size = 17 }: { size?: number }) {
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