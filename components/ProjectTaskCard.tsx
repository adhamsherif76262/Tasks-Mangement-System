
// "use client";

// import { AlertTriangle, CalendarDays, CheckCircle2 } from "lucide-react";
// import type { ProjectTask } from "@/app/hooks/useProjectTasks";

// interface ProjectTaskCardProps {
//   task: ProjectTask;
//   mobile?: boolean;
// }

// const STATUS_STYLES: Record<string, string> = {
//   TO_DO: "bg-[#DCE6FF] text-[#09254D]",
//   IN_PROGRESS: "bg-[#E3EEFF] text-[#0047B8]",
//   BLOCKED: "bg-semantic-error-bg text-semantic-error",
//   IN_REVIEW: "bg-[#DCE6FF] text-[#09254D]",
//   REOPENED: "bg-[#C8171D] text-white",
//   READY_FOR_PRODUCTION: "bg-[#005638] text-white",
//   READY_FOR_QA: "bg-[#0754D9] text-white",
//   DONE: "bg-[#75F0B7] text-[#005638]",
// };

// const STATUS_LABELS: Record<string, string> = {
//   TO_DO: "TO DO",
//   IN_PROGRESS: "IN PROGRESS",
//   BLOCKED: "BLOCKED",
//   IN_REVIEW: "IN REVIEW",
//   REOPENED: "REOPENED",
//   READY_FOR_PRODUCTION: "READY FOR PROD",
//   READY_FOR_QA: "READY FOR QA",
//   DONE: "DONE",
// };

// function formatDueDate(value: string | null) {
//   if (!value) return null;

//   const date = new Date(value);
//   if (Number.isNaN(date.getTime())) return null;

//   const today = new Date();
//   const isToday =
//     date.getFullYear() === today.getFullYear() &&
//     date.getMonth() === today.getMonth() &&
//     date.getDate() === today.getDate();

//   if (isToday) return "TODAY";

//   return date
//     .toLocaleDateString("en-US", { month: "short", day: "numeric" })
//     .toUpperCase();
// }

// function getInitials(name?: string | null) {
//   if (!name?.trim()) return "U";

//   return name
//     .trim()
//     .split(/\s+/)
//     .map((part) => part[0])
//     .join("")
//     .slice(0, 2)
//     .toUpperCase();
// }

// export default function ProjectTaskCard({
//   task,
//   mobile = false,
// }: ProjectTaskCardProps) {
//   const dueDate = formatDueDate(task.due_date);
//   const isDone = task.status === "DONE";
//   const isBlocked = task.status === "BLOCKED";

//   return (
//     <article
//       className={`min-w-0 rounded-lg border p-4 shadow-[0_2px_12px_rgba(15,23,42,0.025)] ${
//         isBlocked
//           ? "border-[#F6D6DB] bg-[#FCF4F6]"
//           : "border-transparent bg-white"
//       }`}
//     >
//       <div className="flex min-w-0 items-center justify-between gap-2">
//         <span className="truncate text-[10px] font-bold text-[#A0A4AD]">
//           {/* {task.task_id} */}
//           {task.title}
//         </span>

//         {mobile && (
//           <span
//             className={`shrink-0 rounded-sm px-2 py-1 text-[10px] font-black tracking-wide ${
//               STATUS_STYLES[task.status] || STATUS_STYLES.TO_DO
//             }`}
//           >
//             {STATUS_LABELS[task.status] || task.status}
//           </span>
//         )}
//       </div>

//       <p
//         className={`mt-3 break-words text-[14px] leading-[1.4] text-[#09254D] ${
//           isDone ? "line-through" : ""
//         }`}
//       >
//         {task.description}
//       </p>

//       <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
//         <div
//           className={`flex min-w-0 items-center gap-1.5 text-[10px] font-semibold ${
//             isBlocked
//               ? "text-[#D21F26]"
//               : isDone
//                 ? "text-[#006B48]"
//                 : dueDate === "TODAY"
//                   ? "text-[#0047B8]"
//                   : "text-[#8A9CB8]"
//           }`}
//         >
//           {isBlocked ? (
//             <AlertTriangle size={12} className="shrink-0" />
//           ) : isDone ? (
//             <CheckCircle2 size={12} className="shrink-0" />
//           ) : (
//             <CalendarDays size={12} className="shrink-0" />
//           )}

//           <span className="truncate">
//             {isBlocked
//               ? "DELAYED"
//               : isDone
//                 ? "COMPLETED"
//                 : dueDate || "NO DUE DATE"}
//           </span>
//         </div>

//         <span
//           title={task.assignee?.name || "Unassigned"}
//           className={`flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
//             task.assignee?.name
//               ? "bg-[#0754D9] text-white"
//               : "bg-[#DCE6FF] text-[#09254D]"
//           }`}
//         >
//           {task.assignee?.name ? getInitials(task.assignee?.name) : ""}
//         </span>
//       </div>
//     </article>
//   );
// }




"use client";

import { AlertTriangle, CalendarDays, CheckCircle2 } from "lucide-react";
import type { ProjectTask } from "@/app/hooks/useProjectTasks";

interface ProjectTaskCardProps {
  task: ProjectTask;
  mobile?: boolean;
  onClick?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  TO_DO: "bg-[#DCE6FF] text-[#09254D]",
  IN_PROGRESS: "bg-[#E3EEFF] text-[#0047B8]",
  BLOCKED: "bg-semantic-error-bg text-semantic-error",
  IN_REVIEW: "bg-[#DCE6FF] text-[#09254D]",
  REOPENED: "bg-[#C8171D] text-white",
  READY_FOR_PRODUCTION: "bg-[#005638] text-white",
  READY_FOR_QA: "bg-[#0754D9] text-white",
  DONE: "bg-[#75F0B7] text-[#005638]",
};

const STATUS_LABELS: Record<string, string> = {
  TO_DO: "TO DO",
  IN_PROGRESS: "IN PROGRESS",
  BLOCKED: "BLOCKED",
  IN_REVIEW: "IN REVIEW",
  REOPENED: "REOPENED",
  READY_FOR_PRODUCTION: "READY FOR PROD",
  READY_FOR_QA: "READY FOR QA",
  DONE: "DONE",
};

function formatDueDate(value: string | null) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  if (isToday) return "TODAY";

  return date
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();
}

function getInitials(name?: string | null) {
  if (!name?.trim()) return "U";

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ProjectTaskCard({
  task,
  mobile = false,
  onClick,
}: ProjectTaskCardProps) {
  const dueDate = formatDueDate(task.due_date);
  const isDone = task.status === "DONE";
  const isBlocked = task.status === "BLOCKED";

  return (
    <article
      onClick={onClick}
      onKeyDown={(event) => {
        if (!onClick) return;

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`min-w-0 rounded-lg border p-4 shadow-[0_2px_12px_rgba(15,23,42,0.025)] ${
        onClick ? "cursor-pointer" : ""
      } ${
        isBlocked
          ? "border-[#F6D6DB] bg-[#FCF4F6]"
          : "border-transparent bg-white"
      }`}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="truncate text-[10px] font-bold text-[#A0A4AD]">
          {task.title}
        </span>

        {mobile && (
          <span
            className={`shrink-0 rounded-sm px-2 py-1 text-[10px] font-black tracking-wide ${
              STATUS_STYLES[task.status] || STATUS_STYLES.TO_DO
            }`}
          >
            {STATUS_LABELS[task.status] || task.status}
          </span>
        )}
      </div>

      <p
        className={`mt-3 break-words text-[14px] leading-[1.4] text-[#09254D] ${
          isDone ? "line-through" : ""
        }`}
      >
        {task.description}
      </p>

      <div className="mt-3 flex min-w-0 items-center justify-between gap-2">
        <div
          className={`flex min-w-0 items-center gap-1.5 text-[10px] font-semibold ${
            isBlocked
              ? "text-[#D21F26]"
              : isDone
                ? "text-[#006B48]"
                : dueDate === "TODAY"
                  ? "text-[#0047B8]"
                  : "text-[#8A9CB8]"
          }`}
        >
          {isBlocked ? (
            <AlertTriangle size={12} className="shrink-0" />
          ) : isDone ? (
            <CheckCircle2 size={12} className="shrink-0" />
          ) : (
            <CalendarDays size={12} className="shrink-0" />
          )}

          <span className="truncate">
            {isBlocked
              ? "DELAYED"
              : isDone
                ? "COMPLETED"
                : dueDate || "NO DUE DATE"}
          </span>
        </div>

        <span
          title={task.assignee?.name || "Unassigned"}
          className={`flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
            task.assignee?.name
              ? "bg-[#0754D9] text-white"
              : "bg-[#DCE6FF] text-[#09254D]"
          }`}
        >
          {task.assignee?.name ? getInitials(task.assignee.name) : ""}
        </span>
      </div>
    </article>
  );
}
  