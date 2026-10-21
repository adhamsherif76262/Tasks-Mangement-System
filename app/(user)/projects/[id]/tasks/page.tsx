// "use client";

// import { useState } from "react";
// import { useParams } from "next/navigation";

// import AddTaskModal from "@/components/AddTaskModal";
// import EmptyProjectTasksDesktopLayout from "@/components/EmptyProjectTasksDesktopLayout";
// import EmptyProjectTasksMobileLayout from "@/components/EmptyProjectTasksMobileLayout";
// import useProjectTasks from "@/app/hooks/useProjectTasks";

// export default function ProjectTasksPage() {
//   const params = useParams();
//   const projectId = String(params.id ?? params.projectID ?? params.projectId ?? "");

//   const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

//   // const { columns, retryColumn, refreshAll } = useProjectTasks(projectId);
//   const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

// const {
//   columns,
//   retryColumn,
//   loadMoreColumn,
//   mobileTasks,
//   loadMoreMobileTasks,
//   retryMobileTasks,
//   refreshAll,
// } = useProjectTasks(projectId);

//   return (
//     <section>
//       <EmptyProjectTasksDesktopLayout
//         columns={columns}
//         onRetry={retryColumn}
//           onLoadMore={loadMoreColumn}
//         onAddTask={() => setIsAddTaskOpen(true)}
//       />

// <EmptyProjectTasksMobileLayout
//   mobile={mobileTasks}
//   onRetry={retryMobileTasks}
//   onLoadMore={loadMoreMobileTasks}
//   onAddTask={() => setIsAddTaskOpen(true)}
//   onTaskClick={(task) => setSelectedTaskId(task.id)}
// />

//       <AddTaskModal
//         projectId={projectId}
//         isOpen={isAddTaskOpen}
//         onClose={() => {
//           setIsAddTaskOpen(false);
//           refreshAll();
//         }}
//       />
//     </section>
//   );
// }



"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import AddTaskModal from "@/components/AddTaskModal";
import EmptyProjectTasksDesktopLayout from "@/components/EmptyProjectTasksDesktopLayout";
import EmptyProjectTasksMobileLayout from "@/components/EmptyProjectTasksMobileLayout";
import useProjectTasks from "@/app/hooks/useProjectTasks";

export default function ProjectTasksPage() {
  const params = useParams();

  const projectId = String(
    params.id ?? params.projectID ?? params.projectId ?? "",
  );

  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    columns,
    retryColumn,
    loadMoreColumn,
    mobileTasks,
    loadMoreMobileTasks,
    retryMobileTasks,
    refreshAll,
  } = useProjectTasks(projectId, searchTerm);

  return (
    <section>
      <EmptyProjectTasksDesktopLayout
        columns={columns}
        onRetry={retryColumn}
        onLoadMore={loadMoreColumn}
        onAddTask={() => setIsAddTaskOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <EmptyProjectTasksMobileLayout
        mobile={mobileTasks}
        onRetry={retryMobileTasks}
        onLoadMore={loadMoreMobileTasks}
        onAddTask={() => setIsAddTaskOpen(true)}
        onTaskClick={(task) => setSelectedTaskId(task.id)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
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
