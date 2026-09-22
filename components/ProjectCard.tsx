"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// import { EpicsIcon, TasksIcon, MembersIcon, EditIcon } from "@/components/Icons"; // Adjust imports based on your structure

interface ProjectCardProps {
  project: {
    id: string | number;
    name: string;
    description?: string;
    created_at: string;
  };
}

function EditIcon() {
  return (
<svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block"
    >
      {/* Document/File base structure */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      {/* Inset Pen/Edit stroke indicator */}
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}
function EpicsIcon() {
  return (
    <svg
      width="13"
      height="13"
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
      width="13"
      height="13"
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
      width="13"
      height="13"
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
      width="13"
      height="13"
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
function formatCreatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}


export default function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

  // Redirect to project detail page when clicking the card background
  const handleCardClick = () => {
    router.push(`/projects/${project.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex min-h-[150px] w-full flex-col rounded-[5px] bg-white px-4 py-4 text-left transition-shadow hover:shadow-[0_4px_15px_rgba(4,27,60,0.08)]"
    >
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <h2 className="truncate text-[12px] font-semibold leading-4 text-slate-neutral-dark max-w-[85%]">
          {project.name}
        </h2>
      </div>

      {/* Description */}
      <p className="mt-2 line-clamp-3 min-h-12 text-[9px] leading-4 text-slate-neutral-medium">
        {project.description || "No description provided."}
      </p>

      {/* Navigation Sub-Links */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-3">
        <div className="flex items-center gap-4">
          <Link 
            href={`/projects/${project.id}/epics`}
            onClick={(e) => e.stopPropagation()} // Stop background click trigger
            className="flex items-center gap-1 text-[9px] font-semibold text-slate-neutral-dark hover:text-[#0052CC]"
          >
            <EpicsIcon />
            <span>Epics</span>
          </Link>

          <Link 
            href={`/projects/${project.id}/tasks`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[9px] font-semibold text-slate-neutral-dark hover:text-[#0052CC]"
          >
            <TasksIcon />
            <span>Tasks</span>
          </Link>

          <Link 
            href={`/projects/${project.id}/members`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[9px] font-semibold text-slate-neutral-dark hover:text-[#0052CC]"
          >
            <MembersIcon />
            <span>Members</span>
          </Link>

          {/* Matches Screenshot Layout & Icon Group Alignment */}
          <Link 
            href={`/projects/${project.id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[9px] font-semibold text-slate-neutral-dark hover:text-[#0052CC]"
          >
            <EditIcon />
            <span>Edit</span>
          </Link>
        </div>
      </div>

      {/* Footer Meta Area */}
      <div className="mt-4 flex items-center justify-between border-t border-[#F0F1F6] pt-2.5">
        <span className="text-[7px] font-bold uppercase tracking-[0.05em] text-slate-neutral-medium">
          Created At
        </span>
        <span className="text-[8px] text-slate-neutral-dark">
          {formatCreatedAt(project.created_at)}
        </span>
      </div>
    </div>
  );
}
