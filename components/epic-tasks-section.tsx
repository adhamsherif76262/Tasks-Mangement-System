import React from "react";

export function EpicTasksSection() {
  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Tasks</h3>
        <button 
          type="button"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
        >
          <span>+ Add Task</span>
        </button>
      </div>

      {/* Dotted Canvas Area for Empty State matching Figma */}
      <div className="w-full border-2 border-dashed border-slate-100 bg-slate-50/50 rounded-xl py-10 px-4 flex flex-col items-center justify-center text-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-sm">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500 max-w-xs">
          No tasks have been added to this epic yet
        </p>
        <button
          type="button"
          className="h-10 px-4 bg-[#0046C4] hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm"
        >
          <span>+ Add Task</span>
        </button>
      </div>
    </div>
  );
}
