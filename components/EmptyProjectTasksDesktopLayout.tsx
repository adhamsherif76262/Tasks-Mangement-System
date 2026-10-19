"use client";

import { ChevronRight, Search } from "lucide-react";
import TaskColumn from "@/components/TaskColumn";

import useProjectTasks, {
  TASK_COLUMNS,
  type TaskStatus,
} from "@/app/hooks/useProjectTasks";
import { useState } from "react";
import TaskDetailsModal from "./TaskDetailsModal";
import { useParams } from "next/navigation";

interface Props {
  projectName?: string;
  columns: ReturnType<typeof useProjectTasks>["columns"];
  onRetry: (status: TaskStatus) => void;
  onAddTask: () => void;
}

export default function EmptyProjectTasksDesktopLayout({
  projectName = "Rafiq",
  columns,
  onRetry,
  onAddTask,
}: Props) {

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const params = useParams();
  const projectId = String(params.id ?? params.projectID ?? params.projectId ?? "");

  return (
    <div className="hidden h-full min-h-0 flex-col sm:flex">
      <div className="m-8 flex shrink-0 items-start justify-between">
        <div className="min-w-0">
          <div className="mb-5 hidden items-center gap-2 text-[10px] font-bold tracking-[0.12em] sm:flex">
            <span className="text-[#64748B]">PROJECTS</span>
            <ChevronRight size={11} className="text-[#94A3B8]" />
            <span className="max-w-36 truncate text-[#64748B]">
              {projectName}
            </span>
            <ChevronRight size={11} className="text-[#94A3B8]" />
            <span className="text-[#0B2347]">TASKS</span>
          </div>

          <h1 className="text-signup-headline-lg font-bold leading-none tracking-[-0.03em] text-[#09254D]">
            Active Workboard
          </h1>

          <p className="mt-2 text-[14px] text-[#71809A]">
            Curating Project Alpha&apos;s production pipeline and milestones.
          </p>
        </div>

        <div className="relative mt-[59px] w-[255px] shrink-0">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA0BC]"
          />
          <input
            type="text"
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="h-9 w-full rounded-sm border-0 bg-[#DCE6FF] pl-10 pr-3 text-[13px] text-[#0B2347] outline-none placeholder:text-[#71809A] focus:ring-1 focus:ring-[#B7C8F5]"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
        <div className="grid min-w-[2370px] grid-cols-8 gap-4 px-8 pb-8">
          {TASK_COLUMNS.map((column) => {
            const state = columns[column.status];

            return (
              <TaskColumn
                key={column.status}
                status={column.status}
                label={column.label}
                dotClass={column.dotClass}
                countClass={column.countClass}
                tasks={state.tasks}
                isLoading={state.isLoading}
                error={state.error}
                onRetry={onRetry}
                onAddTask={onAddTask}
                onTaskClick={(task) => setSelectedTaskId(task.id)}
              />

            );
          })}
        </div>
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