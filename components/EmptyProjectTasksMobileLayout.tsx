"use client";

import { Plus, Search } from "lucide-react";
import ProjectTaskCard from "@/components/ProjectTaskCard";
import {
  TASK_COLUMNS,
  type TaskStatus,
  // type ProjectTask,
} from "@/app/hooks/useProjectTasks";
import TaskDetailsModal from "./TaskDetailsModal";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { MobileTasksState, ProjectTask } from "@/app/hooks/useProjectTasks";

type ColumnState = {
  tasks: ProjectTask[];
  isLoading: boolean;
  error: string;
};

// interface Props {
//   columns: Record<TaskStatus, ColumnState>;
//   onRetry: (status: TaskStatus) => void;
//   onAddTask: () => void;
//   onTaskClick: (task: ProjectTask) => void;
// }

interface Props {
  mobile: MobileTasksState;
  onRetry: () => void;
  onLoadMore: () => void;
  onAddTask: () => void;
  onTaskClick: (task: ProjectTask) => void;
}

// export default function EmptyProjectTasksMobileLayout({
//   columns,
//   onRetry,
//   onAddTask,
//   onTaskClick
// }: Props) {

export default function EmptyProjectTasksMobileLayout({
  mobile,
  onRetry,
  onLoadMore,
  onAddTask,
  onTaskClick,
}: Props) {
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const params = useParams();
  const projectId = String(params.id ?? params.projectID ?? params.projectId ?? "");

  // const isLoading = TASK_COLUMNS.some(
  //   ({ status }) => columns[status].isLoading,
  // );

  // const failedColumns = TASK_COLUMNS.filter(
  //   ({ status }) => Boolean(columns[status].error),
  // );

  // const tasks = TASK_COLUMNS.flatMap(
  //   ({ status }) => columns[status].tasks,
  // );

  const {
  tasks,
  isLoading,
  error,
  hasMore,
  isLoadingMore,
  loadMoreError,
} = mobile;

const sentinelRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const sentinel = sentinelRef.current;

  if (
    !sentinel ||
    isLoading ||
    error ||
    isLoadingMore ||
    loadMoreError ||
    !hasMore
  ) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        onLoadMore();
      }
    },
    {
      root: null,
      rootMargin: "0px 0px 240px 0px",
      threshold: 0,
    },
  );

  observer.observe(sentinel);

  return () => observer.disconnect();
}, [
  isLoading,
  error,
  hasMore,
  isLoadingMore,
  loadMoreError,
  onLoadMore,
]);

  return (
    <div className="mx-4 mb-0 mt-5 flex flex-col gap-4 sm:hidden">
      <h1 className="text-signup-headline-lg font-bold leading-none tracking-[-0.03em] text-[#09254D]">
        Active Workboard
      </h1>

      <div className="relative mt-2 w-full shrink-0">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA0BC]"
        />
        <input
          type="text"
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className="h-12 w-full rounded-lg border-0 bg-[#DCE6FF] pl-10 pr-3 text-[13px] text-[#0B2347] outline-none placeholder:text-[#71809A] focus:ring-1 focus:ring-[#B7C8F5]"
        />
      </div>

      <button
        type="button"
        onClick={onAddTask}
        className="flex h-8 w-full items-center justify-center gap-1 rounded-md bg-[#0047B8] text-xs font-bold tracking-widest text-white shadow-sm transition-colors active:bg-[#003A96]"
      >
        <Plus size={14} strokeWidth={2.5} />
        <span>ADD NEW TASK</span>
      </button>

      <div className="mb-20 mt-3 flex flex-col gap-3">
        {isLoading && tasks.length === 0 && (
          <>
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-lg bg-white p-4"
              >
                <div className="flex justify-between">
                  <div className="h-3 w-16 rounded bg-slate-100" />
                  <div className="h-5 w-20 rounded bg-slate-100" />
                </div>
                <div className="mt-4 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
                <div className="mt-5 h-4 w-20 rounded bg-slate-100" />
              </div>
            ))}
          </>
        )}

        {/* {failedColumns.map(({ status, label }) => (
          <div
            key={status}
            className="rounded-lg border border-red-100 bg-white p-3"
          >
            <p className="text-xs font-semibold text-red-600">
              Could not load {label} tasks.
            </p>
            <button
              type="button"
              onClick={() => onRetry(status)}
              className="mt-2 text-xs font-semibold text-blue-700"
            >
              Retry
            </button>
          </div>
        ))} */}

        {/* {!isLoading && tasks.length === 0 && failedColumns.length === 0 && ( */}
        {!isLoading && tasks.length === 0 && (
          <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#E0E5EF] bg-[#FBFCFF]">
            <svg
              width="27"
              height="30"
              viewBox="0 0 27 30"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M10.05 25.05L7.95 22.95L11.4 19.5L7.95 16.05L10.05 13.95L13.5 17.4L16.95 13.95L19.05 16.05L15.6 19.5L19.05 22.95L16.95 25.05L13.5 21.6L10.05 25.05ZM3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V6C0 5.175 0.29375 4.46875 0.88125 3.88125C1.46875 3.29375 2.175 3 3 3H4.5V0H7.5V3H19.5V0H22.5V3H24C24.825 3 25.5312 3.29375 26.1187 3.88125C26.7062 4.46875 27 5.175 27 6V27C27 27.825 26.7062 28.5312 26.1187 29.1187C25.5312 29.7062 24.825 30 24 30H3ZM3 27H24V12H3V27ZM3 9H24V6H3V9Z"
                fill="#94A3B8"
              />
            </svg>
            <span className="mt-3 text-[11px] font-bold tracking-widest text-[#94A3B8]">
              NO TASKS
            </span>
          </div>
        )}

        {tasks.map((task) => (
          <ProjectTaskCard
            key={task.id}
            task={task}
            mobile
            onClick={() => {
              // 1. Fire local state change to set the ID and open modal
              setSelectedTaskId(task.id);
              // 2. Keep the optional parent click callback functional if needed
              if (onTaskClick) onTaskClick(task);
            }}
          />
        ))}

        {!isLoading && !error && tasks.length > 0 && hasMore && (
  <div ref={sentinelRef} aria-hidden="true" className="h-px" />
)}

{isLoadingMore && (
  <div
    role="status"
    className="flex items-center justify-center gap-2 py-4 text-sm text-gray-500"
  >
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
    Loading more tasks…
  </div>
)}

{loadMoreError && (
  <div className="flex flex-col items-center gap-2 py-4">
    <p className="text-sm text-gray-500">{loadMoreError}</p>
    <button
      type="button"
      onClick={onLoadMore}
      className="rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
    >
      Retry
    </button>
  </div>
)}
      </div>

      <TaskDetailsModal
        isOpen={selectedTaskId !== null}
        projectId={projectId}
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
}
