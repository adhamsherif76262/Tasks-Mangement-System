"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
// import { EpicsIcon, TasksIcon, MembersIcon, EditIcon } from "@/components/Icons"; // Adjust imports based on your structure

interface ProjectCardProps {
      project: any; 
//   project: {
//     id: string | number;
//     name: string;
//     description?: string;
//     created_at: string;
//   };
}

function EditIcon() {
  return (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.0165 8.84071C7.17902 8.6782 7.37194 8.54929 7.58427 8.46134C7.7966 8.37339 8.02418 8.32813 8.254 8.32812C8.48383 8.32812 8.7114 8.37339 8.92373 8.46134C9.13607 8.54929 9.32899 8.6782 9.4915 8.84071C9.65402 9.00322 9.78293 9.19615 9.87088 9.40848C9.95883 9.62081 10.0041 9.84839 10.0041 10.0782C10.0041 10.308 9.95883 10.5356 9.87088 10.7479C9.78293 10.9603 9.65402 11.1532 9.4915 11.3157L4.95817 15.8324L1.6665 16.6657L2.4915 13.374L7.0165 8.84071Z" stroke="#003D9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M1.6665 9.58333V4.16667C1.6665 3.25 2.4165 2.5 3.33317 2.5H6.60817C6.88268 2.50142 7.15259 2.57063 7.39392 2.70147C7.63525 2.83231 7.84052 3.02073 7.9915 3.25L8.67484 4.25C8.82582 4.47927 9.03109 4.66769 9.27242 4.79853C9.51375 4.92937 9.78366 4.99858 10.0582 5H16.6665C17.1085 5 17.5325 5.17559 17.845 5.48816C18.1576 5.80072 18.3332 6.22464 18.3332 6.66667V15C18.3332 15.442 18.1576 15.866 17.845 16.1785C17.5325 16.4911 17.1085 16.6667 16.6665 16.6667H8.74984" stroke="#003D9B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

  );
}
function EpicsIcon() {
  return (
<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13 18V15H9V5H7V8H0V0H7V3H13V0H20V8H13V5H11V13H13V10H20V18H13ZM2 2V6V2ZM15 12V16V12ZM15 2V6V2ZM15 6H18V2H15V6ZM15 16H18V12H15V16ZM2 6H5V2H2V6Z" fill="#003D9B"/>
</svg>

  );
}

function TasksIcon() {
  return (
<svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.55 15.075L0 11.525L1.4 10.125L3.525 12.25L7.775 8L9.175 9.425L3.55 15.075ZM3.55 7.075L0 3.525L1.4 2.125L3.525 4.25L7.775 0L9.175 1.425L3.55 7.075ZM11 13.075V11.075H20V13.075H11ZM11 5.075V3.075H20V5.075H11Z" fill="#003D9B"/>
</svg>

  );
}

function MembersIcon() {
  return (
<svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM18 16V13C18 12.2667 17.7958 11.5625 17.3875 10.8875C16.9792 10.2125 16.4 9.63333 15.65 9.15C16.5 9.25 17.3 9.42083 18.05 9.6625C18.8 9.90417 19.5 10.2 20.15 10.55C20.75 10.8833 21.2083 11.2542 21.525 11.6625C21.8417 12.0708 22 12.5167 22 13V16H18ZM8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM18 4C18 5.1 17.6083 6.04167 16.825 6.825C16.0417 7.60833 15.1 8 14 8C13.8167 8 13.5833 7.97917 13.3 7.9375C13.0167 7.89583 12.7833 7.85 12.6 7.8C13.05 7.26667 13.3958 6.675 13.6375 6.025C13.8792 5.375 14 4.7 14 4C14 3.3 13.8792 2.625 13.6375 1.975C13.3958 1.325 13.05 0.733333 12.6 0.2C12.8333 0.116667 13.0667 0.0625 13.3 0.0375C13.5333 0.0125 13.7667 0 14 0C15.1 0 16.0417 0.391667 16.825 1.175C17.6083 1.95833 18 2.9 18 4ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" fill="#003D9B"/>
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
    router.push(`/projects/${project.id}/epics`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer flex min-h-[150px] w-full flex-col rounded-[5px] bg-white px-4 py-4 text-left transition-shadow hover:shadow-[0_4px_15px_rgba(4,27,60,0.08)]"
    >
      {/* Header Area */}
      <div className="flex justify-between items-center">
        <h2 className="truncate text-title-md font-semibold text-slate-neutral-dark leading-4">
          {project.name}
        </h2>
      </div>

      {/* Description */}
      <p className="mt-4 line-clamp-3 min-h-12 text-body-md leading-relaxed text-slate-neutral-medium">
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
            <span className="text-primary">Epics</span>
          </Link>

          <Link 
            href={`/projects/${project.id}/tasks`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[9px] font-semibold text-slate-neutral-dark hover:text-[#0052CC]"
          >
            <TasksIcon />
            <span className="text-primary">Tasks</span>
          </Link>

          <Link 
            href={`/projects/${project.id}/members`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[9px] font-semibold text-slate-neutral-dark hover:text-[#0052CC]"
          >
            <MembersIcon />
            <span className="text-primary">Members</span>
          </Link>

          {/* Matches Screenshot Layout & Icon Group Alignment */}
          <Link 
            href={`/projects/${project.id}/edit`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-[9px] font-semibold text-slate-neutral-dark hover:text-[#0052CC]"
          >
            <EditIcon />
            <span className="text-primary">Edit</span>
          </Link>
        </div>
      </div>

      {/* Footer Meta Area */}
      <div className="mt-4 flex items-center justify-between border-t border-[#F0F1F6] pt-2.5">
        <span className="text-label-xs font-bold uppercase tracking-[0.05em] text-project-cart-createdAt">
          Created At
        </span>
        <span className="text-ghost-button text-project-cart-date">
          {formatCreatedAt(project.created_at)}
        </span>
      </div>
    </div>
  );
}
