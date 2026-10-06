"use client"

import {
  Plus,
  Search,
} from "lucide-react";

interface EmptyProjectTasksMobileLayoutProps {
  onAddTask: () => void;
}

export default function EmptyProjectTasksMobileLayout({
  onAddTask,
}: EmptyProjectTasksMobileLayoutProps) {
// export default function EmptyProjectTasksMobileLayout(){
      return (
          <div className="flex flex-col gap-4 mt-5.5 sm:hidden  mx-4 mb-0 max-h-228.25">
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
              onClick={onAddTask}
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
          </div>
  );
}