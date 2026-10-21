/* eslint-disable react-hooks/refs */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const TASK_COLUMNS = [
  {
    status: "TO_DO",
    label: "TO DO",
    dotClass: "bg-[#94A3B8]",
    countClass: "bg-[#F1F5F9] text-[#64748B]",
  },
  {
    status: "IN_PROGRESS",
    label: "IN PROGRESS",
    dotClass: "bg-[#3B82F6]",
    countClass: "bg-[#DBEAFE] text-[#2563EB]",
  },
  {
    status: "BLOCKED",
    label: "BLOCKED",
    dotClass: "bg-[#EF4444]",
    countClass: "bg-[#FEE2E2] text-[#DC2626]",
  },
  {
    status: "IN_REVIEW",
    label: "IN REVIEW",
    dotClass: "bg-[#A855F7]",
    countClass: "bg-[#F3E8FF] text-[#9333EA]",
  },
  {
    status: "READY_FOR_QA",
    label: "READY FOR QA",
    dotClass: "bg-[#F59E0B]",
    countClass: "bg-[#FEF3C7] text-[#B45309]",
  },
  {
    status: "REOPENED",
    label: "REOPENED",
    dotClass: "bg-[#F97316]",
    countClass: "bg-[#FFEDD5] text-[#C2410C]",
  },
  {
    status: "READY_FOR_PRODUCTION",
    label: "READY FOR PRODUCTION",
    dotClass: "bg-[#14B8A6]",
    countClass: "bg-[#CCFBF1] text-[#0F766E]",
  },
  {
    status: "DONE",
    label: "DONE",
    dotClass: "bg-[#22C55E]",
    countClass: "bg-[#DCFCE7] text-[#15803D]",
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

const PAGE_SIZE = 10;

interface ColumnState {
  tasks: ProjectTask[];
  isLoading: boolean;
  error: string;
  totalCount: number | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreError: string;
}

export type TasksByStatus = Record<TaskStatus, ColumnState>;

export interface MobileTasksState {
  tasks: ProjectTask[];
  isLoading: boolean;
  error: string;
  totalCount: number | null;
  hasMore: boolean;
  isLoadingMore: boolean;
  loadMoreError: string;
}

function createInitialState(): TasksByStatus {
  const createColumn = (): ColumnState => ({
    tasks: [],
    isLoading: true,
    error: "",
    totalCount: null,
    hasMore: true,
    isLoadingMore: false,
    loadMoreError: "",
  });

  return {
    TO_DO: createColumn(),
    IN_PROGRESS: createColumn(),
    BLOCKED: createColumn(),
    IN_REVIEW: createColumn(),
    READY_FOR_QA: createColumn(),
    REOPENED: createColumn(),
    READY_FOR_PRODUCTION: createColumn(),
    DONE: createColumn(),
  };
}

function createInitialMobileState(): MobileTasksState {
  return {
    tasks: [],
    isLoading: true,
    error: "",
    totalCount: null,
    hasMore: true,
    isLoadingMore: false,
    loadMoreError: "",
  };
}

function createInitialOffsets(): Record<TaskStatus, number> {
  return Object.fromEntries(
    TASK_COLUMNS.map(({ status }) => [status, 0]),
  ) as Record<TaskStatus, number>;
}

function parseTotalCount(contentRange: string | null): number | null {
  if (!contentRange) return null;

  const match = contentRange.match(/\/(\d+|\*)$/);

  if (!match || match[1] === "*") return null;

  const total = Number(match[1]);

  return Number.isSafeInteger(total) && total >= 0 ? total : null;
}


function getHasMore(
  receivedCount: number,
  offset: number,
  totalCount: number | null,
): boolean {
  // Never request another page if the backend returned no records.
  if (receivedCount === 0) return false;

  // When available, the backend's exact total count is authoritative.
  if (totalCount !== null) {
    return offset + receivedCount < totalCount;
  }

  // Without count metadata, continue only after a full page.
  return receivedCount >= PAGE_SIZE;
}


function mergeTasks(
  existingTasks: ProjectTask[],
  incomingTasks: ProjectTask[],
): ProjectTask[] {
  const seenIds = new Set(existingTasks.map((task) => task.id));

  return [
    ...existingTasks,
    ...incomingTasks.filter((task) => {
      if (seenIds.has(task.id)) return false;

      seenIds.add(task.id);
      return true;
    }),
  ];
}

async function readTasksResponse(response: Response): Promise<ProjectTask[]> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || data?.message || "Unable to load tasks.",
    );
  }

  if (!Array.isArray(data)) {
    throw new Error("The server returned an invalid tasks response.");
  }

  return data as ProjectTask[];
}

function buildTasksUrl(
  projectId: string,
  options: {
    status?: TaskStatus;
    limit: number;
    offset: number;
    searchTerm: string;
  },
): string {
  const query = new URLSearchParams({
    limit: String(options.limit),
    offset: String(options.offset),
  });

  if (options.status) {
    query.set("status", options.status);
  }

  const title = options.searchTerm.trim();

  if (title) {
    query.set("title", title);
  }

  return `/api/projects/${encodeURIComponent(projectId)}/tasks?${query.toString()}`;
}

// export default function useProjectTasks(projectId: string) {

// export default function useProjectTasks(
//   projectId: string,
//   searchTerm = "",
// ) {
//   const normalizedSearchTerm = searchTerm.trim();

//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
//     normalizedSearchTerm,
//   );

//   const searchTermRef = useRef(normalizedSearchTerm);

//   // Update synchronously so responses for an outdated search are ignored.
//   searchTermRef.current = normalizedSearchTerm;

//   useEffect(() => {
//     const timeoutId = window.setTimeout(() => {
//       setDebouncedSearchTerm(normalizedSearchTerm);
//     }, 400);

//     return () => window.clearTimeout(timeoutId);
//   }, [normalizedSearchTerm]);
  
// const [isMobileViewport, setIsMobileViewport] = useState(false);
// const [isViewportReady, setIsViewportReady] = useState(false);

//   const [columns, setColumns] = useState<TasksByStatus>(createInitialState);
//   const [mobileTasks, setMobileTasks] = useState<MobileTasksState>(
//     createInitialMobileState,
//   );

//   // Offsets track records returned by the backend, not the number of
//   // unique tasks displayed after deduplication.
//   const columnOffsetsRef = useRef<Record<TaskStatus, number>>(
//     createInitialOffsets(),
//   );
//   const mobileOffsetRef = useRef(0);

//   // Prevent two requests for the same page from running simultaneously.
//   const inFlightRef = useRef(new Set<string>());

//   // Ignore responses belonging to an earlier project or request generation.
//   const generationRef = useRef(0);

//   const fetchColumn = useCallback(
//     async (status: TaskStatus, signal?: AbortSignal) => {
//       const generation = generationRef.current;
//       const requestedSearchTerm = debouncedSearchTerm;
//       // const requestKey = `${projectId}:${status}:0`;
//       const requestKey = `${generation}:${projectId}:${status}:0`;

//       if (inFlightRef.current.has(requestKey)) return;

//       if (!projectId) {
//         setColumns((previous) => ({
//           ...previous,
//           [status]: {
//             ...previous[status],
//             tasks: [],
//             isLoading: false,
//             error: "A valid project ID is required.",
//             totalCount: 0,
//             hasMore: false,
//             isLoadingMore: false,
//             loadMoreError: "",
//           },
//         }));
//         return;
//       }

//       inFlightRef.current.add(requestKey);
//       columnOffsetsRef.current[status] = 0;

//       setColumns((previous) => ({
//         ...previous,
//         [status]: {
//           ...previous[status],
//           tasks: [],
//           isLoading: true,
//           error: "",
//           totalCount: null,
//           hasMore: true,
//           isLoadingMore: false,
//           loadMoreError: "",
//         },
//       }));

//       try {
//         // const response = await fetch(
//         //   `/api/projects/${encodeURIComponent(projectId)}/tasks?status=${encodeURIComponent(status)}&limit=${PAGE_SIZE}&offset=0`,
//         //   {
//         //     method: "GET",
//         //     cache: "no-store",
//         //     signal,
//         //   },
//         // );

//         const response = await fetch(
//   buildTasksUrl(projectId, {
//     status,
//     limit: PAGE_SIZE,
//     offset: 0,
//     searchTerm: requestedSearchTerm,
//   }),
//   {
//     method: "GET",
//     cache: "no-store",
//     signal,
//   },
// );

// if (
//   generationRef.current !== generation ||
//   signal?.aborted ||
//   searchTermRef.current !== requestedSearchTerm
// ) {
//   return;
// }

//         const data = await readTasksResponse(response);
//         const totalCount = parseTotalCount(
//           response.headers.get("content-range"),
//         );

//         // if (
//         //   generationRef.current !== generation ||
//         //   signal?.aborted
//         // ) {
//         //   return;
//         // }

//         columnOffsetsRef.current[status] = data.length;

//         setColumns((previous) => ({
//           ...previous,
//           [status]: {
//             ...previous[status],
//             tasks: mergeTasks([], data),
//             isLoading: false,
//             error: "",
//             totalCount,
//             hasMore: getHasMore(data.length, 0, totalCount),
//             isLoadingMore: false,
//             loadMoreError: "",
//           },
//         }));
//       } catch (error) {
//         // if (
//         //   signal?.aborted ||
//         //   generationRef.current !== generation
//         // ) {
//         //   return;
//         // }

//         if (
//   generationRef.current !== generation ||
//   signal?.aborted ||
//   searchTermRef.current !== requestedSearchTerm
// ) {
//   return;
// }
//         console.error(`Failed to load ${status} tasks:`, error);

//         setColumns((previous) => ({
//           ...previous,
//           [status]: {
//             ...previous[status],
//             isLoading: false,
//             error: "Unable to load tasks.",
//             hasMore: false,
//           },
//         }));
//       } finally {
//         inFlightRef.current.delete(requestKey);
//       }
//     },
//     [projectId,debouncedSearchTerm],
//   );

//   const loadMoreColumn = useCallback(
//     async (status: TaskStatus) => {
//       const generation = generationRef.current;
//       const currentColumn = columns[status];

//       if (
//         !projectId ||
//         !currentColumn ||
//         currentColumn.isLoading ||
//         currentColumn.isLoadingMore ||
//         currentColumn.error ||
//         !currentColumn.hasMore
//       ) {
//         return;
//       }

//       const offset = columnOffsetsRef.current[status];
//       // const requestKey = `${projectId}:${status}:${offset}`;
//       const requestKey = `${generation}:${projectId}:${status}:${offset}`;

//       if (inFlightRef.current.has(requestKey)) return;

//       inFlightRef.current.add(requestKey);

//       setColumns((previous) => ({
//         ...previous,
//         [status]: {
//           ...previous[status],
//           isLoadingMore: true,
//           loadMoreError: "",
//         },
//       }));

//       try {
//         const response = await fetch(
//           `/api/projects/${encodeURIComponent(projectId)}/tasks?status=${encodeURIComponent(status)}&limit=${PAGE_SIZE}&offset=${offset}`,
//           {
//             method: "GET",
//             cache: "no-store",
//           },
//         );

//         const data = await readTasksResponse(response);
//         const responseCount = parseTotalCount(
//           response.headers.get("content-range"),
//         );

//         if (generationRef.current !== generation) return;

//         const nextOffset = offset + data.length;
//         columnOffsetsRef.current[status] = nextOffset;

//         setColumns((previous) => {
//           const current = previous[status];
//           const totalCount = responseCount ?? current.totalCount;

//           return {
//             ...previous,
//             [status]: {
//               ...current,
//               tasks: mergeTasks(current.tasks, data),
//               isLoadingMore: false,
//               loadMoreError: "",
//               totalCount,
//               hasMore: getHasMore(data.length, offset, totalCount),
//             },
//           };
//         });
//       } catch (error) {
//         if (generationRef.current !== generation) return;

//         console.error(`Failed to load more ${status} tasks:`, error);

//         // Keep already-loaded tasks so the user can retry this page.
//         setColumns((previous) => ({
//           ...previous,
//           [status]: {
//             ...previous[status],
//             isLoadingMore: false,
//             loadMoreError: "Unable to load more tasks.",
//           },
//         }));
//       } finally {
//         inFlightRef.current.delete(requestKey);
//       }
//     },
//     [columns, projectId],
//   );

//   const fetchMobileTasks = useCallback(
//     async (signal?: AbortSignal) => {
//       const generation = generationRef.current;
//       // const requestKey = `${projectId}:mobile:0`;
//       const requestKey = `${generation}:${projectId}:mobile:0`;

//       if (inFlightRef.current.has(requestKey)) return;

//       if (!projectId) {
//         setMobileTasks({
//           ...createInitialMobileState(),
//           isLoading: false,
//           error: "A valid project ID is required.",
//           totalCount: 0,
//           hasMore: false,
//         });
//         return;
//       }

//       inFlightRef.current.add(requestKey);
//       mobileOffsetRef.current = 0;

//       setMobileTasks(createInitialMobileState());

//       try {
//         const response = await fetch(
//           `/api/projects/${encodeURIComponent(projectId)}/tasks?limit=${PAGE_SIZE}&offset=0`,
//           {
//             method: "GET",
//             cache: "no-store",
//             signal,
//           },
//         );

//         const data = await readTasksResponse(response);
//         const totalCount = parseTotalCount(
//           response.headers.get("content-range"),
//         );

//         if (
//           generationRef.current !== generation ||
//           signal?.aborted
//         ) {
//           return;
//         }

//         mobileOffsetRef.current = data.length;

//         setMobileTasks({
//           tasks: mergeTasks([], data),
//           isLoading: false,
//           error: "",
//           totalCount,
//           hasMore: getHasMore(data.length, 0, totalCount),
//           isLoadingMore: false,
//           loadMoreError: "",
//         });
//       } catch (error) {
//         if (
//           signal?.aborted ||
//           generationRef.current !== generation
//         ) {
//           return;
//         }

//         console.error("Failed to load mobile tasks:", error);

//         setMobileTasks({
//           ...createInitialMobileState(),
//           isLoading: false,
//           error: "Unable to load tasks.",
//           hasMore: false,
//         });
//       } finally {
//         inFlightRef.current.delete(requestKey);
//       }
//     },
//     [projectId],
//   );

//   const loadMoreMobileTasks = useCallback(async () => {
//     const generation = generationRef.current;

//     if (
//       !projectId ||
//       mobileTasks.isLoading ||
//       mobileTasks.isLoadingMore ||
//       mobileTasks.error ||
//       !mobileTasks.hasMore
//     ) {
//       return;
//     }

//     const offset = mobileOffsetRef.current;
//     // const requestKey = `${projectId}:mobile:${offset}`;
//     const requestKey = `${generation}:${projectId}:mobile:${offset}`;

//     if (inFlightRef.current.has(requestKey)) return;

//     inFlightRef.current.add(requestKey);

//     setMobileTasks((previous) => ({
//       ...previous,
//       isLoadingMore: true,
//       loadMoreError: "",
//     }));

//     try {
//       const response = await fetch(
//         `/api/projects/${encodeURIComponent(projectId)}/tasks?limit=${PAGE_SIZE}&offset=${offset}`,
//         {
//           method: "GET",
//           cache: "no-store",
//         },
//       );

//       const data = await readTasksResponse(response);
//       const responseCount = parseTotalCount(
//         response.headers.get("content-range"),
//       );

//       if (generationRef.current !== generation) return;

//       const nextOffset = offset + data.length;
//       mobileOffsetRef.current = nextOffset;

//       setMobileTasks((previous) => {
//         const totalCount = responseCount ?? previous.totalCount;

//         return {
//           ...previous,
//           tasks: mergeTasks(previous.tasks, data),
//           isLoadingMore: false,
//           loadMoreError: "",
//           totalCount,
//           hasMore: getHasMore(data.length, offset, totalCount),
//         };
//       });
//     } catch (error) {
//       if (generationRef.current !== generation) return;

//       console.error("Failed to load more mobile tasks:", error);

//       setMobileTasks((previous) => ({
//         ...previous,
//         isLoadingMore: false,
//         loadMoreError: "Unable to load more tasks.",
//       }));
//     } finally {
//       inFlightRef.current.delete(requestKey);
//     }
//   }, [mobileTasks, projectId]);

//   const retryColumn = useCallback(
//     (status: TaskStatus) => {
//       void fetchColumn(status);
//     },
//     [fetchColumn],
//   );

//   const retryMobileTasks = useCallback(() => {
//     void fetchMobileTasks();
//   }, [fetchMobileTasks]);

//   const refreshAll = useCallback(() => {
//     void Promise.all(
//       TASK_COLUMNS.map(({ status }) => fetchColumn(status)),
//     );
//     void fetchMobileTasks();
//   }, [fetchColumn, fetchMobileTasks]);

//   // useEffect(() => {
//   //   const controller = new AbortController();

//   //   generationRef.current += 1;
//   //   columnOffsetsRef.current = createInitialOffsets();
//   //   mobileOffsetRef.current = 0;

//   //   // Reset pagination when the project changes.
//   //   // eslint-disable-next-line react-hooks/set-state-in-effect
//   //   setColumns(createInitialState());
//   //   setMobileTasks(createInitialMobileState());

//   //   TASK_COLUMNS.forEach(({ status }) => {
//   //     void fetchColumn(status, controller.signal);
//   //   });

//   //   void fetchMobileTasks(controller.signal);

//   //   return () => {
//   //       controller.abort();

//   // // Remove request locks belonging to this effect.
//   // // A subsequent effect setup must be able to start fresh requests.
//   // inFlightRef.current.clear();
//   //   };
//   // }, [projectId, fetchColumn, fetchMobileTasks]);


  
//   // Detect the same 640px breakpoint used by Tailwind's default `sm`.
//   useEffect(() => {
//     const mediaQuery = window.matchMedia("(max-width: 639px)");

//     const updateViewport = () => {
//       setIsMobileViewport(mediaQuery.matches);
//       setIsViewportReady(true);
//     };

//     updateViewport();
//     mediaQuery.addEventListener("change", updateViewport);

//     return () => {
//       mediaQuery.removeEventListener("change", updateViewport);
//     };
//   }, []);

//   // Fetch only the dataset required by the active layout.
//   useEffect(() => {
//     if (!isViewportReady) return;

//     const controller = new AbortController();

//     generationRef.current += 1;
//     inFlightRef.current.clear();
//     columnOffsetsRef.current = createInitialOffsets();
//     mobileOffsetRef.current = 0;

//     // Reset pagination when the project or active layout changes.
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setColumns(createInitialState());
//     // eslint-disable-next-line react-hooks/set-state-in-effect
//     setMobileTasks(createInitialMobileState());

//     if (isMobileViewport) {
//       // Mobile: one paginated feed across all task statuses.
//       void fetchMobileTasks(controller.signal);
//     } else {
//       // Desktop: independent pagination for every status column.
//       TASK_COLUMNS.forEach(({ status }) => {
//         void fetchColumn(status, controller.signal);
//       });
//     }

//     return () => {
//       controller.abort();
//       inFlightRef.current.clear();
//     };
//   }, [
//     projectId,
//     isMobileViewport,
//     isViewportReady,
//     fetchColumn,
//     fetchMobileTasks,
//   ]);

//   return {
//     columns,
//     retryColumn,
//     loadMoreColumn,
//     mobileTasks,
//     loadMoreMobileTasks,
//     retryMobileTasks,
//     refreshAll,
//   };
// }



export default function useProjectTasks(
  projectId: string,
  searchTerm = "",
) {
  const normalizedSearchTerm = searchTerm.trim();

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    normalizedSearchTerm,
  );

  const searchTermRef = useRef(normalizedSearchTerm);
  searchTermRef.current = normalizedSearchTerm;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchTerm(normalizedSearchTerm);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [normalizedSearchTerm]);

  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const [isViewportReady, setIsViewportReady] = useState(false);

  const [columns, setColumns] = useState<TasksByStatus>(createInitialState);
  const [mobileTasks, setMobileTasks] = useState<MobileTasksState>(
    createInitialMobileState,
  );

  const columnOffsetsRef = useRef<Record<TaskStatus, number>>(
    createInitialOffsets(),
  );
  const mobileOffsetRef = useRef(0);

  const inFlightRef = useRef(new Set<string>());
  const generationRef = useRef(0);

  const fetchColumn = useCallback(
    async (status: TaskStatus, signal?: AbortSignal) => {
      const generation = generationRef.current;
      const requestedSearchTerm = debouncedSearchTerm;
      const requestKey = `${generation}:${projectId}:${status}:0:${requestedSearchTerm}`;

      if (inFlightRef.current.has(requestKey)) return;

      if (!projectId) {
        setColumns((previous) => ({
          ...previous,
          [status]: {
            ...previous[status],
            tasks: [],
            isLoading: false,
            error: "A valid project ID is required.",
            totalCount: 0,
            hasMore: false,
            isLoadingMore: false,
            loadMoreError: "",
          },
        }));
        return;
      }

      inFlightRef.current.add(requestKey);
      columnOffsetsRef.current[status] = 0;

      setColumns((previous) => ({
        ...previous,
        [status]: {
          ...previous[status],
          tasks: [],
          isLoading: true,
          error: "",
          totalCount: null,
          hasMore: true,
          isLoadingMore: false,
          loadMoreError: "",
        },
      }));

      try {
        const response = await fetch(
          buildTasksUrl(projectId, {
            status,
            limit: PAGE_SIZE,
            offset: 0,
            searchTerm: requestedSearchTerm,
          }),
          {
            method: "GET",
            cache: "no-store",
            signal,
          },
        );

        const data = await readTasksResponse(response);
        const totalCount = parseTotalCount(
          response.headers.get("content-range"),
        );

        if (
          generationRef.current !== generation ||
          signal?.aborted ||
          searchTermRef.current !== requestedSearchTerm
        ) {
          return;
        }

        columnOffsetsRef.current[status] = data.length;

        setColumns((previous) => ({
          ...previous,
          [status]: {
            ...previous[status],
            tasks: mergeTasks([], data),
            isLoading: false,
            error: "",
            totalCount,
            hasMore: getHasMore(data.length, 0, totalCount),
            isLoadingMore: false,
            loadMoreError: "",
          },
        }));
      } catch (error) {
        if (
          signal?.aborted ||
          generationRef.current !== generation ||
          searchTermRef.current !== requestedSearchTerm
        ) {
          return;
        }

        console.error(`Failed to load ${status} tasks:`, error);

        setColumns((previous) => ({
          ...previous,
          [status]: {
            ...previous[status],
            isLoading: false,
            error: "Unable to load tasks.",
            hasMore: false,
          },
        }));
      } finally {
        inFlightRef.current.delete(requestKey);
      }
    },
    [projectId, debouncedSearchTerm],
  );

  const loadMoreColumn = useCallback(
    async (status: TaskStatus) => {
      const generation = generationRef.current;
      const requestedSearchTerm = debouncedSearchTerm;
      const currentColumn = columns[status];

      if (
        !projectId ||
        !currentColumn ||
        currentColumn.isLoading ||
        currentColumn.isLoadingMore ||
        currentColumn.error ||
        !currentColumn.hasMore
      ) {
        return;
      }

      const offset = columnOffsetsRef.current[status];
      const requestKey = `${generation}:${projectId}:${status}:${offset}:${requestedSearchTerm}`;

      if (inFlightRef.current.has(requestKey)) return;

      inFlightRef.current.add(requestKey);

      setColumns((previous) => ({
        ...previous,
        [status]: {
          ...previous[status],
          isLoadingMore: true,
          loadMoreError: "",
        },
      }));

      try {
        const response = await fetch(
          buildTasksUrl(projectId, {
            status,
            limit: PAGE_SIZE,
            offset,
            searchTerm: requestedSearchTerm,
          }),
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const data = await readTasksResponse(response);
        const responseCount = parseTotalCount(
          response.headers.get("content-range"),
        );

        if (
          generationRef.current !== generation ||
          searchTermRef.current !== requestedSearchTerm
        ) {
          return;
        }

        const nextOffset = offset + data.length;
        columnOffsetsRef.current[status] = nextOffset;

        setColumns((previous) => {
          const current = previous[status];
          const totalCount = responseCount ?? current.totalCount;

          return {
            ...previous,
            [status]: {
              ...current,
              tasks: mergeTasks(current.tasks, data),
              isLoadingMore: false,
              loadMoreError: "",
              totalCount,
              hasMore: getHasMore(data.length, offset, totalCount),
            },
          };
        });
      } catch (error) {
        if (
          generationRef.current !== generation ||
          searchTermRef.current !== requestedSearchTerm
        ) {
          return;
        }

        console.error(`Failed to load more ${status} tasks:`, error);

        setColumns((previous) => ({
          ...previous,
          [status]: {
            ...previous[status],
            isLoadingMore: false,
            loadMoreError: "Unable to load more tasks.",
          },
        }));
      } finally {
        inFlightRef.current.delete(requestKey);
      }
    },
    [columns, projectId, debouncedSearchTerm],
  );

  const fetchMobileTasks = useCallback(
    async (signal?: AbortSignal) => {
      const generation = generationRef.current;
      const requestedSearchTerm = debouncedSearchTerm;
      const requestKey = `${generation}:${projectId}:mobile:0:${requestedSearchTerm}`;

      if (inFlightRef.current.has(requestKey)) return;

      if (!projectId) {
        setMobileTasks({
          ...createInitialMobileState(),
          isLoading: false,
          error: "A valid project ID is required.",
          totalCount: 0,
          hasMore: false,
        });
        return;
      }

      inFlightRef.current.add(requestKey);
      mobileOffsetRef.current = 0;

      setMobileTasks(createInitialMobileState());

      try {
        const response = await fetch(
          buildTasksUrl(projectId, {
            limit: PAGE_SIZE,
            offset: 0,
            searchTerm: requestedSearchTerm,
          }),
          {
            method: "GET",
            cache: "no-store",
            signal,
          },
        );

        const data = await readTasksResponse(response);
        const totalCount = parseTotalCount(
          response.headers.get("content-range"),
        );

        if (
          generationRef.current !== generation ||
          signal?.aborted ||
          searchTermRef.current !== requestedSearchTerm
        ) {
          return;
        }

        mobileOffsetRef.current = data.length;

        setMobileTasks({
          tasks: mergeTasks([], data),
          isLoading: false,
          error: "",
          totalCount,
          hasMore: getHasMore(data.length, 0, totalCount),
          isLoadingMore: false,
          loadMoreError: "",
        });
      } catch (error) {
        if (
          signal?.aborted ||
          generationRef.current !== generation ||
          searchTermRef.current !== requestedSearchTerm
        ) {
          return;
        }

        console.error("Failed to load mobile tasks:", error);

        setMobileTasks({
          ...createInitialMobileState(),
          isLoading: false,
          error: "Unable to load tasks.",
          hasMore: false,
        });
      } finally {
        inFlightRef.current.delete(requestKey);
      }
    },
    [projectId, debouncedSearchTerm],
  );

  const loadMoreMobileTasks = useCallback(async () => {
    const generation = generationRef.current;
    const requestedSearchTerm = debouncedSearchTerm;

    if (
      !projectId ||
      mobileTasks.isLoading ||
      mobileTasks.isLoadingMore ||
      mobileTasks.error ||
      !mobileTasks.hasMore
    ) {
      return;
    }

    const offset = mobileOffsetRef.current;
    const requestKey = `${generation}:${projectId}:mobile:${offset}:${requestedSearchTerm}`;

    if (inFlightRef.current.has(requestKey)) return;

    inFlightRef.current.add(requestKey);

    setMobileTasks((previous) => ({
      ...previous,
      isLoadingMore: true,
      loadMoreError: "",
    }));

    try {
      const response = await fetch(
        buildTasksUrl(projectId, {
          limit: PAGE_SIZE,
          offset,
          searchTerm: requestedSearchTerm,
        }),
        {
          method: "GET",
          cache: "no-store",
        },
      );

      const data = await readTasksResponse(response);
      const responseCount = parseTotalCount(
        response.headers.get("content-range"),
      );

      if (
        generationRef.current !== generation ||
        searchTermRef.current !== requestedSearchTerm
      ) {
        return;
      }

      const nextOffset = offset + data.length;
      mobileOffsetRef.current = nextOffset;

      setMobileTasks((previous) => {
        const totalCount = responseCount ?? previous.totalCount;

        return {
          ...previous,
          tasks: mergeTasks(previous.tasks, data),
          isLoadingMore: false,
          loadMoreError: "",
          totalCount,
          hasMore: getHasMore(data.length, offset, totalCount),
        };
      });
    } catch (error) {
      if (
        generationRef.current !== generation ||
        searchTermRef.current !== requestedSearchTerm
      ) {
        return;
      }

      console.error("Failed to load more mobile tasks:", error);

      setMobileTasks((previous) => ({
        ...previous,
        isLoadingMore: false,
        loadMoreError: "Unable to load more tasks.",
      }));
    } finally {
      inFlightRef.current.delete(requestKey);
    }
  }, [mobileTasks, projectId, debouncedSearchTerm]);

  const retryColumn = useCallback(
    (status: TaskStatus) => {
      void fetchColumn(status);
    },
    [fetchColumn],
  );

  const retryMobileTasks = useCallback(() => {
    void fetchMobileTasks();
  }, [fetchMobileTasks]);

  const refreshAll = useCallback(() => {
    if (isMobileViewport) {
      void fetchMobileTasks();
      return;
    }

    void Promise.all(
      TASK_COLUMNS.map(({ status }) => fetchColumn(status)),
    );
  }, [isMobileViewport, fetchColumn, fetchMobileTasks]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");

    const updateViewport = () => {
      setIsMobileViewport(mediaQuery.matches);
      setIsViewportReady(true);
    };

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (!isViewportReady) return;

    const controller = new AbortController();

    generationRef.current += 1;
    inFlightRef.current.clear();
    columnOffsetsRef.current = createInitialOffsets();
    mobileOffsetRef.current = 0;

    // Reset pagination when the project, search term, or layout changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColumns(createInitialState());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileTasks(createInitialMobileState());

    if (isMobileViewport) {
      void fetchMobileTasks(controller.signal);
    } else {
      TASK_COLUMNS.forEach(({ status }) => {
        void fetchColumn(status, controller.signal);
      });
    }

    return () => {
      controller.abort();
      inFlightRef.current.clear();
    };
  }, [
    projectId,
    isMobileViewport,
    isViewportReady,
    fetchColumn,
    fetchMobileTasks,
  ]);

  return {
    columns,
    retryColumn,
    loadMoreColumn,
    mobileTasks,
    loadMoreMobileTasks,
    retryMobileTasks,
    refreshAll,
    debouncedSearchTerm,
  };
}

