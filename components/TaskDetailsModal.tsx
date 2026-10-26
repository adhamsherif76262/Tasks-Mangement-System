// import { useEffect, useRef, useState } from 'react';
// import { X, Link2, LoaderCircle, ChevronDown, CalendarDays } from 'lucide-react';
// import { ProjectTask } from '@/app/hooks/useProjectTasks';


// interface TaskDetailsModalProps {
//   isOpen: boolean;
//   projectId: string;
//   taskId: string | null;
//   onClose: () => void;
// }

// // Define this interface to match an individual task item
// type TaskDetailsResponse = Array<ProjectTask>


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
//           setTask(result[0] ?? null);
//         //   setTask(result.data || null);
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

//   if (!isOpen) return null;  const status = task?.status || 'TO_DO';
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
//         className="flex max-h-[95dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-[#f0f3fa] shadow-2xl sm:h-[85dvh] sm:rounded-2xl"
//       >
//         {/* Header Section */}
//         <header className="relative flex items-center justify-between px-6 pt-6 pb-2">
//           {task?.task_id && (
//             <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold tracking-wide text-blue-700">
//               {task.task_id}
//             </span>
//           )}
//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close task details"
//             className="absolute top-5 right-5 rounded-lg p-2 text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-800"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </header>

//         {/* Content Body */}
//         <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
//           {isLoading && (
//             <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-slate-500">
//               <LoaderCircle className="h-7 w-7 animate-spin text-blue-600" />
//               <p className="text-sm">Loading task details...</p>
//             </div>
//           )}

//           {!isLoading && error && (
//             <div className="flex min-h-52 flex-col items-center justify-center gap-3 text-center">
//               <p className="text-sm font-medium text-red-600">{error}</p>
//               <button
//                 type="button"
//                 onClick={() => setRetryKey((current) => current + 1)}
//                 className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
//               >
//                 Try again
//               </button>
//             </div>
//           )}

//           {!isLoading && !error && task && (
//             <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:h-full">
              
//               {/* Left Column: Title & Description */}
//               <div className="space-y-6 md:col-span-3 flex flex-col justify-start">
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
//                     Title
//                   </label>
//                   <div className="w-full rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
//                     <h2 id="task-details-title" className="break-words text-sm font-semibold text-slate-900">
//                       {task?.title || "Task"}
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="flex-1 flex flex-col">
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
//                     Description
//                   </label>
//                   <div className="w-full flex-1 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm min-h-[160px]">
//                     <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
//                       {task.description?.trim() || "No description provided."}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column: Dropdowns & Metadata Fields */}
//               <div className="space-y-4 md:col-span-2">
//                 {/* Status Selection Box */}
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//                     Status
//                   </label>
//                   <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm text-sm font-medium text-slate-800 cursor-pointer hover:bg-slate-50 transition">
//                     <span>{STATUS_LABELS[status] || status}</span>
//                     <ChevronDown className="h-4 w-4 text-slate-400" />
//                   </div>
//                 </div>

//                 {/* Assignee Box */}
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//                     Assignee
//                   </label>
//                   <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm cursor-pointer hover:bg-slate-50 transition">
//                     <div className="flex items-center gap-2.5">
//                       <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
//                         {getInitials(assigneeName)}
//                       </div>
//                       <span className="text-sm font-medium text-slate-800">{assigneeName || "Unassigned"}</span>
//                     </div>
//                     <ChevronDown className="h-4 w-4 text-slate-400" />
//                   </div>
//                 </div>

//                 {/* Epic Link Box */}
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//                     Epic
//                   </label>
//                   <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm text-sm font-medium text-slate-800 cursor-pointer hover:bg-slate-50 transition">
//                     <span className="truncate">
//                       {task.epic ? `(${task.epic.epic_id}) ${task.epic.title}` : "No epic"}
//                     </span>
//                     <ChevronDown className="h-4 w-4 text-slate-400" />
//                   </div>
//                 </div>

//                 {/* Due Date Box */}
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//                     Due Date
//                   </label>
//                   <div className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm text-sm font-medium text-slate-800 cursor-pointer hover:bg-slate-50 transition">
//                     <div className="flex items-center gap-2 text-slate-600">
//                       <CalendarDays className="h-4 w-4 text-slate-400" />
//                       <span>{formatDate(task.due_date)}</span>
//                     </div>
//                     <ChevronDown className="h-4 w-4 text-slate-400" />
//                   </div>
//                 </div>

//                 {/* Created By Card */}
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//                     Created By
//                   </label>
//                   <div className="flex items-center rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm">
//                     <div className="flex items-center gap-2.5">
//                       <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
//                         {getInitials(creatorName)}
//                       </div>
//                       <span className="text-sm font-medium text-slate-800">{creatorName || "Unknown"}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Created At Card */}
//                 <div>
//                   <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
//                     Created At
//                   </label>
//                   <div className="flex items-center rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm text-sm font-medium text-slate-800">
//                     <div className="flex items-center gap-2 text-slate-600">
//                       <CalendarDays className="h-4 w-4 text-slate-400" />
//                       <span>{formatDate(task.created_at)}</span>
//                     </div>
//                   </div>
//                 </div>

//               </div>
//             </div>
//           )}

//           {!isLoading && !error && !task && (
//             <div className="py-12 text-center text-sm text-slate-500">
//               No task details are available.
//             </div>
//           )}
//         </div>

//         {/* Modal Footer Controls */}
//         <footer className="flex items-center justify-between border-t border-slate-200/60 bg-white px-6 py-4">
//           <button
//             type="button"
//             onClick={onClose}
//             className="rounded-lg bg-blue-50 px-5 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
//           >
//             Close
//           </button>
          
//           <button
//             type="button"
//             className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-800"
//           >
//             <Link2 className="h-3.5 w-3.5" />
//             Copy link
//           </button>
//         </footer>
//       </section>
//     </div>
//   );

// }




"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Link2,
  LoaderCircle,
  ChevronDown,
  CalendarDays,
  Check,
  AlertCircle,
} from "lucide-react";
import { ProjectTask } from "@/app/hooks/useProjectTasks";

interface TaskDetailsModalProps {
  isOpen: boolean;
  projectId: string;
  taskId: string | null;
  onClose: () => void;
}

type TaskStatus =
  | "TO_DO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "IN_REVIEW"
  | "READY_FOR_QA"
  | "REOPENED"
  | "READY_FOR_PRODUCTION"
  | "DONE";

type EditableField =
  | "title"
  | "description"
  | "status"
  | "assignee_id"
  | "epic_id"
  | "due_date";

type EditableTask = Omit<ProjectTask, "epic" | "assignee"> & {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  assignee_id?: string | null;
  epic_id?: string | null;
  due_date?: string | null;
  assignee?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  } | null;
  epic?: {
    id?: string;
    epic_id?: string;
    title?: string;
  } | null;
};

interface ProjectMember {
  id: string;
  name: string;
  email?: string;
  role?: string;
}

interface ProjectEpic {
  id: string;
  epic_id?: string;
  title: string;
}

type Toast = {
  type: "success" | "error";
  message: string;
} | null;

const TASK_STATUSES: TaskStatus[] = [
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
];

const STATUS_STYLES: Record<TaskStatus, string> = {
  TO_DO: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-50 text-blue-700",
  BLOCKED: "bg-red-50 text-red-700",
  IN_REVIEW: "bg-violet-50 text-violet-700",
  READY_FOR_QA: "bg-amber-50 text-amber-700",
  REOPENED: "bg-orange-50 text-orange-700",
  READY_FOR_PRODUCTION: "bg-teal-50 text-teal-700",
  DONE: "bg-green-50 text-green-700",
};

const STATUS_LABELS: Record<TaskStatus, string> = {
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

  // const getInitials = (name: string , email? :string) => {
  //   if(email?.includes("mkscorpion5001")) {return "MK"}
  //   const words = name ?? "?"
  //     .trim()
  //     .split(/\s+/)
  //     .filter(Boolean);

  //   if (words.length >= 2) {
  //     return `${words[0][0]}${words[1][0]}`.toUpperCase();
  //   }

  //   return name ?? "?".slice(0, 2).toUpperCase();
  // };


  const getInitials = (name: string, email?: string): string => {
  if (email?.includes("mkscorpion5001")) {
    return "MK";
  }

  // Wrap in parentheses so .trim() and .split() apply to the fallback string too
  const words = (name ?? "?")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  // Case 1: Two or more words (e.g., "John Doe" -> "JD")
  if (words.length >= 2) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  // Case 2: One word / no spaces (e.g., "John" -> "JO", "A" -> "A")
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return "?";
};


function getLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateInputValue(value?: string | null) {
  if (!value) return "";

  return value.slice(0, 10);
}

async function readJson(response: Response) {
  return response.json().catch(() => null);
}

export default function TaskDetailsModal({
  isOpen,
  projectId,
  taskId,
  onClose,
}: TaskDetailsModalProps) {
  const [task, setTask] = useState<EditableTask | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [epics, setEpics] = useState<ProjectEpic[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isLoadingEpics, setIsLoadingEpics] = useState(false);
  const [memberLoadError, setMemberLoadError] = useState("");
  const [epicLoadError, setEpicLoadError] = useState("");

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState("");

  const [saving, setSaving] = useState<
    Partial<Record<EditableField, boolean>>
  >({});
  const [toast, setToast] = useState<Toast>(null);

  const requestVersion = useRef(0);
  const lockedFields = useRef(new Set<EditableField>());
  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const taskUrl = `/api/projects/${encodeURIComponent(
    projectId,
  )}/tasks/${encodeURIComponent(taskId ?? "")}`;

  const showToast = useCallback((nextToast: Toast) => {
    if (toastTimeout.current) {
      clearTimeout(toastTimeout.current);
    }

    setToast(nextToast);

    if (nextToast) {
      toastTimeout.current = setTimeout(() => {
        setToast(null);
      }, 3500);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeout.current) {
        clearTimeout(toastTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !taskId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTask(null);
      setError("");
      setIsLoading(false);
      setEditingTitle(false);
      setEditingDescription(false);
      setToast(null);
      lockedFields.current.clear();
      return;
    }

    const controller = new AbortController();
    const version = ++requestVersion.current;

    async function loadTask() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(taskUrl, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await readJson(response);

        if (!response.ok) {
          throw new Error(
            result?.error || "Unable to load task details.",
          );
        }

        const loadedTask = Array.isArray(result)
          ? result[0]
          : result?.data;

        if (!loadedTask) {
          throw new Error("No task details are available.");
        }

        if (requestVersion.current === version) {
          setTask(loadedTask as EditableTask);
          setTitleDraft(loadedTask.title ?? "");
          setDescriptionDraft(loadedTask.description ?? "");
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
        if (
          !controller.signal.aborted &&
          requestVersion.current === version
        ) {
          setIsLoading(false);
        }
      }
    }

    void loadTask();

    return () => controller.abort();
  }, [isOpen, projectId, taskId, taskUrl, retryKey]);

  useEffect(() => {
    if (!isOpen || !taskId) return;

    const controller = new AbortController();

    async function loadMembers() {
      setIsLoadingMembers(true);
      setMemberLoadError("");

      try {
        const response = await fetch(
          `/api/projects/project-members?project_id=${encodeURIComponent(projectId)}`,
          {
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const result = await readJson(response);

        if (!response.ok) {
          throw new Error(
            result?.error || "Unable to load project members.",
          );
        }

        const rows = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        const uniqueMembers = new Map<string, ProjectMember>();

        for (const member of rows) {
          const id = member.id ?? member.user_id;
          if (!id) continue;

          uniqueMembers.set(String(id), {
            id: String(id),
            name:
              member.name ??
              member.metadata?.name ??
              member.email.split("@")[0] ??
              "Unnamed member",
            email: member.email ?? member.metadata?.email,
            role: member.role,
          });
        }

        if (!controller.signal.aborted) {
          setMembers(Array.from(uniqueMembers.values()));
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setMemberLoadError(
          err instanceof Error
            ? err.message
            : "Unable to load project members.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingMembers(false);
        }
      }
    }

    void loadMembers();

    return () => controller.abort();
  }, [isOpen, projectId, taskId]);

  useEffect(() => {
    if (!isOpen || !taskId) return;

    const controller = new AbortController();

    async function loadEpics() {
      setIsLoadingEpics(true);
      setEpicLoadError("");

      try {
        const pageSize = 100;
        let offset = 0;
        const allEpics: ProjectEpic[] = [];

        while (true) {
          const response = await fetch(
            `/api/projects/${encodeURIComponent(projectId)}/epics?limit=${pageSize}&offset=${offset}`,
            {
              cache: "no-store",
              signal: controller.signal,
            },
          );

          const result = await readJson(response);

          if (!response.ok) {
            throw new Error(
              result?.error || "Unable to load project epics.",
            );
          }

          const rows = Array.isArray(result)
            ? result
            : Array.isArray(result?.data)
              ? result.data
              : [];

          allEpics.push(
            ...rows
              .filter((epic: ProjectEpic) => epic.id && epic.title)
              .map((epic: ProjectEpic) => ({
                id: String(epic.id),
                epic_id: epic.epic_id,
                title: epic.title,
              })),
          );

          if (rows.length < pageSize) break;

          offset += pageSize;
        }

        if (!controller.signal.aborted) {
          const uniqueEpics = new Map(
            allEpics.map((epic) => [epic.id, epic]),
          );

          setEpics(Array.from(uniqueEpics.values()));
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setEpicLoadError(
          err instanceof Error
            ? err.message
            : "Unable to load project epics.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingEpics(false);
        }
      }
    }

    void loadEpics();

    return () => controller.abort();
  }, [isOpen, projectId, taskId]);

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

  const updateField = useCallback(
    async (field: EditableField, value: string | null) => {
      if (!task || !taskId || lockedFields.current.has(field)) {
        return false;
      }

      const currentTask = task as EditableTask;
      const previousValue = currentTask[field];

      const normalizedValue =
        field === "title"
          ? typeof value === "string"
            ? value.trim()
            : ""
          : field === "description"
            ? typeof value === "string"
              ? value.trim() || null
              : null
            : value;

      if (field === "title" && !normalizedValue) {
        showToast({
          type: "error",
          message: "Task title cannot be empty.",
        });
        setTitleDraft(currentTask.title);
        return false;
      }

      if (field === "due_date" && normalizedValue) {
        if (normalizedValue < getLocalDateString()) {
          showToast({
            type: "error",
            message: "Due date cannot be in the past.",
          });
          return false;
        }
      }

      if (normalizedValue === previousValue) {
        return true;
      }

      lockedFields.current.add(field);
      setSaving((current) => ({ ...current, [field]: true }));

      // Optimistically update the displayed field.
      setTask((current) => {
        if (!current) return current;

        const updated = {
          ...current,
          [field]: normalizedValue,
        } as EditableTask;

        if (field === "assignee_id") {
          updated.assignee =
            normalizedValue === null
              ? null
              : members.find(
                  (member) => member.id === normalizedValue,
                )
                ? {
                    id: normalizedValue,
                    name: members.find(
                      (member) => member.id === normalizedValue,
                    )!.name,
                    email: members.find(
                      (member) => member.id === normalizedValue,
                    )!.email,
                  }
                : current.assignee;
        }

        if (field === "epic_id") {
          updated.epic =
            normalizedValue === null
              ? null
              : epics.find((epic) => epic.id === normalizedValue)
                ? {
                    id: normalizedValue,
                    epic_id: epics.find(
                      (epic) => epic.id === normalizedValue,
                    )!.epic_id,
                    title: epics.find(
                      (epic) => epic.id === normalizedValue,
                    )!.title,
                  }
                : current.epic;
        }

        return updated;
      });

      const payload: Record<string, string | null> = {
        [field]: normalizedValue,
      };

      try {
        const response = await fetch(taskUrl, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await readJson(response);

        // if (!response.ok) {
        //   throw new Error(
        //     result?.error || "Failed to update task.",
        //   );
        // }

        if (
  !response.ok ||
  (result &&
    typeof result === "object" &&
    "success" in result &&
    result.success === false)
) {
  throw new Error(
    result?.message ||
      result?.error ||
      "Failed to update task.",
  );
}
        // Keep the joined task details intact; the PATCH response may
        // contain only the underlying tasks-table row.
        setTask((current) => {
          if (!current) return current;

          const updated = {
            ...current,
            [field]: normalizedValue,
          } as EditableTask;

          if (field === "assignee_id") {
            updated.assignee =
              normalizedValue === null
                ? null
                : members.find(
                    (member) => member.id === normalizedValue,
                  )
                  ? {
                      id: normalizedValue,
                      name: members.find(
                        (member) => member.id === normalizedValue,
                      )!.name,
                      email: members.find(
                        (member) => member.id === normalizedValue,
                      )!.email,
                    }
                  : current.assignee;
          }

          if (field === "epic_id") {
            updated.epic =
              normalizedValue === null
                ? null
                : epics.find((epic) => epic.id === normalizedValue)
                  ? {
                      id: normalizedValue,
                      epic_id: epics.find(
                        (epic) => epic.id === normalizedValue,
                      )!.epic_id,
                      title: epics.find(
                        (epic) => epic.id === normalizedValue,
                      )!.title,
                    }
                  : current.epic;
          }

          return updated;
        });

        showToast({
          type: "success",
          message: "Task updated successfully.",
        });

        return true;
      } catch {
        // Roll back only this field so concurrent updates to other
        // fields aren't accidentally overwritten.
        setTask((current) => {
          if (!current) return current;

          const rolledBack = {
            ...current,
            [field]: previousValue,
          } as EditableTask;

          if (field === "assignee_id") {
            rolledBack.assignee = currentTask.assignee;
          }

          if (field === "epic_id") {
            rolledBack.epic = currentTask.epic;
          }

          return rolledBack;
        });

        showToast({
          type: "error",
          message: "Failed to update task. Please try again.",
        });

        return false;
      } finally {
        lockedFields.current.delete(field);
        setSaving((current) => ({
          ...current,
          [field]: false,
        }));
      }
    },
    [task, taskId, members, epics, taskUrl, showToast],
  );

  const handleTitleBlur = async () => {
    if (!task) return;

    const nextTitle = titleDraft.trim();

    if (!nextTitle) {
      setTitleDraft(task.title);
      setEditingTitle(false);
      showToast({
        type: "error",
        message: "Task title cannot be empty.",
      });
      return;
    }

    const saved = await updateField("title", nextTitle);

    if (!saved) {
      setTitleDraft(task.title);
    }

    setEditingTitle(false);
  };

  const handleDescriptionBlur = async () => {
    const nextDescription = descriptionDraft.trim() || null;

    await updateField("description", nextDescription);
    setEditingDescription(false);
  };

  if (!isOpen) return null;

  const status = task?.status || "TO_DO";
  const assigneeName = task?.assignee?.name;
  const assigneeEmail = task?.assignee?.email;
  const creatorName = task?.created_by?.name;

  const isSaving = (field: EditableField) => Boolean(saving[field]);

  const selectClass =
    "min-w-0 flex-1 appearance-none bg-transparent text-sm font-medium text-slate-800 outline-none disabled:cursor-not-allowed disabled:opacity-60";

  const cardClass =
    "flex min-h-11 items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm transition hover:bg-slate-50";

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
        <header className="relative flex items-center justify-between px-6 pb-2 pt-6">
          {task?.task_id && (
            <span className="rounded bg-blue-100 px-2 py-1 text-xs font-bold tracking-wide text-blue-700">
              {task.task_id}
            </span>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close task details"
            className="absolute right-5 top-5 rounded-lg p-2 text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

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
            <div className="grid grid-cols-1 gap-6 md:h-full md:grid-cols-5">
              <div className="flex flex-col justify-start space-y-6 md:col-span-3">
                <div>
                  <label
                    htmlFor="task-title-editor"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Title
                  </label>

                  <div className="w-full rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
                    {editingTitle ? (
                      <input
                        id="task-title-editor"
                        autoFocus
                        value={titleDraft}
                        maxLength={250}
                        disabled={isSaving("title")}
                        onChange={(event) => setTitleDraft(event.target.value)}
                        onBlur={() => void handleTitleBlur()}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            event.currentTarget.blur();
                          }

                          if (event.key === "Escape") {
                            setTitleDraft(task.title);
                            setEditingTitle(false);
                          }
                        }}
                        className="w-full rounded-md border border-blue-300 px-2 py-1 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    ) : (
                      <button
                        type="button"
                        id="task-details-title"
                        onClick={() => {
                          setTitleDraft(task.title);
                          setEditingTitle(true);
                        }}
                        className="flex w-full items-start justify-between gap-3 text-left"
                      >
                        <span className="break-words text-sm font-semibold text-slate-900">
                          {task.title || "Task"}
                        </span>
                        {isSaving("title") ? (
                          <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
                        ) : (
                          <span className="shrink-0 text-xs text-slate-400">
                            Edit
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col">
                  <label
                    htmlFor="task-description-editor"
                    className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    Description
                  </label>

                  <div className="min-h-[160px] w-full flex-1 rounded-xl border border-slate-200/60 bg-white p-4 shadow-sm">
                    {editingDescription ? (
                      <textarea
                        id="task-description-editor"
                        autoFocus
                        value={descriptionDraft}
                        disabled={isSaving("description")}
                        onChange={(event) =>
                          setDescriptionDraft(event.target.value)
                        }
                        onBlur={() => void handleDescriptionBlur()}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Escape" &&
                            !isSaving("description")
                          ) {
                            setDescriptionDraft(task.description ?? "");
                            setEditingDescription(false);
                            event.currentTarget.blur();
                          }
                        }}
                        placeholder="Add a description..."
                        rows={6}
                        className="w-full resize-y rounded-md border border-blue-300 p-2 text-sm leading-6 text-slate-700 outline-none focus:ring-2 focus:ring-blue-100"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setDescriptionDraft(task.description ?? "");
                          setEditingDescription(true);
                        }}
                        className="w-full text-left"
                      >
                        {isSaving("description") && (
                          <LoaderCircle className="mb-2 h-4 w-4 animate-spin text-blue-600" />
                        )}
                        <p
                          className={`whitespace-pre-wrap break-words text-sm leading-6 ${
                            task.description?.trim()
                              ? "text-slate-700"
                              : "text-slate-400"
                          }`}
                        >
                          {task.description?.trim() ||
                            "No description provided."}
                        </p>
                        <span className="mt-3 block text-xs text-slate-400">
                          Click to edit
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:col-span-2">
                {/* <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </label>

                  <div className={cardClass}>
                    <span
                      className={`rounded-md px-2 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
                    >
                      {STATUS_LABELS[status] || status}
                    </span>

                    <div className="flex items-center gap-2">
                      {isSaving("status") && (
                        <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />
                      )}
                      <select
                        aria-label="Task status"
                        className={selectClass}
                        value={status}
                        disabled={isSaving("status")}
                        onChange={(event) =>
                          void updateField(
                            "status",
                            event.target.value as TaskStatus,
                          )
                        }
                      >
                        {TASK_STATUSES.map((item) => (
                          <option key={item} value={item}>
                            {STATUS_LABELS[item]}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Assignee
                  </label>

                  <div className={cardClass}>
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                        {getInitials(assigneeName)}
                      </div>
                      <span className="truncate text-sm font-medium text-slate-800">
                        {assigneeName || "Unassigned"}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {isSaving("assignee_id") && (
                        <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />
                      )}
                      <select
                        aria-label="Task assignee"
                        className={`${selectClass} max-w-[145px]`}
                        value={task.assignee_id ?? task.assignee?.id ?? ""}
                        disabled={isSaving("assignee_id") || isLoadingMembers}
                        onChange={(event) =>
                          void updateField(
                            "assignee_id",
                            event.target.value || null,
                          )
                        }
                      >
                        <option value="">Unassigned</option>
                        {members.map((member) => (
                          <option key={member.id} value={member.id}>
                            {member.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {memberLoadError && (
                    <p className="mt-1 text-xs text-red-600">
                      {memberLoadError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Epic
                  </label>

                  <div className={cardClass}>
                    <span className="min-w-0 truncate text-sm font-medium text-slate-800">
                      {task.epic
                        ? `(${task.epic.epic_id ?? ""}) ${task.epic.title}`.trim()
                        : "No epic"}
                    </span>

                    <div className="flex shrink-0 items-center gap-2">
                      {isSaving("epic_id") && (
                        <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />
                      )}
                      <select
                        aria-label="Task epic"
                        className={`${selectClass} max-w-[145px]`}
                        value={task.epic_id ?? task.epic?.id ?? ""}
                        disabled={isSaving("epic_id") || isLoadingEpics}
                        onChange={(event) =>
                          void updateField("epic_id", event.target.value || null)
                        }
                      >
                        <option value="">No epic</option>
                        {epics.map((epic) => (
                          <option key={epic.id} value={epic.id}>
                            {epic.epic_id
                              ? `(${epic.epic_id}) ${epic.title}`
                              : epic.title}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>

                  {epicLoadError && (
                    <p className="mt-1 text-xs text-red-600">
                      {epicLoadError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Due Date
                  </label>

                  <div className={cardClass}>
                    <div className="flex min-w-0 items-center gap-2 text-slate-600">
                      <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="text-sm font-medium">
                        {formatDate(task.due_date)}
                      </span>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {isSaving("due_date") && (
                        <LoaderCircle className="h-4 w-4 animate-spin text-blue-600" />
                      )}
                      <input
                        aria-label="Task due date"
                        type="date"
                        min={getLocalDateString()}
                        value={getDateInputValue(task.due_date)}
                        disabled={isSaving("due_date")}
                        onChange={(event) =>
                          void updateField(
                            "due_date",
                            event.target.value || null,
                          )
                        }
                        className="w-[125px] min-w-0 bg-transparent text-xs text-slate-700 outline-none"
                      />
                      {task.due_date && (
                        <button
                          type="button"
                          aria-label="Clear due date"
                          disabled={isSaving("due_date")}
                          onClick={() => void updateField("due_date", null)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div> */}

<div>
  <label
    htmlFor="task-status-editor"
    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
  >
    Status
  </label>

  <div className={cardClass}>
    <select
      id="task-status-editor"
      aria-label="Task status"
      className={`min-w-0 flex-1 appearance-none rounded-md px-3 py-1.5 text-sm font-semibold outline-none disabled:opacity-60 ${
        STATUS_STYLES[status]
      }`}
      value={status}
      disabled={isSaving("status")}
      onChange={(event) =>
        void updateField("status", event.target.value as TaskStatus)
      }
    >
      {TASK_STATUSES.map((item) => (
        <option key={item} value={item}>
          {STATUS_LABELS[item]}
        </option>
      ))}
    </select>

    {isSaving("status") ? (
      <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
    )}
  </div>
</div>


<div>
  <label
    htmlFor="task-assignee-editor"
    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
  >
    Assignee
  </label>

  <div className={cardClass}>
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
      {getInitials(assigneeName as string , assigneeEmail as string)}
    </div>

    <select
      id="task-assignee-editor"
      aria-label="Task assignee"
      className={selectClass}
      value={task.assignee_id ?? task.assignee?.id ?? ""}
      disabled={
        isSaving("assignee_id") ||
        isLoadingMembers ||
        Boolean(memberLoadError)
      }
      onChange={(event) =>
        void updateField("assignee_id", event.target.value || null)
      }
    >
      <option value="">Unassigned</option>

      {members.map((member) => (
        <option key={member.id} value={member.id}>
          {member.name}
        </option>
      ))}
    </select>

    {isSaving("assignee_id") || isLoadingMembers ? (
      <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
    )}
  </div>

  {memberLoadError && (
    <p className="mt-1 text-xs text-red-600">{memberLoadError}</p>
  )}
</div>


<div>
  <label
    htmlFor="task-epic-editor"
    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
  >
    Epic
  </label>

  <div className={cardClass}>
    <select
      id="task-epic-editor"
      aria-label="Task epic"
      className={selectClass}
      value={task.epic_id ?? task.epic?.id ?? ""}
      disabled={
        isSaving("epic_id") ||
        isLoadingEpics ||
        Boolean(epicLoadError)
      }
      onChange={(event) =>
        void updateField("epic_id", event.target.value || null)
      }
    >
      <option value="">No epic</option>

      {epics.map((epic) => (
        <option key={epic.id} value={epic.id}>
          {epic.epic_id ? `(${epic.epic_id}) ` : ""}
          {epic.title}
        </option>
      ))}
    </select>

    {isSaving("epic_id") || isLoadingEpics ? (
      <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
    )}
  </div>

  {epicLoadError && (
    <p className="mt-1 text-xs text-red-600">{epicLoadError}</p>
  )}
</div>



<div>
  <label
    htmlFor="task-due-date-editor"
    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
  >
    Due Date
  </label>

  <div className={cardClass}>
    <CalendarDays className="h-4 w-4 shrink-0 text-slate-400" />

    <input
      id="task-due-date-editor"
      aria-label="Task due date"
      type="date"
      min={getLocalDateString()}
      value={getDateInputValue(task.due_date)}
      disabled={isSaving("due_date")}
      onChange={(event) =>
        void updateField("due_date", event.target.value || null)
      }
      className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none disabled:opacity-60"
    />

    {isSaving("due_date") && (
      <LoaderCircle className="h-4 w-4 shrink-0 animate-spin text-blue-600" />
    )}

    {task.due_date && !isSaving("due_date") && (
      <button
        type="button"
        aria-label="Clear due date"
        onClick={() => void updateField("due_date", null)}
        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
</div>


                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Created By
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                        {getInitials(creatorName as string)}
                      </div>
                      <span className="text-sm font-medium text-slate-800">
                        {creatorName || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Created At
                  </label>

                  <div className="flex items-center rounded-xl border border-slate-200/60 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm">
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
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href);
                showToast({
                  type: "success",
                  message: "Link copied to clipboard.",
                });
              } catch {
                showToast({
                  type: "error",
                  message: "Unable to copy link.",
                });
              }
            }}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-800"
          >
            <Link2 className="h-3.5 w-3.5" />
            Copy link
          </button>
        </footer>

        {toast && (
          <div
            role="status"
            aria-live="polite"
            className={`absolute bottom-20 left-1/2 z-10 flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
              toast.type === "success"
                ? "bg-white text-green-700 ring-1 ring-green-200"
                : "bg-white text-red-600 ring-1 ring-red-200"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {toast.message}
          </div>
        )}
      </section>
    </div>
  );
}
