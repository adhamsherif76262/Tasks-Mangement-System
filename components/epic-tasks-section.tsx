// "use client";

// import React, { useState } from "react";

// import AddTaskModal from "@/components/AddTaskModal";

// interface EpicTasksSectionProps {
//   projectId: string;
//   epicId: string;
// }

// export function EpicTasksSection({
//   projectId,
//   epicId,
// }: EpicTasksSectionProps) {
//   const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

//   return (
//     <div className="mt-6 flex flex-col gap-3">
//       <div className="flex items-center justify-between">
//         <h3 className="text-base font-bold text-slate-800">
//           Tasks
//         </h3>

//         <button
//           type="button"
//           onClick={() => setIsAddTaskOpen(true)}
//           className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
//         >
//           + Add Task
//         </button>
//       </div>

//       {/* Dotted Canvas Area for Empty State matching Figma */}
//       <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-100 bg-surface-low px-4 py-10 text-center">
//         <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 shadow-sm">
//           <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <rect width="48" height="48" rx="12" fill="#E0E8FF"/>
//           <path d="M21 31V29H33V31H21ZM21 25V23H33V25H21ZM21 19V17H33V19H21ZM17 32C16.45 32 15.9792 31.8042 15.5875 31.4125C15.1958 31.0208 15 30.55 15 30C15 29.45 15.1958 28.9792 15.5875 28.5875C15.9792 28.1958 16.45 28 17 28C17.55 28 18.0208 28.1958 18.4125 28.5875C18.8042 28.9792 19 29.45 19 30C19 30.55 18.8042 31.0208 18.4125 31.4125C18.0208 31.8042 17.55 32 17 32ZM17 26C16.45 26 15.9792 25.8042 15.5875 25.4125C15.1958 25.0208 15 24.55 15 24C15 23.45 15.1958 22.9792 15.5875 22.5875C15.9792 22.1958 16.45 22 17 22C17.55 22 18.0208 22.1958 18.4125 22.5875C18.8042 22.9792 19 23.45 19 24C19 24.55 18.8042 25.0208 18.4125 25.4125C18.0208 25.8042 17.55 26 17 26ZM17 20C16.45 20 15.9792 19.8042 15.5875 19.4125C15.1958 19.0208 15 18.55 15 18C15 17.45 15.1958 16.9792 15.5875 16.5875C15.9792 16.1958 16.45 16 17 16C17.55 16 18.0208 16.1958 18.4125 16.5875C18.8042 16.9792 19 17.45 19 18C19 18.55 18.8042 19.0208 18.4125 19.4125C18.0208 19.8042 17.55 20 17 20Z" fill="#003D9B"/>
//           </svg>
//         </div>

//         <p className="max-w-xs text-sm font-medium text-slate-500">
//           No tasks have been added to this epic yet
//         </p>

//         <button
//           type="button"
//           onClick={() => setIsAddTaskOpen(true)}
//           className="flex h-10 items-center gap-1.5 rounded-lg bg-[#0046C4] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
//         >
//           + Add Task
//         </button>
//       </div>

//       <AddTaskModal
//         projectId={projectId}
//         initialEpicId={epicId}
//         isOpen={isAddTaskOpen}
//         onClose={() => setIsAddTaskOpen(false)}
//       />
//     </div>
//   );
// }




"use client";

import { useState } from "react";
import { CalendarDays, Link2, Plus, RefreshCw, UserRound } from "lucide-react";

import AddTaskModal from "@/components/AddTaskModal";
import useEpicTasks, {
  type EpicTask,
} from "@/app/hooks/useEpicTasks";

interface EpicTasksSectionProps {
  projectId: string;
  epicId: string;
}

function formatDueDate(dateString: string | null | undefined) {
  if (!dateString) return "No due date";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function getInitials(name: string | null | undefined) {
  if (!name?.trim()) return "";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function TaskRow({ task }: { task: EpicTask }) {
  const assigneeName = task.assignee?.name?.trim() || "";

  return (
    <div className="flex min-w-0 items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 last:border-b-0">
      <div className="min-w-0 flex-1">
        <p
          title={task.title}
          className="truncate text-sm font-medium text-[#09254D]"
        >
          {task.title || "Untitled task"}
        </p>

        <div className="mt-2 flex min-w-0 items-center gap-2">
          {task.assignee?.avatar_url ? (
            <img
              src={task.assignee.avatar_url}
              alt=""
              className="h-5 w-5 shrink-0 rounded-full object-cover"
            />
          ) : assigneeName ? (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCE6FF] text-[9px] font-bold text-[#1749B8]">
              {getInitials(assigneeName)}
            </span>
          ) : (
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E8EEFF] text-[#1749B8]">
              <UserRound size={11} />
            </span>
          )}

          <span className="truncate text-xs text-slate-500">
            {assigneeName || "Unassigned"}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
          Due date
        </span>

        <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-slate-600">
          {/* <CalendarDays size={12} className="text-slate-400" /> */}
          {formatDueDate(task.due_date)}
        </span>
      </div>
    </div>
  );
}

function TaskSkeleton() {
  return (
    <div className="space-y-3 p-4" aria-label="Loading tasks">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0"
        >
          <div className="min-w-0 flex-1 space-y-3">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

export function EpicTasksSection({
  projectId,
  epicId,
}: EpicTasksSectionProps) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const { tasks, isLoading, error, retry } = useEpicTasks({
    projectId,
    epicId,
    isOpen: true,
  });

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-[#09254D]">Tasks</h3>

        <button
          type="button"
          onClick={() => setIsAddTaskOpen(true)}
          className="flex items-center gap-1 text-xs font-semibold text-[#0046C4] transition hover:text-blue-700"
        >
          <Plus size={15} />
          Add Task
        </button>
      </div>

      {isLoading ? (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
          <TaskSkeleton />
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-100 bg-red-50/50 px-4 py-8 text-center"
        >
          <p className="text-sm font-medium text-slate-700">
            Couldn&apos;t load this epic&apos;s tasks.
          </p>

          <p className="max-w-sm break-words text-xs text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={retry}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <RefreshCw size={13} />
            Try again
          </button>
        </div>
      ) : tasks.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-100 bg-surface-low px-4 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 shadow-sm">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <rect width="48" height="48" rx="12" fill="#E0E8FF" />
              <path
                d="M21 31V29H33V31H21ZM21 25V23H33V25H21ZM21 19V17H33V19H21ZM17 32C16.45 32 15.9792 31.8042 15.5875 31.4125C15.1958 31.0208 15 30.55 15 30C15 29.45 15.1958 28.9792 15.5875 28.5875C15.9792 28.1958 16.45 28 17 28C17.55 28 18.0208 28.1958 18.4125 28.5875C18.8042 28.9792 19 29.45 19 30C19 30.55 18.8042 31.0208 18.4125 31.4125C18.0208 31.8042 17.55 32 17 32ZM17 26C16.45 26 15.9792 25.8042 15.5875 25.4125C15.1958 25.0208 15 24.55 15 24C15 23.45 15.1958 22.9792 15.5875 22.5875C15.9792 22.1958 16.45 22 17 22C17.55 22 18.0208 22.1958 18.4125 22.5875C18.8042 22.9792 19 23.45 19 24C19 24.55 18.8042 25.0208 18.4125 25.4125C18.0208 25.8042 17.55 26 17 26ZM17 20C16.45 20 15.9792 19.8042 15.5875 19.4125C15.1958 19.0208 15 18.55 15 18C15 17.45 15.1958 16.9792 15.5875 16.5875C15.9792 16.1958 16.45 16 17 16C17.55 16 18.0208 16.1958 18.4125 16.5875C18.8042 16.9792 19 17.45 19 18C19 18.55 18.8042 19.0208 18.4125 19.4125C18.0208 19.8042 17.55 20 17 20Z"
                fill="#003D9B"
              />
            </svg>
          </div>

          <p className="max-w-xs text-sm font-medium text-slate-500">
            No tasks have been added to this epic yet
          </p>

          <button
            type="button"
            onClick={() => setIsAddTaskOpen(true)}
            className="flex h-10 items-center gap-1.5 rounded-lg bg-[#0046C4] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={14} />
            Add Task
          </button>
        </div>
      )}

      <AddTaskModal
        projectId={projectId}
        initialEpicId={epicId}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />
    </div>
  );
}