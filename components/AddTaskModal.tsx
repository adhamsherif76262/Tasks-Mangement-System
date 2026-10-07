/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CheckCircle,
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
  initialEpicId?: string | null;
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
  initialEpicId = null,
  isOpen,
  onClose,
}: AddTaskModalProps) {

  const [showSuccess, setShowSuccess] = useState(false);
const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const {
  //   title,
  //   setTitle,

  //   description,
  //   setDescription,

  //   epicId,
  //   setEpicId,

  //   assigneeId,
  //   setAssigneeId,

  //   dueDate,
  //   setDueDate,

  //   status,
  //   setStatus,

  //   epics,
  //   members,

  //   epicsLoading,
  //   membersLoading,

  //   epicsError,
  //   membersError,

  //   submitError,
  //   isSubmitting,

  //   submitTask,
  // } = useCreateTask({
  //   projectId,
  //   isOpen,
  //   onSuccess: onClose,
  // });

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
  initialEpicId,
});

useEffect(() => {
  return () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };
}, []);

  if (!isOpen) {
    return null;
  }

  // const handleSubmit = async (
  //   event: React.FormEvent<HTMLFormElement>,
  // ) => {
  //   event.preventDefault();

  //   await submitTask();
  // };


  const handleSubmit = async (
  event: React.FormEvent<HTMLFormElement>,
) => {
  event.preventDefault();

  if (isSubmitting || showSuccess) {
    return;
  }

  const success = await submitTask();

  if (!success) {
    return;
  }

  setShowSuccess(true);

  closeTimeoutRef.current = setTimeout(() => {
    setShowSuccess(false);
    onClose();
  }, 3000);
};

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-[#0B2347]/35 backdrop-blur-[4px] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        className="relative flex max-h-[calc(100vh-24px)] w-full flex-col overflow-hidden rounded-t-[28px] bg-[#F2F4FF] shadow-2xl sm:h-[870px] sm:max-h-[calc(100vh-40px)] sm:w-[896px] sm:flex-row sm:rounded-[9px]"
      >

        {showSuccess && (
  <div className="pointer-events-none fixed left-1/2 top-6 z-[120] w-[calc(100%-32px)] max-w-[390px] -translate-x-1/2 sm:top-8">
    <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.14)]">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50">
        <CheckCircle
          size={20}
          strokeWidth={2.2}
          className="text-emerald-600"
        />
      </div>

      <div className="min-w-0">
        <p className="text-[13px] font-bold text-[#09254D]">
          Task created successfully
        </p>

        <p className="mt-0.5 text-[11px] text-[#71809A]">
          Your new task has been added to the project.
        </p>
      </div>
    </div>
  </div>
)}
        {/* Mobile drag handle */}
        <div className="absolute left-1/2 top-8 h-1.5 w-12 -translate-x-1/2 rounded-full bg-[#DCE1EF] sm:hidden" />

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting || showSuccess}
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
                  disabled={isSubmitting || showSuccess}
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
                  disabled={isSubmitting || showSuccess}
                  className="w-full rounded-[10px] border border-[#D3DEFF] bg-white px-3 py-3 text-[14px] leading-[1.55] text-[#09254D] outline-none placeholder:text-[#707789] focus:border-[#1769E0] disabled:opacity-60 [@media(min-height:900px)]:h-118 h-80 resize-none"
                />
              </div>
            <div className="flex max-sm:hidden items-center absolute bottom-0 w-[65%] left-0 justify-between bg-[#F2F4FF] px-8 py-4 ">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting || showSuccess}
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
                  disabled={isSubmitting || showSuccess}
                  className="flex h-10 min-w-[124px] items-center justify-center gap-2 rounded-[4px] bg-[#0757C8] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#0649A7] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting && (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  )}

                  {isSubmitting || showSuccess
                    ? "Adding..."
                    : "Add Task"}
                </button>
              </div>
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
                  showSuccess={showSuccess}
                  isSubmitting={isSubmitting || showSuccess}
                  onClose={onClose}
                  submitError={submitError}
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
                disabled={isSubmitting || showSuccess}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-[4px] bg-[#0757C8] text-[14px] font-bold text-white transition-colors hover:bg-[#0649A7] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting && (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                )}

                {isSubmitting || showSuccess ? "Adding Task..." : "Add Task"}
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
                showSuccess = {showSuccess}
                isSubmitting={isSubmitting || showSuccess}
                onClose={onClose}
                submitError={submitError}
              />
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

  showSuccess: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  submitError: string;
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
  showSuccess,
  onClose,
  submitError
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
            disabled={isSubmitting || showSuccess}
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
              showSuccess ||
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
                  <span className="mr-2 inline-block h-4 w-4 rounded-full text-[10px] font-black text-[#09254D]">
                    {getInitials(member.name)}
                  </span>{" "}
                  <span>

                  {member.name}
                  </span>
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
              showSuccess ||
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
                  value={epic.id}
                  // value={epic.epic_id}
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
            disabled={isSubmitting || showSuccess}
            className="h-10 w-full rounded-[7px] border border-[#D3DEFF] bg-white pl-10 pr-3 text-[13px] text-[#09254D] outline-none focus:border-[#1769E0] disabled:opacity-60"
          />
        </div>
      </div>
    </div>
  );
}