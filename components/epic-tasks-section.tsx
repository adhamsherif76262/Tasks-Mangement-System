// import React, { useState } from "react";
// import { useRouter , useParams } from "next/navigation";

// import AddTaskModal from "@/components/AddTaskModal";


// export function EpicTasksSection() {
//   const router = useRouter();
//   const {id} = useParams()
//   const [isAddTaskOpen, setIsAddTaskOpen] = useState(true);
//   return (
//     <div className="mt-6 flex flex-col gap-3">
//       <div className="flex items-center justify-between">
//         <h3 className="text-base font-bold text-slate-800">Tasks</h3>
//         <button 
//           type="button"
//           onClick={()=>router.push(`/projects/${id}/tasks/new`)}
//           className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition flex items-center gap-1"
//         >
//           + Add Task
//         </button>
//       </div>

//       {/* Dotted Canvas Area for Empty State matching Figma */}
//       <div className="w-full border-2 border-dashed border-slate-100 bg-surface-low rounded-xl py-10 px-4 flex flex-col items-center justify-center text-center gap-4">
//         <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-sm">
//           <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
//           <rect width="48" height="48" rx="12" fill="#D7E2FF"/>
//           <path d="M21 31V29H33V31H21ZM21 25V23H33V25H21ZM21 19V17H33V19H21ZM17 32C16.45 32 15.9792 31.8042 15.5875 31.4125C15.1958 31.0208 15 30.55 15 30C15 29.45 15.1958 28.9792 15.5875 28.5875C15.9792 28.1958 16.45 28 17 28C17.55 28 18.0208 28.1958 18.4125 28.5875C18.8042 28.9792 19 29.45 19 30C19 30.55 18.8042 31.0208 18.4125 31.4125C18.0208 31.8042 17.55 32 17 32ZM17 26C16.45 26 15.9792 25.8042 15.5875 25.4125C15.1958 25.0208 15 24.55 15 24C15 23.45 15.1958 22.9792 15.5875 22.5875C15.9792 22.1958 16.45 22 17 22C17.55 22 18.0208 22.1958 18.4125 22.5875C18.8042 22.9792 19 23.45 19 24C19 24.55 18.8042 25.0208 18.4125 25.4125C18.0208 25.8042 17.55 26 17 26ZM17 20C16.45 20 15.9792 19.8042 15.5875 19.4125C15.1958 19.0208 15 18.55 15 18C15 17.45 15.1958 16.9792 15.5875 16.5875C15.9792 16.1958 16.45 16 17 16C17.55 16 18.0208 16.1958 18.4125 16.5875C18.8042 16.9792 19 17.45 19 18C19 18.55 18.8042 19.0208 18.4125 19.4125C18.0208 19.8042 17.55 20 17 20Z" fill="#041B3C" fillOpacity="0.3"/>
//           </svg>
//         </div>
//         <p className="text-sm font-medium text-slate-500 max-w-xs">
//           No tasks have been added to this epic yet
//         </p>
//         <button
//           type="button"
//           onClick={()=>router.push(`/projects/${id}/tasks/new`)}
//           className="h-10 px-4 bg-[#0046C4] hover:bg-blue-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-sm"
//         >
//           + Add Task
//         </button>
//       </div>

//       <AddTaskModal
//         projectId={id as string}
//         isOpen={isAddTaskOpen}
//         onClose={() => setIsAddTaskOpen(false)}
//       />
//     </div>
//   );
// }



"use client";

import React, { useState } from "react";

import AddTaskModal from "@/components/AddTaskModal";

interface EpicTasksSectionProps {
  projectId: string;
  epicId: string;
}

export function EpicTasksSection({
  projectId,
  epicId,
}: EpicTasksSectionProps) {
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  return (
    <div className="mt-6 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">
          Tasks
        </h3>

        <button
          type="button"
          onClick={() => setIsAddTaskOpen(true)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
        >
          + Add Task
        </button>
      </div>

      {/* Dotted Canvas Area for Empty State matching Figma */}
      <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-100 bg-surface-low px-4 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500 shadow-sm">
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="48"
              height="48"
              rx="12"
              fill="#D7E2FF"
            />

            <path
              d="M21 31V29H33V31H21ZM21 25V23H33V25H21ZM21 19V17H33V19H21ZM17 32C16.45 32 15.9792 31.8042 15.5875 31.4125C15.1958 31.0208 15 30.55 15 30C15 29.45 15.1958 28.9792 15.5875 28.5875C15.9792 28.1958 16.45 28 17 28C17.55 28 18.0208 28.1958 18.4125 28.5875C18.8042 28.9792 19 29.45 19 30C19 30.55 18.8042 31.0208 18.4125 31.4125C18.0208 31.8042 17.55 32 17 32ZM17 26C16.45 26 15.9792 25.8042 15.5875 25.4125 15 24.55 15 24C15 23.45 15.1958 22.9792 15.5875 22.5875C15.9792 22.1958 16.45 22 17 22C17.55 22 18.0208 22.1958 18.4125 22.5875C18.8042 22.9792 19 23.45 19 24C19 24.55 18.8042 25.0208 18.4125 25.4125C18.0208 25.8042 17.55 26 17 26ZM17 20C16.45 20 15.9792 19.8042 15.5875 19.4125C15.1958 19.0208 15 18.55 15 18C15 17.45 15.1958 16.9792 15.5875 16.5875C15.9792 16.1958 16.45 16 17 16C17.55 16 18.0208 16.1958 18.4125 16.9792 18.8042 17.45 19 18C19 18.55 18.8042 18.9792 18.4125 19.4125C18.0208 19.8042 17.55 20 17 20Z"
              fill="#041B3C"
              fillOpacity="0.3"
            />
          </svg>
        </div>

        <p className="max-w-xs text-sm font-medium text-slate-500">
          No tasks have been added to this epic yet
        </p>

        <button
          type="button"
          onClick={() => setIsAddTaskOpen(true)}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-[#0046C4] px-4 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700"
        >
          + Add Task
        </button>
      </div>

      <AddTaskModal
        projectId={projectId}
        initialEpicId={epicId}
        isOpen={isAddTaskOpen}
        onClose={() => setIsAddTaskOpen(false)}
      />
    </div>
  );
}