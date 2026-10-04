"use client";

import React, { useEffect, useState } from "react";
// import { Epic } from "../types"; // Adjust mapping to your actual paths
import { EpicDetailField } from "./epic-detail-field";
import { EpicTasksSection } from "./epic-tasks-section";

interface EpicDetailsModalProps {
  isOpen: boolean;
  epicId: string | null;
  projectId: string;
  onClose: () => void;
}
interface EpicUser {
  sub: string;
  name: string;
  email: string;
  department: string | null;
}

interface Epic {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  created_at: string;
  deadline: string | null;
  epic_id: string;
  created_by: EpicUser;
  assignee: EpicUser;
}

export function EpicDetailsModal({
  isOpen,
  epicId,
  projectId,
  onClose,
}: EpicDetailsModalProps) {
  const [epic, setEpic] = useState<Epic | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen || !epicId || !projectId) return;

    async function fetchEpicDetails() {
      // 1. Clear previous state immediately to guarantee no stale flash updates
      setEpic(null);
      setStatus("loading");
      setErrorMessage("");

      try {
        const res = await fetch(
          `/api/projects/${encodeURIComponent(projectId)}/epics/${encodeURIComponent(epicId as string)}`,
          { method: "GET" }
        );

        if (!res.ok) {
          throw new Error("Failed to load epic information");
        }

        const data: Epic = await res.json();
        setEpic(data);
        setStatus("success");
      } catch (err: any) {
        console.error("Error loading single epic context details:", err);
        setErrorMessage(err?.message || "Something went wrong loading epic details.");
        setStatus("error");
      }
    }

    fetchEpicDetails();
  }, [isOpen, epicId, projectId]);

  // Trap backgrounds and manage display states smoothly
  if (!isOpen) return null;

  // Formatting date strings reliably matching UI 'Dec 25, 2025'
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper logic for extractable fallback initials
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200">
      
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full sm:max-w-[672px] h-auto max-h-[92vh] sm:max-h-[90vh] bg-white rounded-t-[28px] sm:rounded-2xl shadow-xl border-t sm:border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        <div className="w-full flex justify-center py-3 sm:hidden shrink-0 bg-white">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 pb-4 pt-1 sm:py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 10V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2C2.55 2 3.02083 2.19583 3.4125 2.5875C3.80417 2.97917 4 3.45 4 4V10C4 10.55 3.80417 11.0208 3.4125 11.4125C3.02083 11.8042 2.55 12 2 12C1.45 12 0.979167 11.8042 0.5875 11.4125C0.195833 11.0208 0 10.55 0 10ZM7 14C6.45 14 5.97917 13.8042 5.5875 13.4125C5.19583 13.0208 5 12.55 5 12V2C5 1.45 5.19583 0.979167 5.5875 0.5875C5.97917 0.195833 6.45 0 7 0H13C13.55 0 14.0208 0.195833 14.4125 0.5875C14.8042 0.979167 15 1.45 15 2V12C15 12.55 14.8042 13.0208 14.4125 13.4125C14.0208 13.8042 13.55 14 13 14H7ZM16 10V4C16 3.45 16.1958 2.97917 16.5875 2.5875C16.9792 2.19583 17.45 2 18 2C18.55 2 19.0208 2.19583 19.4125 2.5875C19.8042 2.97917 20 3.45 20 4V10C20 10.55 19.8042 11.0208 19.4125 11.4125C19.0208 11.8042 18.55 12 18 12C17.45 12 16.9792 11.8042 16.5875 11.4125C16.1958 11.0208 16 10.55 16 10Z" fill="#003D9B"/>
            </svg>

            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
              {epic?.epic_id || `EPIC-${epicId?.slice(0, 3).toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Copy link</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded-md text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar pb-10 sm:pb-5">
          
          {status === "loading" && (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-slate-400">Fetching latest epic properties...</p>
            </div>
          )}

          {status === "error" && (
            <div className="w-full py-16 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-sm font-bold text-slate-800">Failed to load details</h4>
              <p className="text-xs text-slate-500 max-w-sm">{errorMessage}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 h-9 px-4 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold transition"
              >
                Close View
              </button>
            </div>
          )}

          {status === "success" && epic && (
            <div className="flex flex-col gap-5">
              
              <div className="w-full border border-slate-100 rounded-xl bg-slate-50/30 p-3">
                <h2 className="text-base font-bold text-slate-800 tracking-tight leading-snug">
                  {epic.title}
                </h2>
              </div>

              <div className="w-full min-h-[100px] border border-slate-100 rounded-xl bg-white p-4">
                <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {epic.description && epic.description.trim() !== "" 
                    ? epic.description 
                    : "No description provided"}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <EpicDetailField
                  label="Assignee"
                  avatarUrl={epic.assignee?.name}
                  avatarFallback={getInitials(epic.assignee?.name)}
                  value={epic.assignee?.name || "Unassigned"}
                  isInteractive={true}
                />

                <EpicDetailField
                  label="Deadline"
                  icon={
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  value={formatDate(epic.deadline)}
                  isInteractive={true}
                />

                <EpicDetailField
                  label="Created By"
                  avatarUrl={epic.created_by?.name}
                  avatarFallback={getInitials(epic.created_by?.name)}
                  value={epic.created_by?.name || "Unknown"}
                />

                <EpicDetailField
                  label="Created At"
                  icon={
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  value={formatDate(epic.created_at)}
                />
              </div>

              {/* Tasks Empty State Section */}
              <EpicTasksSection />

            </div>
          )}

        </div>
      </div>
    </div>
  );
  
}
