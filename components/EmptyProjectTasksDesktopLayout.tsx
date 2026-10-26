// "use client";

// import { ChevronRight, Search } from "lucide-react";
// import TaskColumn from "@/components/TaskColumn";

// import useProjectTasks, {
//   TASK_COLUMNS,
//   type TaskStatus,
// } from "@/app/hooks/useProjectTasks";

// import {
//   DndContext,
//   KeyboardSensor,
//   PointerSensor,
//   closestCorners,
//   useSensor,
//   useSensors,
//   type DragEndEvent,
// } from "@dnd-kit/core";

// import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
// import { useState } from "react";

// interface Props {
//   projectName?: string;
//   columns: ReturnType<typeof useProjectTasks>["columns"];
//   onRetry: (status: TaskStatus) => void;
//   onAddTask: () => void;
//   onMoveTask: (options: {
//   taskId: string;
//   targetStatus: TaskStatus;
// }) => Promise<boolean>;
// movingTaskIds: Set<string>;
// }

// export default function EmptyProjectTasksDesktopLayout({
//   projectName = "Rafiq",
//   columns,
//   onRetry,
//   onAddTask,
//   onMoveTask,
// }: Props) {

//   const [moveError, setMoveError] = useState("");

// const sensors = useSensors(
//   useSensor(PointerSensor, {
//     activationConstraint: {
//       distance: 6,
//     },
//   }),
//   useSensor(KeyboardSensor, {
//     coordinateGetter: sortableKeyboardCoordinates,
//   }),
// );

// const handleDragStart = () => {
//   setMoveError("");
// };

// const handleDragEnd = async ({ active, over }: DragEndEvent) => {
//   if (!over) return;

//   const taskId = String(active.id);
//   const targetStatus = String(over.id) as TaskStatus;

//   if (!TASK_COLUMNS.some((column) => column.status === targetStatus)) {
//     return;
//   }

//   const result = await onMoveTask({ taskId, targetStatus });

//   if (!result) {
//     setMoveError(
//       "The task could not be moved. Please try again.",
//     );
//   } else {
//     setMoveError("");
//   }
// };

//   return (
//     <div className="hidden h-full min-h-0 flex-col sm:flex">
//       <div className="m-8 flex shrink-0 items-start justify-between">
//         <div className="min-w-0">
//           <div className="mb-5 hidden items-center gap-2 text-[10px] font-bold tracking-[0.12em] sm:flex">
//             <span className="text-[#64748B]">PROJECTS</span>
//             <ChevronRight size={11} className="text-[#94A3B8]" />
//             <span className="max-w-36 truncate text-[#64748B]">
//               {projectName}
//             </span>
//             <ChevronRight size={11} className="text-[#94A3B8]" />
//             <span className="text-[#0B2347]">TASKS</span>
//           </div>

//           <h1 className="text-signup-headline-lg font-bold leading-none tracking-[-0.03em] text-[#09254D]">
//             Active Workboard
//           </h1>

//           <p className="mt-2 text-[14px] text-[#71809A]">
//             Curating Project Alpha&apos;s production pipeline and milestones.
//           </p>
//         </div>

//         <div className="relative mt-[59px] w-[255px] shrink-0">
//           <Search
//             size={17}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA0BC]"
//           />
//           <input
//             type="text"
//             placeholder="Search tasks..."
//             aria-label="Search tasks"
//             className="h-9 w-full rounded-sm border-0 bg-[#DCE6FF] pl-10 pr-3 text-[13px] text-[#0B2347] outline-none placeholder:text-[#71809A] focus:ring-1 focus:ring-[#B7C8F5]"
//           />
//         </div>
//       </div>


// <DndContext
//   sensors={sensors}
//   collisionDetection={closestCorners}
//   onDragStart={handleDragStart}
//   onDragEnd={handleDragEnd}
// >
//   {/* Keep your existing desktop board markup here. */}

//   {moveError && (
//     <div
//       role="alert"
//       className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
//     >
//       {moveError}
//     </div>
//   )}

//   {/* Keep your existing eight-column grid here. */}
// </DndContext>
//       <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden">
//         <div className="grid min-w-[2370px] grid-cols-8 gap-4 px-8 pb-8">
//           {TASK_COLUMNS.map((column) => {
//             const state = columns[column.status];

//             return (
//               <TaskColumn
//                 key={column.status}
//                 status={column.status}
//                 label={column.label}
//                 dotClass={column.dotClass}
//                 countClass={column.countClass}
//                 tasks={state.tasks}
//                 isLoading={state.isLoading}
//                 error={state.error}
//                 onRetry={onRetry}
//                 onAddTask={onAddTask}
//                 onMoveTask={onMoveTask}
//                 movingTaskIds={movingTaskIds}
//               />
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }


  "use client";

  import { useState } from "react";
  import { ChevronRight, Search } from "lucide-react";
  import TaskColumn from "@/components/TaskColumn";
  import useProjectTasks, {
    TASK_COLUMNS,
    type TaskStatus,
    type ProjectTask,
  } from "@/app/hooks/useProjectTasks";

  import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    closestCorners,
    useSensor,
    useSensors,
    type DragEndEvent,
  } from "@dnd-kit/core";

  import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

  interface Props {
    projectName?: string;
    columns: ReturnType<typeof useProjectTasks>["columns"];
    onRetry: (status: TaskStatus) => void;
    onAddTask: () => void;
    onTaskClick: (task: ProjectTask) => void;
    onMoveTask: (options: {
      taskId: string;
      targetStatus: TaskStatus;
    }) => Promise<boolean>;
    movingTaskIds: Set<string>;
  }

  export default function EmptyProjectTasksDesktopLayout({
    projectName = "Rafiq",
    columns,
    onRetry,
    onAddTask,
    onMoveTask,
    movingTaskIds,
    onTaskClick,
  }: Props) {
    const [moveError, setMoveError] = useState("");

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 6,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      }),
    );

    const handleDragStart = () => {
      setMoveError("");
    };

    const handleDragEnd = async ({ active, over }: DragEndEvent) => {
      if (!over) return;

      const taskId = String(active.id);
      const targetStatus = TASK_COLUMNS.find(
        (column) => column.status === String(over.id),
      )?.status;

      if (!targetStatus) return;

      const result = await onMoveTask({ taskId, targetStatus });

      if (!result) {
        setMoveError("The task could not be moved. Please try again.");
      } else {
        setMoveError("");
      }
    };

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

        {moveError && (
          <div
            role="alert"
            className="mx-8 mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {moveError}
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
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
                    movingTaskIds={movingTaskIds}
                    onTaskClick={onTaskClick}
                  />
                );
              })}
            </div>
          </div>
        </DndContext>
      </div>
    );
  }
