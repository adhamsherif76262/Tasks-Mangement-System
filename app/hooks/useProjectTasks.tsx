
"use client";

import { useCallback, useEffect, useState } from "react";

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

function createInitialState(): TasksByStatus {
  return Object.fromEntries(
    TASK_COLUMNS.map(({ status }) => [
      status,
      { tasks: [], isLoading: true, error: "" },
    ])
  ) as unknown as TasksByStatus;
}

export default function useProjectTasks(projectId: string) {
  const [columns, setColumns] =
    useState<TasksByStatus>(createInitialState);

  const fetchColumn = useCallback(
    async (status: TaskStatus, signal?: AbortSignal) => {
      if (!projectId) {
        setColumns((current) => ({
          ...current,
          [status]: {
            tasks: [],
            isLoading: false,
            error: "Project ID is missing.",
          },
        }));
        return;
      }

      setColumns((current) => ({
        ...current,
        [status]: {
          ...current[status],
          tasks: [],
          isLoading: true,
          error: "",
        },
      }));

      try {
        const query = new URLSearchParams({ status });

        const response = await fetch(
          `/api/projects/${encodeURIComponent(projectId)}/tasks?${query.toString()}`,
          { method: "GET", signal },
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load tasks for this column.",
          );
        }

        if (signal?.aborted) return;

        setColumns((current) => ({
          ...current,
          [status]: {
            tasks: Array.isArray(data) ? data : [],
            isLoading: false,
            error: "",
          },
        }));
      } catch (error) {
        if (signal?.aborted) return;

        console.error(`Failed to load ${status} tasks:`, error);

        setColumns((current) => ({
          ...current,
          [status]: {
            tasks: [],
            isLoading: false,
            error: "Unable to load tasks.",
          },
        }));
      }
    },
    [projectId],
  );

  useEffect(() => {
    const controller = new AbortController();

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColumns(createInitialState());

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

  return { columns, retryColumn, refreshAll };
}