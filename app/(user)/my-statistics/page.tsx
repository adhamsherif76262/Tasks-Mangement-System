/* eslint-disable react-hooks/set-state-in-effect */
// import Button from "@/components/ui/button";
// import { Input } from "@/components/ui/Input";
// import Image from "next/image";

// export default function Statistics() {
//   return (
//     <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-gray-200 px-16 py-32 sm:items-start ">
//               <h1>Statistics Page</h1>

//       <Button text="Primary Action" variant="ghost" className="shadow[0px_25px_50px_-12px_#003D9B4D] h-10 px-6 py-2.5 hover:cursor-pointer"></Button>
//       <Input type="text" variant="error" label="Email" label_class="text-label-xs uppercase text-slate-neutral-medium" helperText="THe Helper Text" placeholder="ssssssssssssssssss"  className="rounded-sm"/>
//       </main>
//     </div>
//   );
// }




"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FolderOpen,
  LoaderCircle,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";

const TASK_STATUSES = [
  { value: "TO_DO", label: "To Do", color: "#C9D9FF", text: "#082653" },
  { value: "IN_PROGRESS", label: "In Progress", color: "#064CCB", text: "#FFFFFF" },
  { value: "BLOCKED", label: "Blocked", color: "#C91D20", text: "#FFFFFF" },
  { value: "IN_REVIEW", label: "In Review", color: "#53627A", text: "#FFFFFF" },
  { value: "READY_FOR_QA", label: "Ready for QA", color: "#4285F4", text: "#FFFFFF" },
  { value: "REOPENED", label: "Reopened", color: "#E7A1A1", text: "#7D1111" },
  { value: "READY_FOR_PRODUCTION", label: "Ready for Production", color: "#07583F", text: "#FFFFFF" },
  { value: "DONE", label: "Done", color: "#62D9A8", text: "#073D2A" },
] as const;

type TaskStatus = (typeof TASK_STATUSES)[number]["value"];

type CalendarDay = {
  day: string;
  statuses?: Partial<Record<TaskStatus, number>>;
};

type CalendarStats = {
  daily?: CalendarDay[];
  totals?: Partial<Record<TaskStatus, number>>;
  total_tasks?: number;
  done_tasks?: number;
  overdue_tasks?: number;
};

type ProjectStats = {
  project_id: string;
  project_name: string;
  tasks_count: number;
};

type ProjectOption = {
  id: string;
  name: string;
};

type Filters = {
  startDate: string;
  endDate: string;
  projectId: string;
  status: string;
};

function localDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCurrentWeek() {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const day = start.getDay();
  start.setDate(start.getDate() - ((day + 6) % 7));

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    startDate: localDateString(start),
    endDate: localDateString(end),
  };
}

function inclusiveDays(start: string, end: string) {
  if (!start || !end) return 0;

  const startTime = Date.parse(`${start}T00:00:00Z`);
  const endTime = Date.parse(`${end}T00:00:00Z`);

  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return 0;

  return Math.floor((endTime - startTime) / 86_400_000) + 1;
}

function formatRange(start: string, end: string) {
  if (!start || !end) return "Select date range";

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);

  return `${startDate.toLocaleDateString("en-US", options)} - ${endDate.toLocaleDateString("en-US", {
    ...options,
    year: start.slice(0, 4) !== end.slice(0, 4) ? "numeric" : undefined,
  })}`;
}

function formatDay(value: string) {
  const date = new Date(`${value}T12:00:00`);

  return {
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    monthDay: date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }),
  };
}

function readError(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "error" in payload) {
    const message = (payload as { error?: unknown }).error;
    if (typeof message === "string") return message;
  }

  return fallback;
}

function StatusBadge({
  status,
  count,
}: {
  status: TaskStatus;
  count: number;
}) {
  const config = TASK_STATUSES.find((item) => item.value === status);
  if (!config || count <= 0) return null;

  return (
    <span
      className="inline-flex min-h-7 items-center gap-2 rounded-sm px-2 py-1 text-[10px] font-semibold leading-4 sm:text-xs"
      style={{ backgroundColor: `${config.color}24`, color: config.text === "#FFFFFF" ? config.color : "#09264D" }}
      title={`${config.label}: ${count}`}
    >
      <span className="max-w-28 truncate">{config.label}</span>
      <span className="font-bold tabular-nums">{count}</span>
    </span>
  );
}

// function DonutChart({ totals }: { totals: Partial<Record<TaskStatus, number>> }) {
//   const values = TASK_STATUSES.map((status) => ({
//     ...status,
//     count: Math.max(0, Number(totals[status.value] ?? 0)),
//   })).filter((status) => status.count > 0);

//   const total = values.reduce((sum, status) => sum + status.count, 0);

//   let currentAngle = 0;
//   const segments = values.map((status) => {
//     const start = currentAngle;
//     const angle = (status.count / (total || 1)) * 360;
//     currentAngle += angle;
//     return `${status.color} ${start}deg ${currentAngle}deg`;
//   });

//   const background =
//     total > 0
//       ? `conic-gradient(${segments.join(", ")})`
//       : "#E8EDFA";

//   return (
//     <div className="flex flex-col items-center gap-7 sm:flex-row sm:justify-center sm:gap-8">
//       <div
//         className="relative h-44 w-44 shrink-0 rounded-full sm:h-52 sm:w-52"
//         style={{
//           background,
//           maskImage: "radial-gradient(circle, transparent 0 59%, black 60%)",
//           WebkitMaskImage: "radial-gradient(circle, transparent 0 59%, black 60%)",
//         }}
//         role="img"
//         aria-label={`Tasks by status, ${total} total`}
//       />
//       <div className="absolute hidden" aria-hidden="true" />
//       <div className="-mt-36 mb-7 flex h-20 w-36 flex-col items-center justify-center sm:absolute sm:mt-0 sm:mb-0">
//         <span className="text-3xl font-bold leading-9 text-[#24272D]">
//           {total.toLocaleString()}
//         </span>
//         <span className="text-sm font-semibold text-[#9AA5B7]">Total</span>
//       </div>

//       <div className="w-full space-y-3 sm:w-44">
//         {values.length ? (
//           values.map((status) => (
//             <div key={status.value} className="flex items-center gap-2 text-xs">
//               <span
//                 className="h-2 w-2 shrink-0 rounded-full"
//                 style={{ backgroundColor: status.color }}
//               />
//               <span className="min-w-0 flex-1 truncate text-[#344866]">
//                 {status.label}
//               </span>
//               <span className="font-semibold tabular-nums text-[#09264D]">
//                 {status.count}
//               </span>
//             </div>
//           ))
//         ) : (
//           <p className="text-center text-sm text-slate-500">
//             No task statistics for this range.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }


function DonutChart({ totals }: { totals: Partial<Record<TaskStatus, number>> }) {
  const values = TASK_STATUSES.map((status) => ({
    ...status,
    count: Math.max(0, Number(totals[status.value] ?? 0)),
  })).filter((status) => status.count > 0);

  const total = values.reduce((sum, status) => sum + status.count, 0);

  let currentAngle = 0;
  const segments = values.map((status) => {
    const start = currentAngle;
    currentAngle += (status.count / total) * 360;
    return `${status.color} ${start}deg ${currentAngle}deg`;
  });

  const background =
    total > 0
      ? `conic-gradient(${segments.join(", ")})`
      : "#E8EDFA";

  return (
    <div className="flex flex-col items-center gap-7 sm:flex-row sm:justify-center sm:gap-8">
      <div
        className="relative h-44 w-44 shrink-0 rounded-full sm:h-52 sm:w-52"
        role="img"
        aria-label={`Tasks by status: ${total} total`}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background,
            maskImage: "radial-gradient(circle, transparent 0 45%, black 46%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 0 45%, black 46%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold leading-9 text-[#24272D]">
            {total.toLocaleString()}
          </span>
          <span className="text-sm font-semibold text-[#9AA5B7]">
            Total
          </span>
        </div>
      </div>

      <div className="w-full space-y-3 sm:w-44">
        {values.length ? (
          values.map((item) => (
            <div key={item.value} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="min-w-0 flex-1 truncate text-[#344866]">
                {item.label}
              </span>
              <span className="font-semibold tabular-nums text-[#09264D]">
                {item.count}
              </span>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-slate-500">
            No task statistics for this range.
          </p>
        )}
      </div>
    </div>
  );
}

function LoadingPanel() {
  return (
    <div className="flex min-h-28 items-center justify-center gap-2 text-sm text-[#60718D]">
      <LoaderCircle className="h-5 w-5 animate-spin" />
      Loading statistics...
    </div>
  );
}

function ErrorPanel({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="flex items-center gap-2 text-sm text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0" />
        {message}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-md border border-[#D7E0F1] px-3 py-2 text-sm font-semibold text-[#064CCB] hover:bg-[#F1F5FF]"
      >
        <RotateCcw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
}

export default function Statistics() {
  const initialWeek = useMemo(() => getCurrentWeek(), []);
  const [draftStart, setDraftStart] = useState(initialWeek.startDate);
  const [draftEnd, setDraftEnd] = useState(initialWeek.endDate);
  const [projectId, setProjectId] = useState("");
  const [status, setStatus] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<Filters>({
    ...initialWeek,
    projectId: "",
    status: "",
  });

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [calendar, setCalendar] = useState<CalendarStats | null>(null);
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [projectStatsLoading, setProjectStatsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [calendarError, setCalendarError] = useState("");
  const [projectStatsError, setProjectStatsError] = useState("");
  const [filterError, setFilterError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const requestVersion = useRef(0);

  const rangeLength = inclusiveDays(draftStart, draftEnd);
  const rangeInvalid = rangeLength < 1 || rangeLength > 7;

  // const fetchProjects = useCallback(async (signal?: AbortSignal) => {
  //   setProjectsLoading(true);
  //   setProjectsError("");

  //   try {
  //     const response = await fetch("/api/projects?limit=100&offset=0", {
  //       method: "GET",
  //       cache: "no-store",
  //       signal,
  //     });

  //     const result = await response.json().catch(() => null);

  //     if (!response.ok) {
  //       throw new Error(readError(result, "Failed to load projects."));
  //     }

  //     const rows = Array.isArray(result)
  //       ? result
  //       : Array.isArray(result?.data)
  //         ? result.data
  //         : [];

  //     setProjects(
  //       rows
  //         .map((item: Record<string, unknown>) => ({
  //           id: String(item.id ?? item.project_id ?? ""),
  //           name: String(item.name ?? item.project_name ?? "Untitled project"),
  //         }))
  //         .filter((item: ProjectOption) => Boolean(item.id)),
  //     );
  //   } catch (error) {
  //     if (error instanceof Error && error.name === "AbortError") return;
  //     setProjectsError(error instanceof Error ? error.message : "Failed to load projects.");
  //   } finally {
  //     if (!signal?.aborted) setProjectsLoading(false);
  //   }
  // }, []);

  
const fetchProjects = useCallback(async (signal?: AbortSignal) => {
  setProjectsLoading(true);
  setProjectsError("");

  try {
    const response = await fetch("/api/projects?limit=100&offset=0", {
      method: "GET",
      cache: "no-store",
      signal,
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(readError(result, "Failed to load projects."));
    }

    const rows = Array.isArray(result)
      ? result
      : Array.isArray(result?.data)
        ? result.data
        : [];

    const normalizedProjects: ProjectOption[] = rows
      .map((item: Record<string, unknown>) => ({
        id: String(item.id ?? item.project_id ?? "").trim(),
        name: String(
          item.name ?? item.project_name ?? "Untitled project",
        ).trim() || "Untitled project",
      }))
      .filter((item: ProjectOption) => Boolean(item.id));

    // Keep one option per project UUID, even if the API returns duplicates.
    const uniqueProjects = Array.from(
      new Map(
        normalizedProjects.map((project) => [project.id, project]),
      ).values(),
    );

    console.table(
  normalizedProjects.map(({ id, name }) => ({ id, name })),
);

    setProjects(uniqueProjects);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return;

    setProjectsError(
      error instanceof Error
        ? error.message
        : "Failed to load projects.",
    );
  } finally {
    if (!signal?.aborted) {
      setProjectsLoading(false);
    }
  }
}, []);

  useEffect(() => {
    const controller = new AbortController();
    void fetchProjects(controller.signal);
    return () => controller.abort();
  }, [fetchProjects]);

  const fetchStatistics = useCallback(async () => {
    if (inclusiveDays(appliedFilters.startDate, appliedFilters.endDate) < 1 ||
        inclusiveDays(appliedFilters.startDate, appliedFilters.endDate) > 7) {
      return;
    }

    const version = ++requestVersion.current;
    const controller = new AbortController();

    setCalendarLoading(true);
    setProjectStatsLoading(true);
    setCalendarError("");
    setProjectStatsError("");
    setCalendar(null);
    setProjectStats([]);

    const calendarRequest = fetch("/api/my-statistics/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        p_start_date: appliedFilters.startDate,
        p_end_date: appliedFilters.endDate,
        p_project_id: appliedFilters.projectId || null,
        p_status: appliedFilters.status || null,
      }),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(readError(result, "Failed to load calendar statistics."));
        if (version === requestVersion.current) setCalendar(result as CalendarStats);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        if (version === requestVersion.current) {
          setCalendarError(error instanceof Error ? error.message : "Failed to load calendar statistics.");
        }
      })
      .finally(() => {
        if (version === requestVersion.current) setCalendarLoading(false);
      });

    const projectsRequest = fetch("/api/my-statistics/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        p_start_date: appliedFilters.startDate,
        p_end_date: appliedFilters.endDate,
      }),
    })
      .then(async (response) => {
        const result = await response.json().catch(() => null);
        if (!response.ok) throw new Error(readError(result, "Failed to load project statistics."));
        if (version === requestVersion.current) {
          setProjectStats(Array.isArray(result) ? result : []);
        }
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        if (version === requestVersion.current) {
          setProjectStatsError(error instanceof Error ? error.message : "Failed to load project statistics.");
        }
      })
      .finally(() => {
        if (version === requestVersion.current) setProjectStatsLoading(false);
      });

    await Promise.all([calendarRequest, projectsRequest]);

    return () => controller.abort();
  }, [appliedFilters]);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    void fetchStatistics().then((result) => {
      cleanup = result;
    });
    return () => {
      cleanup?.();
      requestVersion.current += 1;
    };
  }, [fetchStatistics, refreshKey]);

  function applyFilters() {
    if (rangeInvalid) {
      setFilterError("Choose a valid date range of no more than 7 calendar days.");
      return;
    }

    setFilterError("");
    setAppliedFilters({
      startDate: draftStart,
      endDate: draftEnd,
      projectId,
      status,
    });
  }

  const days = useMemo(() => {
    const startTime = Date.parse(`${appliedFilters.startDate}T12:00:00`);
    const count = inclusiveDays(appliedFilters.startDate, appliedFilters.endDate);

    if (!Number.isFinite(startTime) || count < 1 || count > 7) return [];

    return Array.from({ length: count }, (_, index) => {
      const date = new Date(startTime);
      date.setDate(date.getDate() + index);
      return localDateString(date);
    });
  }, [appliedFilters.startDate, appliedFilters.endDate]);

  const dailyByDate = useMemo(
    () => new Map((calendar?.daily ?? []).map((item) => [item.day, item])),
    [calendar],
  );

  const monthTitle = useMemo(() => {
    if (!days.length) return "";
    return new Date(`${days[0]}T12:00:00`).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [days]);

  return (
    <main className="min-w-0 flex-1 bg-[#F8F9FF] px-4 pb-24 pt-6 text-[#09264D] sm:px-6 sm:pb-8 sm:pt-7 xl:px-8">
      <div className="mx-auto w-full max-w-[1440px]">
        <header className="mb-7 hidden sm:block">
          <h1 className="text-3xl font-bold tracking-tight text-[#071F42]">
            Weekly Planner
          </h1>
          <p className="mt-1 text-base text-[#50586A]">
            Manage your deadlines and track team velocity.
          </p>
        </header>

        <section className="mb-7 rounded-xl bg-[#F0F3FF] p-3 sm:flex sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
          <div className="grid grid-cols-1 gap-3 sm:flex sm:min-w-0 sm:flex-1 sm:items-center">
            <label className="flex h-11 min-w-0 items-center gap-2 rounded-lg bg-white px-3 text-sm sm:max-w-[310px]">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#445775]" />
              <span className="sr-only">Start date</span>
              <input
                type="date"
                value={draftStart}
                onChange={(event) => {
                  setDraftStart(event.target.value);
                  setFilterError("");
                }}
                className="min-w-0 w-full bg-transparent text-xs font-semibold outline-none sm:text-sm"
              />
              <span className="text-[#8C97AB]">–</span>
              <span className="sr-only">End date</span>
              <input
                type="date"
                value={draftEnd}
                onChange={(event) => {
                  setDraftEnd(event.target.value);
                  setFilterError("");
                }}
                className="min-w-0 w-full bg-transparent text-xs font-semibold outline-none sm:text-sm"
              />
            </label>

            <label className="flex h-11 items-center justify-between gap-3 rounded-lg bg-white px-3 text-sm sm:min-w-48">
              <span className="sr-only">Filter by project</span>
              <select
                value={projectId}
                onChange={(event) => setProjectId(event.target.value)}
                disabled={projectsLoading}
                className="w-full min-w-0 appearance-none bg-transparent text-sm font-medium outline-none"
              >
                <option value="">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
              {projectsLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin text-[#7D8AA2]" />
              ) : (
                <ChevronDown className="h-4 w-4 shrink-0 text-[#7D8AA2]" />
              )}
            </label>

            <label className="flex h-11 items-center justify-between gap-3 rounded-lg bg-white px-3 text-sm sm:min-w-44">
              <span className="sr-only">Filter by status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full min-w-0 appearance-none bg-transparent text-sm font-medium outline-none"
              >
                <option value="">All Statuses</option>
                {TASK_STATUSES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
              <ChevronDown className="h-4 w-4 shrink-0 text-[#7D8AA2]" />
            </label>
          </div>

          <button
            type="button"
            onClick={applyFilters}
            className="mt-3 h-11 w-full rounded-lg bg-[#064CCB] px-5 text-sm font-semibold text-white transition hover:bg-[#003D9B] sm:mt-0 sm:w-auto"
          >
            Apply Filters
          </button>

          {(filterError || (rangeLength > 7)) && (
            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-red-700 sm:absolute sm:mt-14">
              <TriangleAlert className="h-4 w-4 shrink-0" />
              {filterError || "Select a maximum of 7 calendar days, including both endpoints."}
            </p>
          )}
        </section>

        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#526482] sm:hidden">
            Quick Overview
          </p>
          <p className="hidden text-sm font-semibold text-[#526482] sm:block">
            {formatRange(appliedFilters.startDate, appliedFilters.endDate)}
          </p>
        </div>

        <section className="-mx-4 mb-9 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:overflow-visible sm:px-0">
          <article className="min-w-35 flex flex-row-reverse max-xxs:flex-col  justify-between items-center snap-start rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(4,27,60,0.06)] sm:min-w-0 sm:p-6">
            <div className="p-4 xxs:bg-[#0052CC1A]"><ClipboardList className="m-auto  h-5 w-5 text-[#064CCB]" /></div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#3F4B60] sm:text-xs">
                Total Tasks
              </p>
              {calendarLoading ? (
                <div className="mt-1 h-8 w-12 animate-pulse rounded bg-[#EEF2FA]" />
              ) : calendarError ? (
                <span className="text-sm text-red-700">—</span>
              ) : (
                <p className="text-2xl mt-2 font-bold leading-8 tabular-nums text-[#09264D]">
                  {(calendar?.total_tasks ?? 0).toLocaleString()}
                </p>
              )}
            </div>
          </article>

          <article className="min-w-[140px] flex flex-row-reverse max-xxs:flex-col justify-between items-center snap-start rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(4,27,60,0.06)] sm:min-w-0 sm:p-6">
            <div className="p-4 xxs:bg-[#0052CC1A]">

            <CheckCircle2 className="h-5 w-5 text-[#08784E]" />
            </div>
            <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#3F4B60] sm:text-xs">
              Completed
            </p>
            {calendarLoading ? (
              <div className="mt-1 h-8 w-12 animate-pulse rounded bg-[#EEF2FA]" />
            ) : calendarError ? (
              <span className="text-sm text-red-700">—</span>
            ) : (
              <p className="text-2xl font-bold mt-2 leading-8 tabular-nums text-[#09264D]">
                {(calendar?.done_tasks ?? 0).toLocaleString()}
              </p>
            )}
            </div>
          </article>

          <article className="min-w-[140px] flex flex-row-reverse max-xxs:flex-col justify-between items-center snap-start rounded-xl bg-white p-4 shadow-[0_1px_2px_rgba(4,27,60,0.06)] sm:min-w-0 sm:p-6">
            <div className="p-4 xxs:bg-[#D21F261A]">
              <TriangleAlert className="m-auto h-5 w-5 text-[#D21F26]" />
            </div>
            <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-[#3F4B60] sm:text-xs">
              Overdue Tasks
            </p>
            {calendarLoading ? (
              <div className="mt-1 h-8 w-12 animate-pulse rounded bg-[#EEF2FA]" />
            ) : calendarError ? (
              <span className="text-sm text-red-700">—</span>
            ) : (
              <p className="text-2xl font-bold leading-8 mt-2 tabular-nums text-[#C91D20]">
                {(calendar?.overdue_tasks ?? 0).toLocaleString()}
              </p>
            )}
            </div>
          </article>
        </section>

        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#09264D] sm:text-xl">Calendar</h2>
            <span className="text-xs text-[#71809A] sm:hidden">{formatRange(appliedFilters.startDate, appliedFilters.endDate)}</span>
          </div>

          <div className="mb-3 hidden items-center justify-between rounded-lg bg-[#F0F3FF] px-5 py-3 md:flex">
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Previous week"
                onClick={() => {
                  const start = new Date(`${draftStart}T12:00:00`);
                  const end = new Date(`${draftEnd}T12:00:00`);
                  start.setDate(start.getDate() - 7);
                  end.setDate(end.getDate() - 7);
                  setDraftStart(localDateString(start));
                  setDraftEnd(localDateString(end));
                }}
                className="rounded p-1 hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm font-semibold">
                {formatRange(appliedFilters.startDate, appliedFilters.endDate)}
              </span>
              <button
                type="button"
                aria-label="Next week"
                onClick={() => {
                  const start = new Date(`${draftStart}T12:00:00`);
                  const end = new Date(`${draftEnd}T12:00:00`);
                  start.setDate(start.getDate() + 7);
                  end.setDate(end.getDate() + 7);
                  setDraftStart(localDateString(start));
                  setDraftEnd(localDateString(end));
                }}
                className="rounded p-1 hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-[#60718D]">
              {days.length} calendar {days.length === 1 ? "day" : "days"}
            </p>
          </div>

          {calendarError ? (
            <div className="rounded-xl bg-white">
              <ErrorPanel message={calendarError} onRetry={() => setRefreshKey((value) => value + 1)} />
            </div>
          ) : calendarLoading ? (
            <div className="rounded-xl bg-white">
              <LoadingPanel />
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-7 gap-3 md:grid">
                {days.map((day) => {
                  const details = formatDay(day);
                  const daily = dailyByDate.get(day);
                  const statuses = daily?.statuses ?? {};
                  const activeStatuses = TASK_STATUSES.filter(
                    (item) => Number(statuses[item.value] ?? 0) > 0,
                  );

                  return (
                    <article
                      key={day}
                      className="min-h-[330px] rounded-xl border border-[#EDF0F7] bg-white p-3 shadow-[0_1px_2px_rgba(4,27,60,0.03)]"
                    >
                      <p className="text-xs font-semibold uppercase text-[#8B97AA]">
                        {details.weekday}
                      </p>
                      <p className="mb-5 mt-1 text-xl font-bold text-[#09264D]">
                        {details.day} {new Date(`${day}T12:00:00`).toLocaleDateString("en-US", { month: "short" })}
                      </p>
                      {activeStatuses.length ? (
                        <div className="space-y-2">
                          {activeStatuses.map((item) => (
                            <StatusBadge
                              key={item.value}
                              status={item.value}
                              count={Number(statuses[item.value] ?? 0)}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex min-h-36 flex-col items-center justify-center gap-2 text-[#AAB3C2]">
                          <CalendarDays className="h-7 w-7" />
                          <span className="text-[10px] font-semibold uppercase tracking-wide">No Tasks</span>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              <div className="space-y-2 md:hidden">
                {days.map((day) => {
                  const details = formatDay(day);
                  const statuses = dailyByDate.get(day)?.statuses ?? {};
                  const activeStatuses = TASK_STATUSES.filter(
                    (item) => Number(statuses[item.value] ?? 0) > 0,
                  );
                  const today = day === localDateString(new Date());

                  return (
                    <article
                      key={day}
                      className={`flex min-h-[58px] items-center gap-3 rounded-lg px-4 py-3 ${
                        today
                          ? "border border-[#C4D6FF] border-l-4 border-l-[#064CCB] bg-white"
                          : "bg-[#F0F3FF]"
                      }`}
                    >
                      <div className="w-11 shrink-0 border-r border-[#DFE5F3] pr-3">
                        <p className={`text-[9px] font-bold uppercase ${today ? "text-[#064CCB]" : "text-[#647694]"}`}>
                          {details.weekday}
                        </p>
                        <p className={`text-base font-bold ${today ? "text-[#064CCB]" : "text-[#09264D]"}`}>
                          {details.day}
                        </p>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                        {activeStatuses.length ? (
                          activeStatuses.map((item) => (
                            <span
                              key={item.value}
                              title={`${item.label}: ${statuses[item.value]}`}
                              className="inline-flex h-5 min-w-5 items-center justify-center rounded-sm px-1 text-[10px] font-bold"
                              style={{
                                backgroundColor: item.color,
                                color: item.text,
                              }}
                            >
                              {statuses[item.value]}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-[#8996AC]">No Tasks</span>
                        )}
                      </div>
                      {today && (
                        <span className="rounded-full bg-[#064CCB] px-2 py-1 text-[8px] font-bold uppercase text-white">
                          Today
                        </span>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </section>

        <section className="mb-6">
          <h2 className="mb-4 text-lg font-bold text-[#09264D] sm:text-xl">Task Statistics</h2>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_1fr] xl:gap-6">
            <article className="min-h-[260px] rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(4,27,60,0.06)] sm:p-7">
              <h3 className="mb-7 text-lg font-bold text-[#09264D]">Tasks By Status</h3>
              {calendarError ? (
                <ErrorPanel message={calendarError} onRetry={() => setRefreshKey((value) => value + 1)} />
              ) : calendarLoading ? (
                <LoadingPanel />
              ) : (
                <DonutChart totals={calendar?.totals ?? {}} />
              )}
            </article>

            <article className="min-h-[220px] rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(4,27,60,0.06)] sm:p-7">
              <h3 className="mb-6 text-lg font-bold text-[#09264D]">All Projects</h3>
              {projectStatsError ? (
                <ErrorPanel message={projectStatsError} onRetry={() => setRefreshKey((value) => value + 1)} />
              ) : projectStatsLoading ? (
                <LoadingPanel />
              ) : projectStats.length ? (
                <div className="space-y-4">
                  {projectStats.map((project) => (
                    <div
                      key={project.project_id}
                      className="flex items-center justify-between gap-4 text-xs"
                    >
                      <span className="min-w-0 truncate font-semibold text-[#344866]">
                        {project.project_name}
                      </span>
                      <span className="shrink-0 font-bold tabular-nums text-[#09264D]">
                        {Number(project.tasks_count ?? 0).toLocaleString()} Tasks
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex min-h-24 flex-col items-center justify-center gap-2 text-center text-sm text-[#8A96AA]">
                  <FolderOpen className="h-7 w-7" />
                  No project task statistics for this date range.
                </div>
              )}
              {projectsError && (
                <p className="mt-4 text-xs text-red-700">
                  Project filter options could not be loaded: {projectsError}
                </p>
              )}
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
