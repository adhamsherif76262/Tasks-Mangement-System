"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import AddTaskModal from "@/components/AddTaskModal";
import TaskDetailsModal from "@/components/TaskDetailsModal";
import EmptyProjectTasksDesktopLayout from "@/components/EmptyProjectTasksDesktopLayout";
import EmptyProjectTasksMobileLayout from "@/components/EmptyProjectTasksMobileLayout";
import useProjectTasks, {
  type ProjectTask,
} from "@/app/hooks/useProjectTasks";

export default function ProjectTasksPage() {
  const params = useParams();

  const projectId = String(
    params.id ?? params.projectID ?? params.projectId ?? "",
  );

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const {
    columns,
    retryColumn,
    refreshAll,
    moveTask,
    movingTaskIds,
  } = useProjectTasks(projectId);

  const handleTaskClick = (task: ProjectTask) => {
    setSelectedTaskId(task.id);
  };

  return (
    <section>
      <EmptyProjectTasksDesktopLayout
        columns={columns}
        onRetry={retryColumn}
        onAddTask={() => setIsAddTaskOpen(true)}
        onMoveTask={moveTask}
        movingTaskIds={movingTaskIds}
        onTaskClick={handleTaskClick}
      />

      <EmptyProjectTasksMobileLayout
        columns={columns}
        onRetry={retryColumn}
        onAddTask={() => setIsAddTaskOpen(true)}
        onTaskClick={handleTaskClick}
      />

      <AddTaskModal
        projectId={projectId}
        isOpen={isAddTaskOpen}
        onClose={() => {
          setIsAddTaskOpen(false);
          refreshAll();
        }}
      />

      <TaskDetailsModal
        isOpen={selectedTaskId !== null}
        projectId={projectId}
        taskId={selectedTaskId}
        onClose={() => {
            setSelectedTaskId(null);
            refreshAll();
        }}
      />
    </section>
  );
}
