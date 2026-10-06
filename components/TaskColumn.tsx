"use client"

import {
  Plus
} from "lucide-react";

interface TaskColumnProps {
  label: string;
  count: number;
  dotClass: string;
  countClass: string;
}

export default function TaskColumn({
  label,
  count,
  dotClass,
  countClass,
}: TaskColumnProps) {
  return (
    <section className="flex min-w-58 flex-1 flex-col max-w-5xl p-2 h-[742px]">
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
      <div className="flex max-h-[639px] flex-1 items-center justify-center rounded-md border border-dashed border-[#E0E5EF] bg-[#FBFCFF]">
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