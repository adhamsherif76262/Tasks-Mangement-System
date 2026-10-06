"use client";
import EmptyProjectTasksDesktopLayout from "@/components/EmptyProjectTasksDesktopLayout";
import EmptyProjectTasksMobileLayout from "@/components/EmptyProjectTasksMobileLayout";

export default function ProjectTasksPage() {
  return (
    <section>
      <EmptyProjectTasksDesktopLayout/>
      <EmptyProjectTasksMobileLayout/>
    </section>
  );
}