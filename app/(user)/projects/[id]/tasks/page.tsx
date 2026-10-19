"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import AddTaskModal from "@/components/AddTaskModal";
import EmptyProjectTasksDesktopLayout from "@/components/EmptyProjectTasksDesktopLayout";
import EmptyProjectTasksMobileLayout from "@/components/EmptyProjectTasksMobileLayout";
import useProjectTasks from "@/app/hooks/useProjectTasks";

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = String(params.id ?? params.projectID ?? params.projectId ?? "");

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

  const { columns, retryColumn, refreshAll } = useProjectTasks(projectId);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  return (
    <section>
      <EmptyProjectTasksDesktopLayout
        columns={columns}
        onRetry={retryColumn}
        onAddTask={() => setIsAddTaskOpen(true)}
      />

      <EmptyProjectTasksMobileLayout
        columns={columns}
        onRetry={retryColumn}
        onAddTask={() => setIsAddTaskOpen(true)}
        onTaskClick={(task) => setSelectedTaskId(task.id)}
      />

      <AddTaskModal
        projectId={projectId}
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          refreshAll();
        }}
      />
    </section>
  );
}