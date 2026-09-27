"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import { useParams } from "next/navigation";

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_BASE_URL!,
  process.env.NEXT_PUBLIC_SECRET_KEYS!
);

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

type PageState = "loading" | "success" | "empty" | "error";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function formatDeadline(deadline: string | null) {
  if (!deadline) return "No deadline";
  // deadline is a plain "YYYY-MM-DD" date, not a timestamp — parse as
  // local calendar date so it doesn't shift a day due to UTC parsing.
  const [year, month, day] = deadline.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function EpicCardSkeleton() {
  return (
    <div className="bg-white rounded-[6px] border border-[#E2E5EE] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-5 w-20 bg-[#EEF1FC] rounded" />
        <div className="h-6 w-6 bg-[#EEF1FC] rounded-full" />
      </div>
      <div className="h-4 w-3/4 bg-[#EEF1FC] rounded mb-5" />
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 bg-[#EEF1FC] rounded-full" />
        <div className="h-3 w-24 bg-[#EEF1FC] rounded" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[#F0F1F6]">
        <div className="h-3 w-20 bg-[#EEF1FC] rounded" />
        <div className="h-3 w-16 bg-[#EEF1FC] rounded" />
      </div>
    </div>
  );
}

function EpicCard({ epic }: { epic: Epic }) {
  return (
    <div className="bg-white rounded-[6px] border-l-4 border-l-[#0052CC] border-y border-r border-y-[#E2E5EE] border-r-[#E2E5EE] p-5 shadow-[0_1px_3px_rgba(4,27,60,0.03)]">
      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#0052CC] bg-[#EEF1FC] px-2.5 py-1 rounded">
        {epic.epic_id}
      </span>

      <h3 className="text-[15px] font-bold text-[#0A1629] mt-3 mb-4 leading-snug">
        {epic.title}
      </h3>

      <div className="flex items-center gap-2.5 mb-4">
        <div className="h-8 w-8 shrink-0 rounded-full bg-[#0052CC] text-white text-[11px] font-bold flex items-center justify-center">
          {getInitials(epic.assignee?.name ?? "Unassigned")}
        </div>
        <div>
          <p className="text-[10px] text-[#8A94A6]">Assignee</p>
          <p className="text-[12px] font-bold text-[#0A1629]">
            {epic.assignee?.name ?? "Unassigned"}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[#7D8592] pt-3 border-t border-[#F0F1F6]">
        <span>Created by: {epic.created_by?.name ?? "Unknown"}</span>
        <span>{formatDeadline(epic.deadline)}</span>
      </div>
    </div>
  );
}

function EmptyStateIcon() {
  return (
    <div className="relative h-[224px] w-[224px] rounded-[32px] bg-white shadow-[0_25px_50px_-12px_rgba(0,61,155,0.1)] flex items-center justify-center mb-5">
      <div className="grid grid-cols-2 gap-3">
        {/* Rocket — solid icon, light blue tile */}
        <div className="h-[88px] w-[88px] rounded-[16px] bg-[#DCE4FA] flex items-center justify-center">
<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 9.99446L6.9375 11.0257C7.22917 10.4424 7.53125 9.87987 7.84375 9.33821C8.15625 8.79654 8.5 8.25487 8.875 7.71321L7.125 7.36946L4.5 9.99446ZM8.9375 12.5882L12.5 16.1195C13.375 15.7861 14.3125 15.2757 15.3125 14.5882C16.3125 13.9007 17.25 13.1195 18.125 12.2445C19.5833 10.7861 20.724 9.16633 21.5469 7.38508C22.3698 5.60383 22.7292 3.96321 22.625 2.46321C21.125 2.35904 19.4792 2.71841 17.6875 3.54133C15.8958 4.36425 14.2708 5.50487 12.8125 6.96321C11.9375 7.83821 11.1562 8.77571 10.4688 9.77571C9.78125 10.7757 9.27083 11.7132 8.9375 12.5882ZM14.5 10.557C14.0208 10.0778 13.7812 9.48925 13.7812 8.79133C13.7812 8.09341 14.0208 7.50487 14.5 7.02571C14.9792 6.54654 15.5729 6.30696 16.2812 6.30696C16.9896 6.30696 17.5833 6.54654 18.0625 7.02571C18.5417 7.50487 18.7812 8.09341 18.7812 8.79133C18.7812 9.48925 18.5417 10.0778 18.0625 10.557C17.5833 11.0361 16.9896 11.2757 16.2812 11.2757C15.5729 11.2757 14.9792 11.0361 14.5 10.557ZM15.0938 20.5882L17.7188 17.9632L17.375 16.2132C16.8333 16.5882 16.2917 16.9267 15.75 17.2288C15.2083 17.5309 14.6458 17.8278 14.0625 18.1195L15.0938 20.5882ZM24.875 0.181956C25.2708 2.70279 25.026 5.15591 24.1406 7.54133C23.2552 9.92675 21.7292 12.2028 19.5625 14.3695L20.1875 17.4632C20.2708 17.8799 20.25 18.2861 20.125 18.682C20 19.0778 19.7917 19.4215 19.5 19.7132L14.25 24.9632L11.625 18.807L6.28125 13.4632L0.125 10.8382L5.34375 5.58821C5.63542 5.29654 5.98438 5.08821 6.39062 4.96321C6.79688 4.83821 7.20833 4.81737 7.625 4.90071L10.7188 5.52571C12.8854 3.35904 15.1562 1.82779 17.5312 0.931956C19.9062 0.0361223 22.3542 -0.213878 24.875 0.181956ZM2.34375 17.432C3.07292 16.7028 3.96354 16.333 5.01562 16.3226C6.06771 16.3122 6.95833 16.6715 7.6875 17.4007C8.41667 18.1299 8.77604 19.0205 8.76562 20.0726C8.75521 21.1247 8.38542 22.0153 7.65625 22.7445C7.13542 23.2653 6.26562 23.7132 5.04688 24.0882C3.82812 24.4632 2.14583 24.7965 0 25.0882C0.291667 22.9424 0.625 21.2601 1 20.0413C1.375 18.8226 1.82292 17.9528 2.34375 17.432ZM4.125 19.182C3.91667 19.3903 3.70833 19.7705 3.5 20.3226C3.29167 20.8747 3.14583 21.432 3.0625 21.9945C3.625 21.9111 4.18229 21.7705 4.73438 21.5726C5.28646 21.3747 5.66667 21.1715 5.875 20.9632C6.125 20.7132 6.26042 20.4111 6.28125 20.057C6.30208 19.7028 6.1875 19.4007 5.9375 19.1507C5.6875 18.9007 5.38542 18.7809 5.03125 18.7913C4.67708 18.8017 4.375 18.932 4.125 19.182Z" fill="#0052CC"/>
</svg>

        </div>

        {/* Compass — outline icon, lighter tile */}
        <div className="h-[88px] w-[88px] rounded-[16px] bg-[#EEF1FC] flex items-center justify-center">
<svg width="14" height="23" viewBox="0 0 14 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0.3125 22.5L0 19.75L3.5625 9.9375C3.875 10.2292 4.21354 10.474 4.57812 10.6719C4.94271 10.8698 5.33333 11.0208 5.75 11.125L2.3125 20.5625L0.3125 22.5ZM13.4375 22.5L11.4375 20.5625L8 11.125C8.41667 11.0208 8.80729 10.8698 9.17188 10.6719C9.53646 10.474 9.875 10.2292 10.1875 9.9375L13.75 19.75L13.4375 22.5ZM6.875 10C5.83333 10 4.94792 9.63542 4.21875 8.90625C3.48958 8.17708 3.125 7.29167 3.125 6.25C3.125 5.4375 3.35938 4.71354 3.82812 4.07812C4.29688 3.44271 4.89583 3 5.625 2.75V0H8.125V2.75C8.85417 3 9.45312 3.44271 9.92188 4.07812C10.3906 4.71354 10.625 5.4375 10.625 6.25C10.625 7.29167 10.2604 8.17708 9.53125 8.90625C8.80208 9.63542 7.91667 10 6.875 10ZM6.875 7.5C7.22917 7.5 7.52604 7.38021 7.76562 7.14062C8.00521 6.90104 8.125 6.60417 8.125 6.25C8.125 5.89583 8.00521 5.59896 7.76562 5.35938C7.52604 5.11979 7.22917 5 6.875 5C6.52083 5 6.22396 5.11979 5.98438 5.35938C5.74479 5.59896 5.625 5.89583 5.625 6.25C5.625 6.60417 5.74479 6.90104 5.98438 7.14062C6.22396 7.38021 6.52083 7.5 6.875 7.5Z" fill="#737685"/>
</svg>

        </div>

        {/* Grid squares — solid icon, light blue tile */}
        <div className="h-[88px] w-[88px] rounded-[16px] bg-[#DCE4FA] flex items-center justify-center">
<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 10V0H10V10H0ZM0 22.5V12.5H10V22.5H0ZM12.5 10V0H22.5V10H12.5ZM12.5 22.5V12.5H22.5V22.5H12.5ZM2.5 7.5H7.5V2.5H2.5V7.5ZM15 7.5H20V2.5H15V7.5ZM15 20H20V15H15V20ZM2.5 20H7.5V15H2.5V20Z" fill="#737685"/>
</svg>

        </div>

        {/* Plus — dashed border tile, empty/placeholder */}
        <div className="h-[88px] w-[88px] rounded-[16px] border-2 border-dashed border-[#C7CFE2] flex items-center justify-center">
          <svg className="h-7 w-7 text-[#B7C0D9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// export default function ProjectEpicsPage({ params }: { params: Promise<{ projectId: string }> }) {
export default function ProjectEpicsPage() {
  // const { projectId } = use(params);
  const params = useParams();
  
  const projectId = String(
    params.id ?? "",
  );
  const [epics, setEpics] = useState<Epic[]>([]);
  const [state, setState] = useState<PageState>("loading");
  const [projectName, setProjectName] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchEpics = useCallback(async () => {
    setState("loading");
    setEpics([]); // never show a stale project's epics while a new one loads

    const { data, error } = await supabase
      .from("project_epics")
      .select("*")
      .eq("project_id", projectId);

    if (error) {
      setState("error");
      return;
    }

    setEpics(data ?? []);
    setState(data.length === 0 ? "empty" : "success");
  }, [projectId]);

  useEffect(() => {
    fetchEpics();
  }, [fetchEpics]);

  // Best-effort project name for the breadcrumb — adjust table/column
  // if your schema names it differently.
  useEffect(() => {
    let cancelled = false;
    supabase
      .from("projects")
      .select("name")
      .eq("id", projectId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProjectName(data?.name ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const filteredEpics = epics.filter((epic) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      epic.title.toLowerCase().includes(q) ||
      epic.epic_id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen w-full bg-[#F9F9FF] px-4 py-6 md:px-8 md:py-8 font-sans pb-24 md:pb-8">
      {/* Breadcrumb - desktop only */}
      <nav className="max-xxs:hidden md:block text-[10px] font-bold uppercase tracking-wider text-[#8A94A6] mb-6">
        PROJECTS &gt; {projectName ?? "…"} &gt; <span className="text-[#0A1629]">EPICS</span>
      </nav>

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-[24px] font-bold text-[#0A1629] max-xxs:hidden">Project Epics</h1>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 xxs:w-72">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A94A6]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search epics..."
              className="w-full h-11 bg-[#EEF1FC]/50 border border-transparent rounded-[4px] pl-10 pr-4 text-[12px] text-[#0A1629] outline-none placeholder-[#8D96AA] focus:border-[#0052CC] transition-colors"
            />
          </div>

          {/* Desktop button */}
          <Link
            href={`/projects/${projectId}/epics/new`}
            className="max-xxs:hidden xxs:inline-flex items-center gap-2 h-11 bg-[#0052CC] hover:bg-[#0040A3] text-white font-bold text-[12px] px-5 rounded-[4px] shadow-[0_2px_6px_rgba(0,82,204,0.15)] transition-colors whitespace-nowrap"
          >
            <span className="text-base leading-none">+</span> New Epic
          </Link>
        </div>
      </div>

      {/* Loading state */}
      {state === "loading" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <EpicCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div className="flex flex-col items-center justify-center text-center py-24">
          <div className="h-14 w-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-5">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="64" height="64" rx="12" fill="#FFDAD6"/>
                  <path d="M41.75 44.375L38.4375 41.125H25.125C23.2083 41.125 21.5833 40.4583 20.25 39.125C18.9167 37.7917 18.25 36.1667 18.25 34.25C18.25 32.6458 18.7448 31.2188 19.7344 29.9688C20.724 28.7188 22 27.9167 23.5625 27.5625C23.625 27.3958 23.6875 27.2344 23.75 27.0781C23.8125 26.9219 23.875 26.75 23.9375 26.5625L18.75 21.375L20.5 19.625L43.5 42.625L41.75 44.375ZM25.125 38.625H35.9375L25.875 28.5625C25.8333 28.7917 25.8021 29.0104 25.7812 29.2188C25.7604 29.4271 25.75 29.6458 25.75 29.875H25.125C23.9167 29.875 22.8854 30.3021 22.0312 31.1562C21.1771 32.0104 20.75 33.0417 20.75 34.25C20.75 35.4583 21.1771 36.4896 22.0312 37.3438C22.8854 38.1979 23.9167 38.625 25.125 38.625ZM44 39.5625L42.1875 37.8125C42.5417 37.5208 42.8073 37.1823 42.9844 36.7969C43.1615 36.4115 43.25 35.9792 43.25 35.5C43.25 34.625 42.9479 33.8854 42.3438 33.2812C41.7396 32.6771 41 32.375 40.125 32.375H38.25V29.875C38.25 28.1458 37.6406 26.6719 36.4219 25.4531C35.2031 24.2344 33.7292 23.625 32 23.625C31.4375 23.625 30.8958 23.6927 30.375 23.8281C29.8542 23.9635 29.3542 24.1771 28.875 24.4688L27.0625 22.6562C27.7917 22.1562 28.5677 21.776 29.3906 21.5156C30.2135 21.2552 31.0833 21.125 32 21.125C34.4375 21.125 36.5052 21.974 38.2031 23.6719C39.901 25.3698 40.75 27.4375 40.75 29.875C42.1875 30.0417 43.3802 30.6615 44.3281 31.7344C45.276 32.8073 45.75 34.0625 45.75 35.5C45.75 36.3125 45.5938 37.0677 45.2812 37.7656C44.9688 38.4635 44.5417 39.0625 44 39.5625Z" fill="#BA1A1A"/>
                </svg>
          </div>
          <h2 className="text-[18px] font-bold text-[#0A1629] mb-2">Something went wrong</h2>
          <p className="text-[13px] text-[#7D8592] max-w-sm mb-6">
            We're having trouble retrieving your project epics right now. Please try again in a moment.
          </p>
          <button
            onClick={fetchEpics}
            className="h-11 bg-[#0052CC] hover:bg-[#0040A3] text-white font-bold text-[12px] px-6 rounded-[4px] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Empty state */}
      {state === "empty" && (
        <div className="flex flex-col items-center justify-center text-center py-24">
          {/* <div className="h-14 w-14 rounded-full bg-[#EEF1FC] text-[#0052CC] flex items-center justify-center mb-5">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div> */}
              <EmptyStateIcon />

          <h2 className="text-[18px] font-bold text-[#0A1629] mb-2">No epics in this project yet.</h2>
          <p className="text-[13px] text-[#7D8592] max-w-sm mb-6">
            Break down your large project into manageable epics to track progress better and maintain architectural clarity.
          </p>
          <Link
            href={`/projects/${projectId}/epics/new`}
            className="inline-flex max-xxs:hidden items-center gap-2 h-11 bg-[#0052CC] hover:bg-[#0040A3] text-white font-bold text-[12px] px-6 rounded-[4px] transition-colors"
          >
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.55 16.2L11.725 10H7.725L8.45 4.325L3.825 11H7.3L6.55 16.2ZM4 20L5 13H0L9 0H11L10 8H16L6 20H4Z" fill="white"/>
            </svg>
           Create First Epic
          </Link>
        </div>
      )}

      {/* Success state */}
      {state === "success" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredEpics.map((epic) => (
              <EpicCard key={epic.id} epic={epic} />
            ))}
          </div>

          {/* Pagination UI only — no logic per spec */}
          <div className="flex items-center justify-center md:justify-end gap-1.5 mt-8">
            <button
              disabled
              className="h-9 w-9 flex items-center justify-center rounded-[4px] border border-[#E2E5EE] text-[#8A94A6] text-[12px] disabled:opacity-60"
            >
              ‹
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-[4px] bg-[#0052CC] text-white text-[12px] font-bold">
              1
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-[4px] border border-[#E2E5EE] text-[#526487] text-[12px]">
              2
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-[4px] border border-[#E2E5EE] text-[#526487] text-[12px]">
              3
            </button>
            <span className="h-9 w-9 flex items-center justify-center text-[#8A94A6] text-[12px]">…</span>
            <button className="h-9 w-9 flex items-center justify-center rounded-[4px] border border-[#E2E5EE] text-[#526487] text-[12px]">
              15
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-[4px] border border-[#E2E5EE] text-[#526487] text-[12px]">
              ›
            </button>
          </div>
        </>
      )}

      {/* Mobile floating "+" button */}
      <Link
        href={`/projects/${projectId}/epics/new`}
        className="xxs:hidden fixed bottom-20 right-5 h-9 w-9 rounded-sm bg-[#0052CC] text-white text-2xl font-bold flex items-center justify-center shadow-[0_4px_12px_rgba(0,82,204,0.35)]"
        aria-label="Create new epic"
      >
        +
      </Link>
    </div>
  );
}