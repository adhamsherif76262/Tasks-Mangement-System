import React from "react";

interface EpicDetailFieldProps {
  label: string;
  icon?: React.ReactNode;
  avatarUrl?: string;
  avatarFallback?: string;
  value: string;
  isInteractive?: boolean;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function EpicDetailField({
  label,
  icon,
  avatarUrl,
  avatarFallback,
  value,
  isInteractive = false,
}: EpicDetailFieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center justify-between w-full h-11 px-3 border border-slate-100 rounded-lg bg-white/50 text-sm text-slate-700">
        <div className="flex items-center gap-2 overflow-hidden">
          {avatarUrl || avatarFallback ? (
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-[10px] font-semibold text-blue-600 shrink-0 border border-blue-100">
              {avatarUrl ? (
                getInitials(avatarUrl)
                // <img src={avatarUrl} alt={value} className="w-full h-full rounded-full object-cover" />
              ) : (
                avatarFallback
              )}
            </div>
          ) : null}
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className="font-medium truncate">{value}</span>
        </div>
        {isInteractive && (
          <svg className="w-4 h-4 text-slate-400 ml-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
    </div>
  );
}
