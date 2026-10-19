
// "use client";

// import { useEffect, useRef, useState } from "react";
// import {
//   CalendarDays,
//   Check,
//   CircleUserRound,
//   ClipboardList,
//   LoaderCircle,
//   X,
// } from "lucide-react";
// import type { ProjectTask } from "@/app/hooks/useProjectTasks";

// interface TaskDetailsModalProps {
//   isOpen: boolean;
//   projectId: string;
//   taskId: string | null;
//   onClose: () => void;
// }

// interface TaskDetailsResponse {
//   success: boolean;
//   data?: ProjectTask;
//   message?: string;
// }

// const STATUS_STYLES: Record<string, string> = {
//   TO_DO: "bg-slate-100 text-slate-600",
//   IN_PROGRESS: "bg-blue-50 text-blue-700",
//   BLOCKED: "bg-red-50 text-red-700",
//   IN_REVIEW: "bg-violet-50 text-violet-700",
//   READY_FOR_QA: "bg-amber-50 text-amber-700",
//   REOPENED: "bg-orange-50 text-orange-700",
//   READY_FOR_PRODUCTION: "bg-teal-50 text-teal-700",
//   DONE: "bg-green-50 text-green-700",
// };

// const STATUS_LABELS: Record<string, string> = {
//   TO_DO: "To Do",
//   IN_PROGRESS: "In Progress",
//   BLOCKED: "Blocked",
//   IN_REVIEW: "In Review",
//   READY_FOR_QA: "Ready for QA",
//   REOPENED: "Reopened",
//   READY_FOR_PRODUCTION: "Ready for Production",
//   DONE: "Done",
// };

// function formatDate(value?: string | null) {
//   if (!value) return "No due date";

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) return "No due date";

//   return new Intl.DateTimeFormat("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   }).format(date);
// }

// function getInitials(name?: string | null) {
//   if (!name?.trim()) return "?";

//   return name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0])
//     .join("")
//     .toUpperCase();
// }

// export default function TaskDetailsModal({
//   isOpen,
//   projectId,
//   taskId,
//   onClose,
// }: TaskDetailsModalProps) {
//   const [task, setTask] = useState<ProjectTask | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const requestVersion = useRef(0);
// const [retryKey, setRetryKey] = useState(0);
//   useEffect(() => {
//     if (!isOpen || !taskId) {
//       // eslint-disable-next-line react-hooks/set-state-in-effect
//       setTask(null);
//       setError("");
//       setIsLoading(false);
//       return;
//     }

//     const controller = new AbortController();
//     const version = ++requestVersion.current;

//     async function loadTask() {
//       setIsLoading(true);
//       setError("");
//       setTask(null);
//         console.log(`/api/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId!)}`)
//         try {
//             const response = await fetch(
//           `/api/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId!)}`,
//           {
//             method: "GET",
//             cache: "no-store",
//             signal: controller.signal,
//         },
//     );
    
//     console.log(response)
//     const result = (await response.json()) as TaskDetailsResponse;
//     // console.log(result[0])

//         // if (!response.ok || !result.success || !result.data) {
//         //   throw new Error(result.message || "Unable to load task details.");
//         // }

//         if (requestVersion.current === version) {
//           setTask(result[0]);
//         }
//       } catch (err) {
//         if (controller.signal.aborted) return;

//         if (requestVersion.current === version) {
//           setError(
//             err instanceof Error
//               ? err.message
//               : "Something went wrong while loading the task.",
//           );
//         }
//       } finally {
//         if (!controller.signal.aborted && requestVersion.current === version) {
//           setIsLoading(false);
//         }
//       }
//     }

//     void loadTask();

//     return () => {
//       controller.abort();
//     };
//   }, [isOpen, projectId, taskId, retryKey]);

//   useEffect(() => {
//     if (!isOpen) return;

//     const previousOverflow = document.body.style.overflow;

//     document.body.style.overflow = "hidden";

//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") onClose();
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.body.style.overflow = previousOverflow;
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   const status = task?.status ?? "TO_DO";
//   const assigneeName = task?.assignee?.name;
//   const creatorName = task?.created_by?.name;

//   return (
//     <div
//       className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 backdrop-blur-[2px] sm:items-center sm:p-5"
//       onMouseDown={(event) => {
//         if (event.target === event.currentTarget) onClose();
//       }}
//     >
//       <section
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby="task-details-title"
//         className="flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88dvh] sm:rounded-2xl"
//       >
//         <header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-7 sm:py-5">
//           <div className="min-w-0">
//             <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
//               <ClipboardList className="h-4 w-4" />
//               Task details
//               {task?.task_id && (
//                 <span className="normal-case tracking-normal text-slate-500">
//                   / {task.task_id}
//                 </span>
//               )}
//             </div>

//             <h2
//               id="task-details-title"
//               className="break-words text-xl font-bold text-slate-900 sm:text-2xl"
//             >
//               {task?.title || "Task"}
//             </h2>
//           </div>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close task details"
//             className="shrink-0 rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </header>

//         <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
//           {isLoading && (
//             <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-slate-500">
//               <LoaderCircle className="h-7 w-7 animate-spin text-blue-600" />
//               <p className="text-sm">Loading task details...</p>
//             </div>
//           )}

//           {!isLoading && error && (
//             <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-center">
//               <p className="text-sm font-medium text-red-600">{error}</p>
//               {/* <button
//                 type="button"
//                 onClick={() => {
//                   // Changing the selected task is not required to retry.
//                   // Re-mounting the modal is handled by the parent.
//                   setError("Please close and reopen the task to try again.");
//                 }}
//                 className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 Close and reopen to retry
//               </button> */}
//               <button
//   type="button"
//   onClick={() => setRetryKey((current) => current + 1)}
//   className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
// >
//   Try again
// </button>
//             </div>
//           )}

//           {!isLoading && !error && task && (
//             <div className="space-y-7">
//               <div>
//                 <p className="mb-2 text-sm font-semibold text-slate-500">
//                   Status
//                 </p>
//                 <span
//                   className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${
//                     STATUS_STYLES[status] || STATUS_STYLES.TO_DO
//                   }`}
//                 >
//                   {STATUS_LABELS[status] || status.replaceAll("_", " ")}
//                 </span>
//               </div>

//               <div>
//                 <h3 className="mb-2 text-sm font-semibold text-slate-500">
//                   Description
//                 </h3>
//                 <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
//                   {task.description?.trim() || "No description provided."}
//                 </p>
//               </div>

//               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                 <div className="rounded-xl border border-slate-100 p-4">
//                   <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
//                     <CircleUserRound className="h-4 w-4" />
//                     Assignee
//                   </div>

//                   <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
//                       {getInitials(assigneeName)}
//                     </div>
//                     <div className="min-w-0">
//                       <p className="truncate text-sm font-semibold text-slate-800">
//                         {assigneeName || "Unassigned"}
//                       </p>
//                       {task.assignee?.email && (
//                         <p className="truncate text-xs text-slate-500">
//                           {task.assignee.email}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="rounded-xl border border-slate-100 p-4">
//                   <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
//                     <CalendarDays className="h-4 w-4" />
//                     Due date
//                   </div>

//                   <p className="text-sm font-semibold text-slate-800">
//                     {formatDate(task.due_date)}
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
//                 <div>
//                   <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
//                     Epic
//                   </p>
//                   <p className="text-sm font-medium text-slate-700">
//                     {task.epic
//                       ? `${task.epic.epic_id} · ${task.epic.title}`
//                       : "No epic"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
//                     Created by
//                   </p>
//                   <p className="text-sm font-medium text-slate-700">
//                     {creatorName || "Unknown"}
//                   </p>
//                 </div>

//                 <div>
//                   <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
//                     Created on
//                   </p>
//                   <p className="text-sm font-medium text-slate-700">
//                     {formatDate(task.created_at)}
//                   </p>
//                 </div>
//               </div>

//               {status === "DONE" && (
//                 <div className="flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
//                   <Check className="h-4 w-4" />
//                   This task is completed.
//                 </div>
//               )}
//             </div>
//           )}

//           {!isLoading && !error && !task && (
//             <div className="py-12 text-center text-sm text-slate-500">
//               No task details are available.
//             </div>
//           )}
//         </div>

//         <footer className="flex justify-end border-t border-slate-100 px-5 py-4 sm:px-7">
//           <button
//             type="button"
//             onClick={onClose}
//             className="w-full rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
//           >
//             Close
//           </button>
//         </footer>
//       </section>
//     </div>
//   );
// }



import React, { useEffect, useRef, useState } from 'react';
import { X, Calendar, User, Link2, LoaderCircle, ChevronDown, CalendarDays } from 'lucide-react';
import { ProjectTask } from '@/app/hooks/useProjectTasks';


interface TaskDetailsModalProps {
  isOpen: boolean;
  projectId: string;
  taskId: string | null;
  onClose: () => void;
}

// Define this interface to match an individual task item
type TaskDetailsResponse = Array<ProjectTask>


const STATUS_STYLES: Record<string, string> = {
  TO_DO: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  BLOCKED: "bg-red-50 text-red-700",
  IN_REVIEW: "bg-violet-50 text-violet-700",
  READY_FOR_QA: "bg-amber-50 text-amber-700",
  REOPENED: "bg-orange-50 text-orange-700",
  READY_FOR_PRODUCTION: "bg-teal-50 text-teal-700",
  DONE: "bg-green-50 text-green-700",
};

const STATUS_LABELS: Record<string, string> = {
  TO_DO: "To Do",
  IN_PROGRESS: "In Progress",
  BLOCKED: "Blocked",
  IN_REVIEW: "In Review",
  READY_FOR_QA: "Ready for QA",
  REOPENED: "Reopened",
  READY_FOR_PRODUCTION: "Ready for Production",
  DONE: "Done",
};

function formatDate(value?: string | null) {
  if (!value) return "No due date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "No due date";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name?: string | null) {
  if (!name?.trim()) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function TaskDetailsModal({
  isOpen,
  projectId,
  taskId,
  onClose,
}: TaskDetailsModalProps) {
  const [task, setTask] = useState<ProjectTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestVersion = useRef(0);
const [retryKey, setRetryKey] = useState(0);
  useEffect(() => {
    if (!isOpen || !taskId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTask(null);
      setError("");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const version = ++requestVersion.current;

    async function loadTask() {
      setIsLoading(true);
      setError("");
      setTask(null);
        console.log(`/api/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId!)}`)
        try {
            const response = await fetch(
          `/api/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId!)}`,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
        },
    );
    
    console.log(response)
    const result = (await response.json()) as TaskDetailsResponse;
    // console.log(result[0])

        // if (!response.ok || !result.success || !result.data) {
        //   throw new Error(result.message || "Unable to load task details.");
        // }

        if (requestVersion.current === version) {
          setTask(result[0] ?? null);
        //   setTask(result.data || null);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        if (requestVersion.current === version) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong while loading the task.",
          );
        }
      } finally {
        if (!controller.signal.aborted && requestVersion.current === version) {
          setIsLoading(false);
        }
      }
    }

    void loadTask();

    return () => {
      controller.abort();
    };
  }, [isOpen, projectId, taskId, retryKey]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;  const status = task?.status || 'TO_DO';
  const assigneeName = task?.assignee?.name;
  const creatorName = task?.created_by?.name;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-950/40 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-details-title"
        className="flex max-h-[95dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-[#f0f3fa] shadow-2xl sm:h-[85dvh] sm:rounded-2xl"
      >
        {/* Header Section */}
        <header className="relative flex items-center justify-between px-6 pt-6 pb-2">
          {task?.task_id && (
            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold tracking-wide text-blue-700">
              {task.task_id}
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close task details"
            className="absolute top-5 right-5 rounded-lg p-2 text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Content Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
          {isLoading && (
            <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-slate-500">
              <LoaderCircle className="h-7 w-7 animate-spin text-blue-600" />
              <p className="text-sm">Loading task details...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
              <button
                type="button"
                onClick={() => setRetryKey((current) => current + 1)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !error && task && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:h-full">
              
              {/* Left Column: Title & Description */}
              <div className="space-y-6 md:col-span-3 flex flex-col justify-start">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Title
                  </label>
                  <div className="w-full rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
                    <h2 id="task-details-title" className="break-words text-sm font-semibold text-slate-900">
                      {task?.title || "Task"}
                    </h2>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Description
                  </label>
                  <div className="w-full flex-1 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm min-h-[160px]">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {task.description?.trim() || "No description provided."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Dropdowns & Metadata Fields */}
              <div className="space-y-4 md:col-span-2">
                {/* Status Selection Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Status
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm text-sm font-medium text-slate-800 cursor-pointer hover:bg-slate-50 transition">
                    <span>{STATUS_LABELS[status] || status}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Assignee Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Assignee
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                        {getInitials(assigneeName)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{assigneeName || "Unassigned"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Epic Link Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Epic
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm text-sm font-medium text-slate-800 cursor-pointer hover:bg-slate-50 transition">
                    <span className="truncate">
                      {task.epic ? `(${task.epic.epic_id}) ${task.epic.title}` : "No epic"}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Due Date Box */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Due Date
                  </label>
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm text-sm font-medium text-slate-800 cursor-pointer hover:bg-slate-50 transition">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      <span>{formatDate(task.due_date)}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </div>
                </div>

                {/* Created By Card */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Created By
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                        {getInitials(creatorName)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">{creatorName || "Unknown"}</span>
                    </div>
                  </div>
                </div>

                {/* Created At Card */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Created At
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm text-sm font-medium text-slate-800">
                    <div className="flex items-center gap-2 text-slate-600">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      <span>{formatDate(task.created_at)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {!isLoading && !error && !task && (
            <div className="py-12 text-center text-sm text-slate-500">
              No task details are available.
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <footer className="flex items-center justify-between border-t border-slate-200/60 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
          >
            Close
          </button>
          
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-800"
          >
            <Link2 className="h-3.5 w-3.5" />
            Copy link
          </button>
        </footer>
      </section>
    </div>
  );

}
