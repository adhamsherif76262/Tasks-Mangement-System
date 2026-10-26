
"use client";

import { useCallback, useEffect, useState } from "react";

export interface EpicTask {
  id: string;
  project_id: string;
  epic_id: string | null;
  title: string;
  description: string | null;
  status: string;
  created_at: string;
  due_date: string | null;
  task_id: string;
  epic?: {
    id: string;
    title: string;
    epic_id: string;
  } | null;
  created_by?: {
    id: string;
    name: string | null;
    email: string | null;
    department: string | null;
  } | null;
  assignee?: {
    id: string | null;
    name: string | null;
    email: string | null;
    department: string | null;
    avatar_url?: string | null;
  } | null;
}

interface UseEpicTasksOptions {
  projectId: string;
  epicId: string;
  isOpen: boolean;
}

export default function useEpicTasks({
  projectId,
  epicId,
  isOpen,
}: UseEpicTasksOptions) {
  const [tasks, setTasks] = useState<EpicTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => {
    setRetryCount((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!isOpen || !projectId || !epicId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTasks([]);
      setIsLoading(false);
      setError("");
      return;
    }

    const controller = new AbortController();

    async function fetchTasks() {
      setTasks([]);
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/projects/${encodeURIComponent(projectId)}/epics/${encodeURIComponent(epicId)}/tasks`,
          {
            method: "GET",
            signal: controller.signal,
            cache: "no-store",
          },
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load tasks for this epic.",
          );
        }

        if (!Array.isArray(data)) {
          throw new Error("The server returned an invalid task list.");
        }

        setTasks(data as EpicTask[]);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Failed to load epic tasks:", err);
        setTasks([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load tasks for this epic.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void fetchTasks();

    return () => {
      controller.abort();
    };
  }, [projectId, epicId, isOpen, retryCount]);

  return {
    tasks,
    isLoading,
    error,
    retry,
  };
}