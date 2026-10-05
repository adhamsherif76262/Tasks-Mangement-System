"use client";

import {
  ChevronRight,
  Menu,
  Plus,
  Search,
} from "lucide-react";

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

function TaskColumn({
  label,
  count,
  dotClass,
  countClass,
}: (typeof TASK_COLUMNS)[number]) {
  return (
    <section className="flex min-w-58 flex-1 flex-col max-w-5xl p-2 h-201.25">
      {/* Column Header */}
      <div className="mb-4 flex h-5 items-center gap-2">
        <span
          className={`h-2 w-2 shrink-0 rounded-full ${dotClass}`}
          aria-hidden="true"
        />

        <span className="whitespace-nowrap text-[10px] font-bold tracking-[0.12em] text-[#64748B]">
          {label}
        </span>

        <span
          className={`flex h-4.5 min-w-4.5 items-center justify-center rounded-xs px-1 text-[10px] font-bold ${countClass}`}
        >
          {count}
        </span>
      </div>

      {/* Add New */}
      <button
        type="button"
        className="mb-4 flex h-10.5 w-full shrink-0 items-center justify-center gap-3 rounded-[5px] border border-dashed border-[#DDE3EF] bg-transparent text-[11px] font-bold tracking-widest text-[#9298A7] transition-colors hover:bg-[#F8F9FC]"
      >
        <Plus
          size={16}
          strokeWidth={1.8}
          className="text-[#9298A7]"
        />

        <span>ADD NEW TASK</span>
      </button>

      {/* Empty State */}
      <div className="flex min-h-160 flex-1 items-center justify-center rounded-md border border-dashed border-[#E0E5EF] bg-[#FBFCFF]">
        <div className="flex flex-col items-center justify-center">
          {/* <CalendarX2
            size={30}
            strokeWidth={1.7}
            className="text-[#9AA9C3]"
          /> */}
          <svg width="27" height="30" viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.05 25.05L7.95 22.95L11.4 19.5L7.95 16.05L10.05 13.95L13.5 17.4L16.95 13.95L19.05 16.05L15.6 19.5L19.05 22.95L16.95 25.05L13.5 21.6L10.05 25.05ZM3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V6C0 5.175 0.29375 4.46875 0.88125 3.88125C1.46875 3.29375 2.175 3 3 3H4.5V0H7.5V3H19.5V0H22.5V3H24C24.825 3 25.5312 3.29375 26.1187 3.88125C26.7062 4.46875 27 5.175 27 6V27C27 27.825 26.7062 28.5312 26.1187 29.1187C25.5312 29.7062 24.825 30 24 30H3ZM3 27H24V12H3V27ZM3 9H24V6H3V9ZM3 9V6V9Z" fill="#94A3B8"/>
          </svg>

          <span className="mt-3 text-[11px] font-bold tracking-widest text-[#9AA9C3]">
            NO TASKS
          </span>
        </div>
      </div>
    </section>
  );
}

export default function ProjectTasksPage() {
  return (
    <>
      {/* Desktop / tablet board.
          Mobile layout will be implemented separately below 640px. */}
      <div className="hidden h-full min-h-0 flex-col sm:flex">
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
        <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden pb-4 m-8">
          <div className="grid min-w-487.5 grid-cols-8 gap-5">
            {TASK_COLUMNS.map((column) => (
              <TaskColumn key={column.id} {...column} />
            ))}
          </div>
        </div>
      </div>

       {/* Mobile view layout (Replaces the placeholder container below 640px) */}

          {/* Mobile Workspace Elements */}
          <main className="flex flex-col gap-4 mt-5.5  mx-4 mb-0 max-h-228.25">

        {/* Page Header */}
            <h1 className="text-signup-headline-lg font-bold leading-none tracking-[-0.03em] text-[#09254D]">
              Active Workboard
            </h1>

          {/* Search */}
          <div className="relative mt-2 w-full shrink-0">
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
        
            {/* Solid Add New Task Action Button */}
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-1 rounded-md bg-[#1769E0] text-xs font-bold tracking-widest text-white shadow-sm transition-colors active:bg-[#1150ab]"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>ADD NEW TASK</span>
            </button>

            {/* Dynamic Empty Board Container Frame */}
            <div className="flex min-h-160.75 flex-col items-center justify-center rounded-xl bg-[#FBFCFF] border border-dashed border-[#E0E5EF] p-2 mb-0 mt-5.5">
              <div className="flex flex-col items-center justify-center opacity-45">
                <svg width="27" height="30" viewBox="0 0 27 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.05 25.05L7.95 22.95L11.4 19.5L7.95 16.05L10.05 13.95L13.5 17.4L16.95 13.95L19.05 16.05L15.6 19.5L19.05 22.95L16.95 25.05L13.5 21.6L10.05 25.05ZM3 30C2.175 30 1.46875 29.7062 0.88125 29.1187C0.29375 28.5312 0 27.825 0 27V6C0 5.175 0.29375 4.46875 0.88125 3.88125C1.46875 3.29375 2.175 3 3 3H4.5V0H7.5V3H19.5V0H22.5V3H24C24.825 3 25.5312 3.29375 26.1187 3.88125C26.7062 4.46875 27 5.175 27 6V27C27 27.825 26.7062 28.5312 26.1187 29.1187C25.5312 29.7062 24.825 30 24 30H3ZM3 27H24V12H3V27ZM3 9H24V6H3V9ZM3 9V6V9Z" fill="#94A3B8"/>
                </svg>
                <span className="mt-3 text-[11px] font-bold tracking-widest text-[#94A3B8]">
                  NO TASKS
                </span>
              </div>
            </div>
          </main>
    </>
  );
}