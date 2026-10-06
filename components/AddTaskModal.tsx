"use client";

import {
  CalendarDays,
  Check,
  ChevronDown,
  Loader2,
  X,
} from "lucide-react";

import useCreateTask, {
  formatTaskStatus,
  TASK_STATUSES,
} from "../app/hooks/useCreateTask";

interface AddTaskModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function truncateEpicTitle(title: string) {
  if (title.length <= 100) {
    return title;
  }

  return `${title.slice(0, 97)}...`;
}

export default function AddTaskModal({
  projectId,
  isOpen,
  onClose,
}: AddTaskModalProps) {
  const {
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
  } = useCreateTask({
    projectId,
    isOpen,
    onSuccess: onClose,
  });

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    await submitTask();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0B2347]/35 backdrop-blur-[4px] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        className="relative flex max-h-[calc(100vh-24px)] w-full flex-col overflow-hidden rounded-t-[28px] bg-[#F2F4FF] shadow-2xl sm:h-[870px] sm:max-h-[calc(100vh-40px)] sm:w-[896px] sm:flex-row sm:rounded-[9px]"
      >
        {/* Mobile drag handle */}
        <div className="absolute left-1/2 top-8 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[#DCE1EF] sm:hidden" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close"
          className="absolute right-7 top-7 z-10 text-[#3E4657] transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40 sm:right-7 sm:top-8"
        >
          <X size={24} strokeWidth={2} />
        </button>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 w-full flex-col sm:flex-row"
        >
          {/* Left side */}
          <div className="flex min-h-0 flex-1 flex-col bg-white">
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-12 sm:px-8 sm:pb-8 sm:pt-8">
              <h2
                id="add-task-title"
                className="text-[24px] font-bold tracking-[-0.025em] text-[#09254D] sm:text-[21px]"
              >
                Add New Task
              </h2>

              {/* Title */}
              <div className="mt-7">
                <label
                  htmlFor="task-title"
                  className="mb-3 block text-[12px] font-bold tracking-[0.04em] text-[#4C5362]"
                >
                  TITLE
                </label>

                <input
                  id="task-title"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g., Finalize structural schematics"
                  disabled={isSubmitting}
                  className="h-[55px] w-full rounded-[10px] border border-[#D3DEFF] bg-white px-3 text-[14px] text-[#09254D] outline-none placeholder:text-[#707789] focus:border-[#1769E0] disabled:opacity-60"
                />
              </div>

              {/* Description */}
              <div className="mt-7">
                <label
                  htmlFor="task-description"
                  className="mb-3 block text-[12px] font-bold tracking-[0.04em] text-[#4C5362]"
                >
                  DESCRIPTION
                </label>

                <textarea
                  id="task-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Provide detailed context for this task..."
                  disabled={isSubmitting}
                  className="h-[250px] w-full resize-none rounded-[10px] border border-[#D3DEFF] bg-white px-3 py-3 text-[14px] leading-[1.55] text-[#09254D] outline-none placeholder:text-[#707789] focus:border-[#1769E0] disabled:opacity-60 sm:h-[472px]"
                />
              </div>

              {/* Mobile fields */}
              <div className="sm:hidden">
                <TaskFields
                  status={status}
                  setStatus={setStatus}
                  epicId={epicId}
                  setEpicId={setEpicId}
                  assigneeId={assigneeId}
                  setAssigneeId={setAssigneeId}
                  dueDate={dueDate}
                  setDueDate={setDueDate}
                  epics={epics}
                  members={members}
                  epicsLoading={epicsLoading}
                  membersLoading={membersLoading}
                  epicsError={epicsError}
                  membersError={membersError}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>

            {/* Mobile submit */}
            <div className="border-t border-[#E1E6F2] bg-[#F2F4FF] px-6 py-4 sm:hidden">
              {submitError && (
                <p className="mb-3 text-[12px] font-medium text-[#D21F26]">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#0757C8] text-[14px] font-bold text-white transition-colors hover:bg-[#0649A7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {isSubmitting ? "Adding Task..." : "Add Task"}
              </button>
            </div>
          </div>

          {/* Desktop right side */}
          <div className="hidden w-[320px] shrink-0 flex-col bg-[#F2F4FF] sm:flex">
            <div className="flex-1 px-8 pt-8">
              <TaskFields
                status={status}
                setStatus={setStatus}
                epicId={epicId}
                setEpicId={setEpicId}
                assigneeId={assigneeId}
                setAssigneeId={setAssigneeId}
                dueDate={dueDate}
                setDueDate={setDueDate}
                epics={epics}
                members={members}
                epicsLoading={epicsLoading}
                membersLoading={membersLoading}
                epicsError={epicsError}
                membersError={membersError}
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between bg-[#F2F4FF] px-8 py-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-9 rounded-[4px] bg-[#D8E4FF] px-4 text-[14px] font-medium text-[#09254D] transition-colors hover:bg-[#C9D8FC] disabled:opacity-50"
              >
                Close
              </button>

              <div className="flex flex-col items-end">
                {submitError && (
                  <p className="mb-2 max-w-[190px] text-right text-[11px] font-medium text-[#D21F26]">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex h-10 min-w-[124px] items-center justify-center gap-2 rounded-[4px] bg-[#0757C8] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#0649A7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {isSubmitting
                    ? "Adding..."
                    : "Add Task"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

interface TaskFieldsProps {
  status: ReturnType<typeof useCreateTask>["status"];
  setStatus: ReturnType<typeof useCreateTask>["setStatus"];

  epicId: string;
  setEpicId: (value: string) => void;

  assigneeId: string;
  setAssigneeId: (value: string) => void;

  dueDate: string;
  setDueDate: (value: string) => void;

  epics: ReturnType<typeof useCreateTask>["epics"];
  members: ReturnType<typeof useCreateTask>["members"];

  epicsLoading: boolean;
  membersLoading: boolean;

  epicsError: string;
  membersError: string;

  isSubmitting: boolean;
}

function TaskFields({
  status,
  setStatus,
  epicId,
  setEpicId,
  assigneeId,
  setAssigneeId,
  dueDate,
  setDueDate,
  epics,
  members,
  epicsLoading,
  membersLoading,
  epicsError,
  membersError,
  isSubmitting,
}: TaskFieldsProps) {
  return (
    <div className="space-y-6">
      {/* Status */}
      <div>
        <label
          htmlFor="task-status"
          className="mb-3 block text-[12px] font-bold tracking-[0.04em] text-[#4C5362]"
        >
          STATUS
        </label>

        <div className="relative">
          <select
            id="task-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as typeof status,
              )
            }
            disabled={isSubmitting}
            className="h-10 w-full appearance-none rounded-[7px] border border-[#D3DEFF] bg-white px-3 pr-10 text-[13px] text-[#09254D] outline-none focus:border-[#1769E0] disabled:opacity-60"
          >
            {TASK_STATUSES.map((taskStatus : any) => (
              <option
                key={taskStatus}
                value={taskStatus}
              >
                {formatTaskStatus(taskStatus)}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#687387]"
          />
        </div>
      </div>

      {/* Assignee */}
      <div>
        <label
          htmlFor="task-assignee"
          className="mb-3 block text-[12px] font-bold tracking-[0.04em] text-[#4C5362]"
        >
          ASSIGNEE
        </label>

        <div className="relative">
          <select
            id="task-assignee"
            value={assigneeId}
            onChange={(event) =>
              setAssigneeId(event.target.value)
            }
            disabled={
              isSubmitting ||
              membersLoading ||
              !!membersError
            }
            className="h-10 w-full appearance-none rounded-[7px] border border-[#D3DEFF] bg-white px-3 pr-10 text-[13px] text-[#09254D] outline-none focus:border-[#1769E0] disabled:opacity-60"
          >
            <option value="">
              {membersLoading
                ? "Loading team members..."
                : "Select Team Member"}
            </option>

            {!membersLoading &&
              members.map((member : any) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>
              ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#687387]"
          />
        </div>

        {membersError && (
          <p className="mt-2 text-[10px] text-[#D21F26]">
            {membersError}
          </p>
        )}
      </div>

      {/* Epic */}
      <div>
        <label
          htmlFor="task-epic"
          className="mb-3 block text-[12px] font-bold tracking-[0.04em] text-[#4C5362]"
        >
          EPIC
        </label>

        <div className="relative">
          <select
            id="task-epic"
            value={epicId}
            onChange={(event) =>
              setEpicId(event.target.value)
            }
            disabled={
              isSubmitting ||
              epicsLoading ||
              !!epicsError
            }
            className="h-10 w-full appearance-none rounded-[7px] border border-[#D3DEFF] bg-white px-3 pr-10 text-[13px] text-[#09254D] outline-none focus:border-[#1769E0] disabled:opacity-60"
          >
            <option value="">
              {epicsLoading
                ? "Loading epics..."
                : "Select Epic"}
            </option>

            {!epicsLoading &&
              epics.map((epic : any) => (
                <option
                  key={epic.epic_id}
                  value={epic.epic_id}
                >
                  {epic.epic_id}{" "}
                  {truncateEpicTitle(epic.title)}
                </option>
              ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#687387]"
          />
        </div>

        {epicsError && (
          <p className="mt-2 text-[10px] text-[#D21F26]">
            {epicsError}
          </p>
        )}
      </div>

      {/* Due Date */}
      <div>
        <label
          htmlFor="task-due-date"
          className="mb-3 block text-[12px] font-bold tracking-[0.04em] text-[#4C5362]"
        >
          DUE DATE
        </label>

        <div className="relative">
          <CalendarDays
            size={17}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA6BA]"
          />

          <input
            id="task-due-date"
            type="datetime-local"
            value={dueDate}
            onChange={(event) =>
              setDueDate(event.target.value)
            }
            disabled={isSubmitting}
            className="h-10 w-full rounded-[7px] border border-[#D3DEFF] bg-white pl-10 pr-3 text-[13px] text-[#09254D] outline-none focus:border-[#1769E0] disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
}