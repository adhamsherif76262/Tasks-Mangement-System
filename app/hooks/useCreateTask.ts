"use client";

import { useCallback, useEffect, useState } from "react";

export const TASK_STATUSES = [
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
] as const;

interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export type TaskStatus = (typeof TASK_STATUSES)[number];

export interface TaskEpic {
  id: string;
  epic_id: string;
  title: string;
}

interface UseCreateTaskProps {
  projectId: string;
  isOpen: boolean;
  initialEpicId?: string | null;
  onSuccess?: () => void;
}

export function formatTaskStatus(status: TaskStatus) {
  return status.replaceAll("_", " ");
}

export default function useCreateTask({
  projectId,
  isOpen,
  initialEpicId = null,
  onSuccess,
}: UseCreateTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [epicId, setEpicId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("TO_DO");

  const [epics, setEpics] = useState<TaskEpic[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);

  const [epicsLoading, setEpicsLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);

  const [epicsError, setEpicsError] = useState("");
  const [membersError, setMembersError] = useState("");

  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setTitle("");
    setDescription("");
    setEpicId("");
    setAssigneeId("");
    setDueDate("");
    setStatus("TO_DO");

    setSubmitError("");
  }, []);

  const loadEpics = useCallback(async () => {
    if (!projectId) return;

    setEpicsLoading(true);
    setEpicsError("");

    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(
          projectId,
        )}/epics?limit=1000&offset=0`,
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to load project epics.",
        );
      }

      setEpics(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to load task epics:", error);

      setEpics([]);
      setEpicsError(
        error instanceof Error
          ? error.message
          : "Failed to load project epics.",
      );
    } finally {
      setEpicsLoading(false);
    }
  }, [projectId]);

//   const loadMembers = useCallback(async () => {
//     if (!projectId) return;

//     setMembersLoading(true);
//     setMembersError("");

//     try {
//       const response = await fetch(
//         `/api/projects/project-members?project_id=${encodeURIComponent(
//           projectId,
//         )}`,
//       );

//       const data = await response.json().catch(() => null);

//       if (!response.ok) {
//         throw new Error(
//           data?.error || "Failed to load project members.",
//         );
//       }

//       setMembers(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Failed to load task members:", error);

//       setMembers([]);
//       setMembersError(
//         error instanceof Error
//           ? error.message
//           : "Failed to load project members.",
//       );
//     } finally {
//       setMembersLoading(false);
//     }
//   }, [projectId]);

const loadMembers = useCallback(async () => {
  if (!projectId) return;

  setMembersLoading(true);
  setMembersError("");

  try {
    const response = await fetch(
      `/api/projects/project-members?project_id=${encodeURIComponent(projectId)}`,
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error || "Failed to load project members",
      );
    }

    const normalizedMembers: ProjectMember[] = (
      Array.isArray(data) ? data : []
    ).map((member) => ({
      id: member.user_id,
      name: member.metadata?.name || member.email || "Unknown user",
      email: member.email || member.metadata?.email || "",
      role: member.role || "",
    }));

    setMembers(normalizedMembers);
  } catch (error) {
    console.error("Failed to load task members:", error);
    setMembers([]);
    setMembersError(
      error instanceof Error
        ? error.message
        : "Failed to load project members",
    );
  } finally {
    setMembersLoading(false);
  }
}, [projectId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    resetForm();

    loadEpics();
    loadMembers();
  }, [
    isOpen,
    resetForm,
    loadEpics,
    loadMembers,
  ]);

  useEffect(() => {
    if (!isOpen || !initialEpicId || epics.length === 0) {
      return;
    }

    const matchingEpic = epics.find(
      (epic) =>
        epic.id === initialEpicId ||
        epic.epic_id === initialEpicId,
    );

    if (matchingEpic) {
      setEpicId(matchingEpic.epic_id);
    }
  }, [isOpen, initialEpicId, epics]);

  const submitTask = useCallback(async () => {
    setSubmitError("");

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setSubmitError("Task title is required.");
      return false;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, string> = {
        title: trimmedTitle,
        status,
      };

      if (description.trim()) {
        payload.description = description.trim();
      }

      if (epicId) {
        payload.epic_id = epicId;
      }

      if (assigneeId) {
        payload.assignee_id = assigneeId;
      }

      if (dueDate) {
        const parsedDate = new Date(dueDate);

        if (Number.isNaN(parsedDate.getTime())) {
          setSubmitError("Please select a valid due date.");
          setIsSubmitting(false);
          return false;
        }

        payload.due_date = parsedDate.toISOString();
      }

      const response = await fetch(
        `/api/projects/${encodeURIComponent(projectId)}/tasks`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Failed to create task. Please try again.",
        );
      }

      onSuccess?.();

      return true;
    } catch (error) {
      console.error("Failed to create task:", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to create task. Please try again.",
      );

      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    title,
    description,
    epicId,
    assigneeId,
    dueDate,
    status,
    projectId,
    onSuccess,
  ]);

  return {
    title,
    setTitle,

    description,
    setDescription,

    epicId,
    setEpicId,

    assigneeId,
    setAssigneeId,

    dueDate,
    setDueDate,

    status,
    setStatus,

    epics,
    members,

    epicsLoading,
    membersLoading,

    epicsError,
    membersError,

    submitError,
    isSubmitting,

    submitTask,
  };
}