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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200">
      {/* Click Outside to Close Panel */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Structural Dialog Form Wrapper matching Figma Box (Max width 672px) */}
      <div className="relative w-full max-w-[672px] max-h-[90vh] bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Control Bar Header Context */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <span className="text-xs font-bold text-slate-400 tracking-wide uppercase">
              {epic?.epic_id || `EPIC-${epicId?.slice(0, 3).toUpperCase()}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
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

        {/* Scrollable Dynamic Modal Content Container Canvas Area */}
        <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
          
          {/* 1. Loading Layout Execution Screen */}
          {status === "loading" && (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium text-slate-400">Fetching latest epic properties...</p>
            </div>
          )}

          {/* 2. Error Feedback UI State */}
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

          {/* 3. Render Form Context After Success */}
          {status === "success" && epic && (
            <div className="flex flex-col gap-5">
              
              {/* Epic Title Display */}
              <div className="w-full border border-slate-100 rounded-xl bg-slate-50/30 p-3">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight leading-snug">
                  {epic.title}
                </h2>
              </div>

              {/* Epic Description Box Canvas Component */}
              <div className="w-full min-h-[100px] border border-slate-100 rounded-xl bg-white p-4">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {epic.description && epic.description.trim() !== "" 
                    ? epic.description 
                    : "No description provided"}
                </p>
              </div>

              {/* 2x2 Clean Uniform Metadata Grid Structure Area */}
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                  value={formatDate(epic.created_at)}
                />
              </div>

              {/* Epic Tasks Scope Module View */}
              <EpicTasksSection />

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
