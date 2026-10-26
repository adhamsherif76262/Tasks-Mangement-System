// "use client";

// import { useCallback, useEffect, useState } from "react";

// export const TASK_COLUMNS = [
//   {
//     status: "TO_DO",
//     label: "TO DO",
//     dotClass: "bg-[#94A3B8]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "IN_PROGRESS",
//     label: "IN PROGRESS",
//     dotClass: "bg-[#1769E0]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "BLOCKED",
//     label: "BLOCKED",
//     dotClass: "bg-[#D21F26]",
//     countClass: "bg-[#FFE0E0] text-[#D21F26]",
//   },
//   {
//     status: "IN_REVIEW",
//     label: "IN REVIEW",
//     dotClass: "bg-[#53627A]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "READY_FOR_QA",
//     label: "READY FOR QA",
//     dotClass: "bg-[#1769E0]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "REOPENED",
//     label: "REOPENED",
//     dotClass: "bg-[#D21F26]",
//     countClass: "bg-[#FFE0E0] text-[#D21F26]",
//   },
//   {
//     status: "READY_FOR_PRODUCTION",
//     label: "READY FOR PROD",
//     dotClass: "bg-[#0C6848]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "DONE",
//     label: "DONE",
//     dotClass: "bg-[#62D9A8]",
//     countClass: "bg-[#DFF7EC] text-[#138A5A]",
//   },
// ] as const;

// export type TaskStatus = (typeof TASK_COLUMNS)[number]["status"];

// export interface ProjectTask {
//   id: string;
//   project_id: string;
//   epic_id: string | null;
//   title: string;
//   description: string | null;
//   status: TaskStatus;
//   created_at: string;
//   due_date: string | null;
//   task_id: string;
//   epic: {
//     id: string;
//     title: string;
//     epic_id: string;
//   } | null;
//   created_by: {
//     id: string;
//     name: string | null;
//     email: string;
//     department: string | null;
//   } | null;
//   assignee: {
//     id: string | null;
//     name: string | null;
//     email: string | null;
//     department: string | null;
//   } | null;
// }

// interface ColumnState {
//   tasks: ProjectTask[];
//   isLoading: boolean;
//   error: string;
// }

// type TasksByStatus = Record<TaskStatus, ColumnState>;

// function createInitialState(): TasksByStatus {
//   return Object.fromEntries(
//     TASK_COLUMNS.map(({ status }) => [
//       status,
//       { tasks: [], isLoading: true, error: "" },
//     ])
//   ) as unknown as TasksByStatus;
// }

// export default function useProjectTasks(projectId: string) {
//   const [columns, setColumns] =
//     useState<TasksByStatus>(createInitialState);

//   const fetchColumn = useCallback(
//     async (status: TaskStatus, signal?: AbortSignal) => {
//       if (!projectId) {
//         setColumns((current) => ({
//           ...current,
//           [status]: {
//             tasks: [],
//             isLoading: false,
//             error: "Project ID is missing.",
//           },
//         }));
//         return;
//       }

//       setColumns((current) => ({
//         ...current,
//         [status]: {
//           ...current[status],
//           tasks: [],
//           isLoading: true,
//           error: "",
//         },
//       }));

//       try {
//         const query = new URLSearchParams({ status });

//         const response = await fetch(
//           `/api/projects/${encodeURIComponent(projectId)}/tasks?${query.toString()}`,
//           { method: "GET", signal },
//         );

//         const data = await response.json().catch(() => null);

//         if (!response.ok) {
//           throw new Error(
//             data?.error || "Failed to load tasks for this column.",
//           );
//         }

//         if (signal?.aborted) return;

//         setColumns((current) => ({
//           ...current,
//           [status]: {
//             tasks: Array.isArray(data) ? data : [],
//             isLoading: false,
//             error: "",
//           },
//         }));
//       } catch (error) {
//         if (signal?.aborted) return;

//         console.error(`Failed to load ${status} tasks:`, error);

//         setColumns((current) => ({
//           ...current,
//           [status]: {
//             tasks: [],
//             isLoading: false,
//             error: "Unable to load tasks.",
//           },
//         }));
//       }
//     },
//     [projectId],
//   );

//   useEffect(() => {
//     const controller = new AbortController();

//     setColumns(createInitialState());

//     TASK_COLUMNS.forEach(({ status }) => {
//       void fetchColumn(status, controller.signal);
//     });

//     return () => controller.abort();
//   }, [fetchColumn]);

//   const retryColumn = useCallback(
//     (status: TaskStatus) => fetchColumn(status),
//     [fetchColumn],
//   );

//   const refreshAll = useCallback(() => {
//     TASK_COLUMNS.forEach(({ status }) => {
//       void fetchColumn(status);
//     });
//   }, [fetchColumn]);

//   return { columns, retryColumn, refreshAll };
// }




// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";

// export const TASK_COLUMNS = [
//   {
//     status: "TO_DO",
//     label: "TO DO",
//     dotClass: "bg-[#94A3B8]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "IN_PROGRESS",
//     label: "IN PROGRESS",
//     dotClass: "bg-[#1769E0]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "BLOCKED",
//     label: "BLOCKED",
//     dotClass: "bg-[#D21F26]",
//     countClass: "bg-[#FFE0E0] text-[#D21F26]",
//   },
//   {
//     status: "IN_REVIEW",
//     label: "IN REVIEW",
//     dotClass: "bg-[#53627A]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "READY_FOR_QA",
//     label: "READY FOR QA",
//     dotClass: "bg-[#1769E0]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "REOPENED",
//     label: "REOPENED",
//     dotClass: "bg-[#D21F26]",
//     countClass: "bg-[#FFE0E0] text-[#D21F26]",
//   },
//   {
//     status: "READY_FOR_PRODUCTION",
//     label: "READY FOR PROD",
//     dotClass: "bg-[#0C6848]",
//     countClass: "bg-[#E0E8FF] text-[#1749B8]",
//   },
//   {
//     status: "DONE",
//     label: "DONE",
//     dotClass: "bg-[#62D9A8]",
//     countClass: "bg-[#DFF7EC] text-[#138A5A]",
//   },
// ] as const;

// export type TaskStatus = (typeof TASK_COLUMNS)[number]["status"];

// export interface ProjectTask {
//   id: string;
//   project_id: string;
//   epic_id: string | null;
//   title: string;
//   description: string | null;
//   status: TaskStatus;
//   created_at: string;
//   due_date: string | null;
//   task_id: string;
//   epic: {
//     id: string;
//     title: string;
//     epic_id: string;
//   } | null;
//   created_by: {
//     id: string;
//     name: string | null;
//     email: string;
//     department: string | null;
//   } | null;
//   assignee: {
//     id: string | null;
//     name: string | null;
//     email: string | null;
//     department: string | null;
//   } | null;
// }

// interface ColumnState {
//   tasks: ProjectTask[];
//   isLoading: boolean;
//   error: string;
// }

// type TasksByStatus = Record<TaskStatus, ColumnState>;

// function createInitialState(): TasksByStatus {
//   return Object.fromEntries(
//     TASK_COLUMNS.map(({ status }) => [
//       status,
//       { tasks: [], isLoading: true, error: "" },
//     ]),
//   ) as unknown as TasksByStatus;
// }

// interface MoveOptions {
//   taskId: string;
//   targetStatus: TaskStatus;
// }

// export default function useProjectTasks(projectId: string) {
//   const [columns, setColumns] = useState<TasksByStatus>(createInitialState);

//   // A sequence number prevents an older request from undoing a newer move.
//   const moveSequence = useRef(new Map<string, number>());

//   // Keep the latest committed target per task while its request is pending.
//   const pendingMoves = useRef(
//     new Map<string, { sequence: number; targetStatus: TaskStatus }>(),
//   );

//   const fetchColumn = useCallback(
//     async (status: TaskStatus, signal?: AbortSignal) => {
//       if (!projectId) {
//         setColumns((current) => ({
//           ...current,
//           [status]: {
//             tasks: [],
//             isLoading: false,
//             error: "Project ID is missing.",
//           },
//         }));
//         return;
//       }

//       setColumns((current) => ({
//         ...current,
//         [status]: {
//           ...current[status],
//           tasks: [],
//           isLoading: true,
//           error: "",
//         },
//       }));

//       try {
//         const query = new URLSearchParams({ status });

//         const response = await fetch(
//           `/api/projects/${encodeURIComponent(projectId)}/tasks?${query.toString()}`,
//           { method: "GET", signal, cache: "no-store" },
//         );

//         const data = await response.json().catch(() => null);

//         if (!response.ok) {
//           throw new Error(
//             data?.error || "Failed to load tasks for this column.",
//           );
//         }

//         if (signal?.aborted) return;

//         setColumns((current) => {
//           // Don't replace tasks that are currently being moved optimistically.
//           const incoming = Array.isArray(data) ? (data as ProjectTask[]) : [];
//           const pendingTaskIds = new Set(pendingMoves.current.keys());

//           const incomingFiltered = incoming.filter(
//             (task) => !pendingTaskIds.has(task.id),
//           );

//           const existingPending = current[status].tasks.filter(
//             (task) => pendingTaskIds.has(task.id),
//           );

//           return {
//             ...current,
//             [status]: {
//               tasks: [...incomingFiltered, ...existingPending],
//               isLoading: false,
//               error: "",
//             },
//           };
//         });
//       } catch (error) {
//         if (signal?.aborted) return;

//         console.error(`Failed to load ${status} tasks:`, error);

//         setColumns((current) => ({
//           ...current,
//           [status]: {
//             ...current[status],
//             isLoading: false,
//             error: "Unable to load tasks.",
//           },
//         }));
//       }
//     },
//     [projectId],
//   );

//   useEffect(() => {
//     const controller = new AbortController();

//     setColumns(createInitialState());

//     TASK_COLUMNS.forEach(({ status }) => {
//       void fetchColumn(status, controller.signal);
//     });

//     return () => controller.abort();
//   }, [fetchColumn]);

//   const retryColumn = useCallback(
//     (status: TaskStatus) => fetchColumn(status),
//     [fetchColumn],
//   );

//   const refreshAll = useCallback(() => {
//     TASK_COLUMNS.forEach(({ status }) => {
//       void fetchColumn(status);
//     });
//   }, [fetchColumn]);

//   const moveTask = useCallback(
//     async ({ taskId, targetStatus }: MoveOptions): Promise<boolean> => {
//       let sourceStatus: TaskStatus | null = null;
//       let taskToMove: ProjectTask | null = null;

//       setColumns((current) => {
//         for (const { status } of TASK_COLUMNS) {
//           const found = current[status].tasks.find(
//             (task) => task.id === taskId,
//           );

//           if (found) {
//             sourceStatus = status;
//             taskToMove = found;
//             break;
//           }
//         }

//         return current;
//       });

//       // State setters are queued, so find the task from the current render
//       // snapshot through a ref-backed snapshot maintained below instead.
//       // This guard is resolved by the synchronous task lookup helper.
//       if (!sourceStatus || !taskToMove) return false;
//       if (sourceStatus === targetStatus) return true;

//       const originalStatus = sourceStatus;
//       const originalTask = taskToMove;

//       const sequence = (moveSequence.current.get(taskId) ?? 0) + 1;
//       moveSequence.current.set(taskId, sequence);
//       pendingMoves.current.set(taskId, { sequence, targetStatus });

//       setColumns((current) => {
//         const next = { ...current } as TasksByStatus;

//         for (const { status } of TASK_COLUMNS) {
//           next[status] = {
//             ...current[status],
//             tasks: current[status].tasks.filter((task) => task.id !== taskId),
//           };
//         }

//         next[targetStatus] = {
//           ...next[targetStatus],
//           tasks: [
//             { ...originalTask, status: targetStatus },
//             ...next[targetStatus].tasks,
//           ],
//         };

//         return next;
//       });

//       try {
//         const response = await fetch(
//           `/api/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}`,
//           {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ status: targetStatus }),
//           },
//         );

//         const result = await response.json().catch(() => null);

//         if (!response.ok || !result?.success) {
//           throw new Error(result?.error || "Failed to update task status.");
//         }

//         const latestMove = pendingMoves.current.get(taskId);

//         if (latestMove?.sequence === sequence) {
//           pendingMoves.current.delete(taskId);
//         }

//         return true;
//       } catch (error) {
//         console.error("Failed to move task:", error);

//         const latestMove = pendingMoves.current.get(taskId);

//         // Roll back only if this is still the most recent move for the task.
//         if (latestMove?.sequence === sequence) {
//           pendingMoves.current.delete(taskId);

//           setColumns((current) => {
//             const next = { ...current } as TasksByStatus;

//             for (const { status } of TASK_COLUMNS) {
//               next[status] = {
//                 ...current[status],
//                 tasks: current[status].tasks.filter(
//                   (task) => task.id !== taskId,
//                 ),
//               };
//             }

//             next[originalStatus] = {
//               ...next[originalStatus],
//               tasks: [
//                 { ...originalTask, status: originalStatus },
//                 ...next[originalStatus].tasks,
//               ],
//             };

//             return next;
//           });
//         }

//         return false;
//       }
//     },
//     [projectId],
//   );

//   return { columns, retryColumn, refreshAll, moveTask };
// }





"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const TASK_COLUMNS = [
  {
    status: "TO_DO",
    label: "TO DO",
    dotClass: "bg-[#94A3B8]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    status: "IN_PROGRESS",
    label: "IN PROGRESS",
    dotClass: "bg-[#1769E0]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    status: "BLOCKED",
    label: "BLOCKED",
    dotClass: "bg-[#D21F26]",
    countClass: "bg-[#FFE0E0] text-[#D21F26]",
  },
  {
    status: "IN_REVIEW",
    label: "IN REVIEW",
    dotClass: "bg-[#53627A]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    status: "READY_FOR_QA",
    label: "READY FOR QA",
    dotClass: "bg-[#1769E0]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    status: "REOPENED",
    label: "REOPENED",
    dotClass: "bg-[#D21F26]",
    countClass: "bg-[#FFE0E0] text-[#D21F26]",
  },
  {
    status: "READY_FOR_PRODUCTION",
    label: "READY FOR PROD",
    dotClass: "bg-[#0C6848]",
    countClass: "bg-[#E0E8FF] text-[#1749B8]",
  },
  {
    status: "DONE",
    label: "DONE",
    dotClass: "bg-[#62D9A8]",
    countClass: "bg-[#DFF7EC] text-[#138A5A]",
  },
] as const;

export type TaskStatus = (typeof TASK_COLUMNS)[number]["status"];

export interface ProjectTask {
  id: string;
  project_id: string;
  epic_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  created_at: string;
  due_date: string | null;
  task_id: string;
  epic: {
    id: string;
    title: string;
    epic_id: string;
  } | null;
  created_by: {
    id: string;
    name: string | null;
    email: string;
    department: string | null;
  } | null;
  assignee: {
    id: string | null;
    name: string | null;
    email: string | null;
    department: string | null;
  } | null;
}

interface ColumnState {
  tasks: ProjectTask[];
  isLoading: boolean;
  error: string;
}

type TasksByStatus = Record<TaskStatus, ColumnState>;

interface MoveOptions {
  taskId: string;
  targetStatus: TaskStatus;
}

function createInitialState(): TasksByStatus {
  return Object.fromEntries(
    TASK_COLUMNS.map(({ status }) => [
      status,
      { tasks: [], isLoading: true, error: "" },
    ]),
  ) as unknown as TasksByStatus;
}

export default function useProjectTasks(projectId: string) {
  const [columns, setColumns] =
    useState<TasksByStatus>(createInitialState);

  // Synchronous snapshot of the latest state.
  const columnsRef = useRef(columns);

  // Prevent duplicate moves of the same task while its request is pending.
  const pendingMoves = useRef(
    new Map<string, { sequence: number; targetStatus: TaskStatus }>(),
  );
  const moveSequence = useRef(new Map<string, number>());

  const [movingTaskIds, setMovingTaskIds] = useState<Set<string>>(
    new Set(),
  );

  // Always update the ref and React state together.
  const updateColumns = useCallback(
    (updater: (current: TasksByStatus) => TasksByStatus) => {
      const next = updater(columnsRef.current);
      columnsRef.current = next;
      setColumns(next);
    },
    [],
  );

  const fetchColumn = useCallback(
    async (status: TaskStatus, signal?: AbortSignal) => {
      if (!projectId) {
        updateColumns((current) => ({
          ...current,
          [status]: {
            ...current[status],
            isLoading: false,
            error: "Project ID is missing.",
          },
        }));
        return;
      }

      updateColumns((current) => ({
        ...current,
        [status]: {
          ...current[status],
          isLoading: true,
          error: "",
        },
      }));

      try {
        const query = new URLSearchParams({ status });

        const response = await fetch(
          `/api/projects/${encodeURIComponent(projectId)}/tasks?${query.toString()}`,
          {
            method: "GET",
            signal,
            cache: "no-store",
          },
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load tasks for this column.",
          );
        }

        if (signal?.aborted) return;

        const incoming: ProjectTask[] = Array.isArray(data) ? data : [];

        updateColumns((current) => {
          const pendingIds = new Set(pendingMoves.current.keys());

          // Preserve optimistically moved tasks already in this column.
          const existingPending = current[status].tasks.filter((task) =>
            pendingIds.has(task.id),
          );

          const incomingFiltered = incoming.filter(
            (task) => !pendingIds.has(task.id),
          );

          const existingIds = new Set(
            incomingFiltered.map((task) => task.id),
          );

          return {
            ...current,
            [status]: {
              tasks: [
                ...incomingFiltered,
                ...existingPending.filter(
                  (task) => !existingIds.has(task.id),
                ),
              ],
              isLoading: false,
              error: "",
            },
          };
        });
      } catch (error) {
        if (signal?.aborted) return;

        console.error(`Failed to load ${status} tasks:`, error);

        updateColumns((current) => ({
          ...current,
          [status]: {
            ...current[status],
            isLoading: false,
            error: "Unable to load tasks.",
          },
        }));
      }
    },
    [projectId, updateColumns],
  );

  useEffect(() => {
    const controller = new AbortController();

    // Reset both the rendered state and the synchronous snapshot.
    const initialState = createInitialState();
    columnsRef.current = initialState;
    setColumns(initialState);

    TASK_COLUMNS.forEach(({ status }) => {
      void fetchColumn(status, controller.signal);
    });

    return () => controller.abort();
  }, [fetchColumn]);

  const retryColumn = useCallback(
    (status: TaskStatus) => fetchColumn(status),
    [fetchColumn],
  );

  const refreshAll = useCallback(() => {
    TASK_COLUMNS.forEach(({ status }) => {
      void fetchColumn(status);
    });
  }, [fetchColumn]);

  const moveTask = useCallback(
    async ({ taskId, targetStatus }: MoveOptions): Promise<boolean> => {
      // Do not allow the same task to have multiple requests in flight.
      if (pendingMoves.current.has(taskId)) {
        return false;
      }

      const snapshot = columnsRef.current;

      let sourceStatus: TaskStatus | null = null;
      let taskToMove: ProjectTask | undefined;

      for (const { status } of TASK_COLUMNS) {
        const found = snapshot[status].tasks.find(
          (task) => task.id === taskId,
        );

        if (found) {
          sourceStatus = status;
          taskToMove = found;
          break;
        }
      }

      if (!sourceStatus || !taskToMove) return false;
      if (sourceStatus === targetStatus) return true;

      const originalStatus = sourceStatus;
      const originalTask = taskToMove;
      const sequence = (moveSequence.current.get(taskId) ?? 0) + 1;

      moveSequence.current.set(taskId, sequence);
      pendingMoves.current.set(taskId, {
        sequence,
        targetStatus,
      });

      setMovingTaskIds((current) => new Set(current).add(taskId));

      // Optimistically move the card before waiting for the server.
      updateColumns((current) => {
        const next = { ...current } as TasksByStatus;

        for (const { status } of TASK_COLUMNS) {
          next[status] = {
            ...current[status],
            tasks: current[status].tasks.filter(
              (task) => task.id !== taskId,
            ),
          };
        }

        next[targetStatus] = {
          ...next[targetStatus],
          tasks: [
            { ...originalTask, status: targetStatus },
            ...next[targetStatus].tasks,
          ],
        };

        return next;
      });

      try {
        const response = await fetch(
          `/api/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: targetStatus }),
          },
        );

        const result = await response.json().catch(() => null);

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.error || "Failed to update task status.",
          );
        }

        return true;
      } catch (error) {
        console.error("Failed to move task:", error);

        // Restore the original status while preserving unrelated updates.
        updateColumns((current) => {
          const next = { ...current } as TasksByStatus;

          for (const { status } of TASK_COLUMNS) {
            next[status] = {
              ...current[status],
              tasks: current[status].tasks.filter(
                (task) => task.id !== taskId,
              ),
            };
          }

          next[originalStatus] = {
            ...next[originalStatus],
            tasks: [
              originalTask,
              ...next[originalStatus].tasks,
            ],
          };

          return next;
        });

        return false;
      } finally {
        const latestMove = pendingMoves.current.get(taskId);

        if (latestMove?.sequence === sequence) {
          pendingMoves.current.delete(taskId);
        }

        setMovingTaskIds((current) => {
          const next = new Set(current);
          next.delete(taskId);
          return next;
        });
      }
    },
    [projectId, updateColumns],
  );

  return {
    columns,
    retryColumn,
    refreshAll,
    moveTask,
    movingTaskIds,
  };
}
