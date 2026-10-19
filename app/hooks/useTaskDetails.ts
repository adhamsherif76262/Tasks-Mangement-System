
"use client";

import { useCallback, useEffect, useState } from "react";

export interface TaskDetailsUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  department?: string | null;
  avatar_url?: string | null;
  avatar?: string | null;
}

export interface TaskDetails {
  id: string;
  project_id: string;
  task_id?: string | null;
  epic_id?: string | null;
  title: string;
  description?: string | null;
  status: string;
  priority?: string | null;
  due_date?: string | null;
  created_at?: string | null;
  assignee?: TaskDetailsUser | null;
  created_by?: TaskDetailsUser | null;
  epic?: {
    id?: string;
    title?: string | null;
    epic_id?: string | null;
  } | null;
}

interface UseTaskDetailsOptions {
  projectId: string;
  taskId: string | null;
  isOpen: boolean;
}

export default function useTaskDetails({
  projectId,
  taskId,
  isOpen,
}: UseTaskDetailsOptions) {
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTask = useCallback(
    async (signal?: AbortSignal) => {
      if (!projectId || !taskId || !isOpen) return;

      setIsLoading(true);
      setError("");
      setTask(null);

      try {
        const response = await fetch(
          `/api/projects/${encodeURIComponent(projectId)}/tasks/${encodeURIComponent(taskId)}`,
          {
            method: "GET",
            cache: "no-store",
            signal,
          },
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load task details",
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("Invalid task response from the server.");
        }

        if (!signal?.aborted) {
          setTask(data.length > 0 ? data[0] : null);
        }
      } catch (err) {
        if (signal?.aborted) return;

        setTask(null);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load task details",
        );
      } finally {
        if (!signal?.aborted) {
          setIsLoading(false);
        }
      }
    },
    [projectId, taskId, isOpen],
  );

  useEffect(() => {
    if (!isOpen || !projectId || !taskId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTask(null);
      setError("");
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    void fetchTask(controller.signal);

    return () => controller.abort();
  }, [isOpen, projectId, taskId, fetchTask]);

  const retry = useCallback(() => {
    void fetchTask();
  }, [fetchTask]);

  return {
    task,
    isLoading,
    error,
    retry,
  };
}
