"use client";

import { Plus, RefreshCw } from "lucide-react";
import ProjectTaskCard from "@/components/ProjectTaskCard";
import type { ProjectTask, TaskStatus } from "@/app/hooks/useProjectTasks";

interface TaskColumnProps {
  status: TaskStatus;
  label: string;
  dotClass: string;
  countClass: string;
  tasks: ProjectTask[];
  isLoading: boolean;
  error: string;
  onRetry: (status: TaskStatus) => void;
  onAddTask: () => void;
  onTaskClick: (task: ProjectTask) => void;
}

export default function TaskColumn({
  status,
  label,
  dotClass,
  countClass,
  tasks,
  isLoading,
  error,
  onRetry,
  onAddTask,
  onTaskClick,
}: TaskColumnProps) {
  return (
    <section className="flex h-[750px] min-w-[270px] max-w-5xl flex-1 flex-col p-2">
      <div className="mb-4 flex h-5 shrink-0 items-center gap-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`}
          aria-hidden="true"
        />

        <span className="whitespace-nowrap text-[10px] font-bold tracking-[0.12em] text-[#64748B]">
          {label}
        </span>

        <span
          className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-[2px] px-1 text-[10px] font-bold ${countClass}`}
        >
          {isLoading ? "…" : error ? "—" : tasks.length}
        </span>
      </div>

      <button
        type="button"
        onClick={onAddTask}
        className="mb-4 flex h-[42px] w-full shrink-0 items-center justify-center gap-3 rounded-[5px] border border-dashed border-[#DDE3EF] bg-transparent text-[11px] font-bold tracking-widest text-[#9298A7] transition-colors hover:bg-[#F8F9FC]"
      >
        <Plus size={16} strokeWidth={1.8} />
        <span>ADD NEW TASK</span>
      </button>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overflow-x-hidden rounded-md">
        {isLoading &&
          [1, 2].map((item) => (
            <div
              key={item}
              className="animate-pulse rounded-lg border border-slate-100 bg-white p-4"
            >
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="mt-4 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
              <div className="mt-5 h-4 w-20 rounded bg-slate-100" />
            </div>
          ))}

        {!isLoading && error && (
          <div className="flex flex-col items-center gap-3 rounded-lg border border-red-100 bg-white px-4 py-8 text-center">
            <p className="text-xs leading-relaxed font-black text-semantic-error">{error}</p>
            <button
              type="button"
              onClick={() => onRetry(status)}
              className="inline-flex items-center gap-1.5 text-xs font-black text-blue-700 hover:text-blue-900"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        {!isLoading && !error && tasks.length === 0 && (
          // <div className="flex min-h-[220px] flex-col items-center justify-center rounded-md border border-dashed border-[#E0E5EF] bg-[#FBFCFF]">
          //   <svg
          //     width="27"
          //     height="30"
          //     viewBox="0 0 27 30"
          //     fill="none"
          //     aria-hidden="true"
          //   >
          //     <path
          //       d="M10.05 25.05L7.95 22.95L11.4 19.5L7.95 16.05L10.05 13.95L13.5 17.4L16.95 13.95L19.05 16.05L15.6 19.5L19.05 22.95L16.95 25.05L13.5 21.6L10.05 25.05ZM3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V6C0 5.175 0.29375 4.46875 0.88125 3.88125C1.46875 3.29375 2.175 3 3 3H4.5V0H7.5V3H19.5V0H22.5V3H24C24.825 3 25.5312 3.29375 26.1187 3.88125C26.7062 4.46875 27 5.175 27 6V27C27 27.825 26.7062 28.5312 26.1187 29.1187C25.5312 29.7062 24.825 30 24 30H3ZM3 27H24V12H3V27ZM3 9H24V6H3V9Z"
          //       fill="#94A3B8"
          //     />
          //   </svg>
          //   <span className="mt-3 text-[10px] font-bold tracking-widest text-[#9AA9C3]">
          //     NO TASKS
          //   </span>
          // </div>
          <div className="flex min-h-[639px] flex-1 items-center justify-center rounded-md border border-dashed border-[#E0E5EF] bg-[#FBFCFF]">
            <div className="flex flex-col items-center justify-center">
              <svg width="27" height="30" viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.05 25.05L7.95 22.95L11.4 19.5L7.95 16.05L10.05 13.95L13.5 17.4L16.95 13.95L19.05 16.05L15.6 19.5L19.05 22.95L16.95 25.05L13.5 21.6L10.05 25.05ZM3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V6C0 5.175 0.29375 4.46875 0.88125 3.88125C1.46875 3.29375 2.175 3 3 3H4.5V0H7.5V3H19.5V0H22.5V3H24C24.825 3 25.5312 3.29375 26.1187 3.88125C26.7062 4.46875 27 5.175 27 6V27C27 27.825 26.7062 28.5312 26.1187 29.1187C25.5312 29.7062 24.825 30 24 30H3ZM3 27H24V12H3V27ZM3 9H24V6H3V9ZM3 9V6V9Z" fill="#94A3B8"/>
              </svg>
              <span className="mt-3 text-[11px] font-bold tracking-widest text-[#9AA9C3]">
                NO TASKS
              </span>
            </div>
          </div>
        )}

        {!isLoading &&
          !error &&
          tasks.map((task) => <ProjectTaskCard key={task.id} task={task} onClick={() => onTaskClick(task)}/>)}
      </div>
    </section>
  );
}