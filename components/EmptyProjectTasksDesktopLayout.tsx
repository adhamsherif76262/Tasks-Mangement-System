"use client"
import {
  ChevronRight,
  Search,
} from "lucide-react";
import TaskColumn from "@/components/TaskColumn";

const TASK_COLUMNS = [
  {
    id: "todo",
    label: "TO DO",
    count: 0,
    dotClass: "bg-[#94A3B8]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    id: "in-progress",
    label: "IN PROGRESS",
    count: 0,
    dotClass: "bg-[#1769E0]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    id: "blocked",
    label: "BLOCKED",
    count: 0,
    dotClass: "bg-[#D21F26]",
    countClass: "bg-[#FFE0E0] text-[#D21F26]",
  },
  {
    id: "in-review",
    label: "IN REVIEW",
    count: 0,
    dotClass: "bg-[#53627A]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    id: "ready-for-qa",
    label: "READY FOR QA",
    count: 0,
    dotClass: "bg-[#1769E0]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    id: "reopened",
    label: "REOPENED",
    count: 0,
    dotClass: "bg-[#D21F26]",
    countClass: "bg-[#FFE0E0] text-[#D21F26]",
  },
  {
    id: "ready-for-prod",
    label: "READY FOR PROD",
    count: 0,
    dotClass: "bg-[#0C6848]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    id: "done",
    label: "DONE",
    count: 0,
    dotClass: "bg-[#62D9A8]",
    countClass: "bg-[#DFF7EC] text-[#138A5A]",
  },
] as const;

interface EmptyProjectTasksDesktopLayoutProps {
  onAddTask: () => void;
}

export default function EmptyProjectTasksDesktopLayout({
  onAddTask,
}: EmptyProjectTasksDesktopLayoutProps) {
// export default function EmptyProjectTasksDesktopLayout(){
    return(
              <div className="hidden h-full min-h-0 sm:flex-col sm:flex">
        {/* Page Header */}
        <div className="flex shrink-0 items-start justify-between m-8">
          <div>
            {/* Breadcrumb */}
            <div className="mb-5 hidden sm:flex sm:items-center sm:gap-2 text-[10px] font-bold tracking-[0.12em]">
              <span className="text-[#64748B]">PROJECTS</span>

              <ChevronRight
                size={11}
                strokeWidth={2}
                className="text-[#94A3B8]"
              />

              <span className="text-[#64748B]">Rafiq</span>

              <ChevronRight
                size={11}
                strokeWidth={2}
                className="text-[#94A3B8]"
              />

              <span className="text-[#0B2347]">TASKS</span>
            </div>

            <h1 className="text-signup-headline-lg font-bold leading-none tracking-[-0.03em] text-[#09254D]">
              Active Workboard
            </h1>

            <p className="mt-2 text-[14px] text-[#71809A]">
              Curating Project Alpha&apos;s production pipeline and milestones.
            </p>
          </div>

          {/* Search */}
          <div className="relative mt-23.75 w-63.75 shrink-0">
            <Search
              size={17}
              strokeWidth={2}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA0BC]"
            />

            <input
              type="text"
              placeholder="Search tasks..."
              className="h-9 w-full rounded-sm border-0 bg-[#DCE6FF] pl-10 pr-3 text-[13px] text-[#0B2347] outline-none placeholder:text-[#71809A] focus:ring-1 focus:ring-[#B7C8F5]"
            />
          </div>
        </div>

        {/* Kanban Board */}
        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden pb-0 m-8">
          <div className="grid min-w-487.5 grid-cols-8 gap-5">
            {TASK_COLUMNS.map((column : any) => (
              <TaskColumn
                label = {column.label}
                count = {column.count}
                dotClass = {column.dotClass}
                countClass = {column.countClass}
                onAddTask={onAddTask}
                key={column.id} {...column} />
            ))}
          </div>
        </div>
      </div>
    );
}