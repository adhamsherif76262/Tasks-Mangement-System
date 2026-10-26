
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface EpicProjectMember {
  user_id: string;
  email?: string;
  role?: string;
  metadata?: {
    name?: string;
    avatar_url?: string;
    avatar?: string;
    [key: string]: unknown;
  };
  avatar_url?: string;
}

export type EpicEditableField =
  | "title"
  | "description"
  | "assignee_id"
  | "deadline";

type UpdateEpicOptions = {
  projectId: string;
  epicId: string;
  isOpen: boolean;
};

export default function useUpdateEpic({
  projectId,
  epicId,
  isOpen,
}: UpdateEpicOptions) {
  const [updatingFields, setUpdatingFields] = useState<Record<EpicEditableField, boolean>
  >({
    title: false,
    description: false,
    assignee_id: false,
    deadline: false,
  });

  const [members, setMembers] = useState<EpicProjectMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState("");
  const [errorToast, setErrorToast] = useState("");

  const inFlightFields = useRef(new Set<EpicEditableField>());
  const loadedProjectId = useRef<string | null>(null);

  useEffect(() => {
    if (loadedProjectId.current !== projectId) {
      loadedProjectId.current = null;
      setMembers([]);
      setMembersError("");
    }
  }, [projectId]);

  useEffect(() => {
    if (!isOpen || !projectId || loadedProjectId.current === projectId) {
      return;
    }

    let cancelled = false;

    async function loadMembers() {
      setMembersLoading(true);
      setMembersError("");

      try {
        const response = await fetch(
          `/api/projects/project-members?project_id=${encodeURIComponent(projectId)}`,
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to load project members.",
          );
        }

        if (cancelled) return;

        setMembers(Array.isArray(data) ? data : []);
        loadedProjectId.current = projectId;
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load epic assignees:", error);
        setMembersError("Failed to load project members.");
      } finally {
        if (!cancelled) setMembersLoading(false);
      }
    }

    void loadMembers();

    return () => {
      cancelled = true;
    };
  }, [isOpen, projectId]);

  const updateField = useCallback(
    async (
      field: EpicEditableField,
      apiValue: string | null,
      applyOptimisticUpdate: () => void,
      rollbackUpdate: () => void,
    ): Promise<boolean> => {
      // Prevent duplicate requests for the same field only.
      if (inFlightFields.current.has(field)) return false;

      inFlightFields.current.add(field);
      setUpdatingFields((current) => ({
        ...current,
        [field]: true,
      }));
      setErrorToast("");

      // Reflect the new value immediately.
      applyOptimisticUpdate();

      try {
        const response = await fetch(
          `/api/projects/${encodeURIComponent(projectId)}/epics/${encodeURIComponent(epicId)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ [field]: apiValue }),
          },
        );

        if (!response.ok) {
          throw new Error("Epic update failed.");
        }

        return true;
      } catch (error) {
        console.error(`Failed to update epic ${field}:`, error);

        // Restore only the field that failed.
        rollbackUpdate();
        setErrorToast("Failed to update epic. Please try again.");

        return false;
      } finally {
        inFlightFields.current.delete(field);
        setUpdatingFields((current) => ({
          ...current,
          [field]: false,
        }));
      }
    },
    [projectId, epicId],
  );

  return {
    updateField,
    updatingFields,
    members,
    membersLoading,
    membersError,
    errorToast,
    clearErrorToast: () => setErrorToast(""),
  };
}