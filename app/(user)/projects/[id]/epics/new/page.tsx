"use client";

import { use, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const epicSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "TITLE IS REQUIRED (MINIMUM 3 CHARACTERS)"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters.")
    .optional(),
  assignee_id: z.string().optional(),
  deadline: z
    .string()
    .optional()
    .refine((dateStr) => {
      if (!dateStr) return true;
      const selectedDate = new Date(dateStr);
      selectedDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, { message: "Deadline cannot be a past date." }),
});

type EpicFormValues = z.infer<typeof epicSchema>;

interface Member {
  id: string; // profile/user ID
  name: string;
  email: string;
}

interface Toast {
  type: "success" | "error";
  message: string;
}

// export default function CreateEpicPage({ params }: { params: Promise<{ projectId: string }> }) {
export default function CreateEpicPage() {
      const params = useParams();
    
  const router = useRouter();
  const projectId = String(
    params.id ?? "",
  );
  const [members, setMembers] = useState<Member[]>([]);
  const [membersState, setMembersState] = useState<"loading" | "success" | "empty" | "error">("loading");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EpicFormValues>({
    resolver: zodResolver(epicSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      assignee_id: "",
      deadline: "",
    },
  });

  const descriptionValue = watch("description") || "";

  // Pull down project members on load
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`/api/projects/project-members?project_id=eq.${projectId}`, { method: "GET" });
        if (!response.ok) throw new Error();
        const result = await response.json();
        const mappedMembers = result.map((m: any) => ({
          id: m.user_id,
          name: m.metadata?.name || "Unknown User",
          email: m.email || ""
        }));

        setMembers(mappedMembers);
        console.log(members)
        setMembersState(mappedMembers.length === 0 ? "empty" : "success");
      } catch (error) {
        setMembersState("error");
      }
    };
    fetchMembers();
  }, [projectId]);

  // Toast timer logic
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const onSubmit = async (data: EpicFormValues) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setToast(null);

    try {
      const response = await fetch(`/api/projects/${projectId}/epics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData?.error || "Failed to create epic.");
      }

      setToast({ type: "success", message: "Epic created successfully" });
      setTimeout(() => {
        router.push(`/projects/${projectId}/epics`);
        router.refresh();
      }, 4000);
    } catch (error: any) {
      setToast({ type: "error", message: error.message || "An error occurred." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F9F9FF] px-4 py-6 md:px-8 md:py-8 font-sans">
      <nav className="hidden max-w-4xl  mx-auto md:block text-[10px] font-bold uppercase tracking-wider text-[#8A94A6] mb-6">
        PROJECTS &gt; PROJECT ALPHA &gt; EPICS &gt; <span className="text-slate-neutral-dark">NEW EPIC</span>
      </nav>

      <div className="max-w-4xl mb-8 mx-auto">
        <h1 className="text-[24px] font-bold text-[#0A1629] leading-8">Create New Epic</h1>
        <p className="text-[12px] md:text-[13px] text-[#7D8592] mt-1.5 max-w-2xl leading-relaxed">
          Define a major project phase or high-level milestone to group related tasks and track architectural progress.
        </p>
      </div>

      <div className="max-w-4xl mx-auto max-sm:mb-10 bg-white rounded-[6px] border border-[#E2E5EE] px-4 py-6 md:p-10 shadow-[0_4px_12px_rgba(4,27,60,0.02)]">
        {toast && (
          <div className={`mb-6 p-4 rounded text-xs font-bold ${toast.type === "success" ? "bg-[#82F9BE]/20 text-[#075B3D]" : "bg-red-50 text-red-600"}`}>
            {toast.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 md:gap-8">

          {/* TITLE FIELD */}
          <div className="flex flex-col md:grid md:grid-cols-[160px_1fr] items-start gap-1 md:gap-4">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#526487] pt-2.5">
              Title <span className="text-red-500">*</span>
            </label>
            <div className="w-full">
              <input
                type="text"
                placeholder="e.g. Structural Foundation Phase"
                disabled={isSubmitting}
                {...register("title")}
                className={`w-full h-11 bg-[#EEF1FC]/50 border rounded-[4px] px-4 text-[12px] text-[#0A1629] outline-none placeholder-[#8D96AA] focus:border-[#0052CC] transition-colors ${errors.title ? "border-red-500" : "border-transparent"}`}
              />
              {errors.title ? (
                <p className="text-[10px] font-bold text-red-500 mt-1.5 uppercase flex items-center gap-1">
                  ⚠ {errors.title.message}
                </p>
              ) : (
                <p className="text-[10px] text-[#8A94A6] mt-1">Minimum 3 characters required.</p>
              )}
            </div>
          </div>

          {/* DESCRIPTION FIELD */}
          <div className="flex flex-col md:grid md:grid-cols-[160px_1fr] items-start gap-1 md:gap-4">
            <div className="pt-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#526487]">Description</label>
              <span className="block text-[9px] text-[#8A94A6] font-medium lowercase">Optional</span>
            </div>
            <div className="w-full relative">
              <textarea
                placeholder="Describe the scope and objectives of this epic..."
                maxLength={500}
                disabled={isSubmitting}
                {...register("description")}
                className="w-full h-28 bg-[#EEF1FC]/50 border border-transparent rounded-[4px] p-4 text-[12px] text-[#0A1629] outline-none placeholder-[#8D96AA] focus:border-[#0052CC] resize-none transition-colors"
              />
              <div className="text-right text-[10px] text-[#8A94A6] mt-1">
                {descriptionValue.length}/500 characters
              </div>
            </div>
          </div>

          {/* ASSIGNEE & DEADLINE */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 md:ml-[160px]"> */}
          <div className="flex max-sm:gap-y-10 max-sm:flex-col max-sm:justify-center max-sm:items-center sm:flex-row sm:justify-between sm:items-center w-full">

            <div className="flex sm:min-w-[48%] max-sm:w-full flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#526487]">Assignee</label>
              <select
                disabled={isSubmitting || membersState === "loading"}
                {...register("assignee_id")}
                className="w-full h-11 bg-[#EEF1FC]/50 border border-transparent rounded-[4px] px-3 text-[12px] text-[#0A1629] outline-none focus:border-[#0052CC] appearance-none cursor-pointer transition-colors"
              >
                <option value="">Select a member...</option>
                {membersState === "success" && members.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
                {membersState === "loading" && <option disabled>Loading project members...</option>}
                {membersState === "error" && <option disabled>Failed to load members</option>}
              </select>
            </div>

            <div className="flex sm:min-w-[48%] max-sm:w-full flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#526487]">Deadline</label>
              <input
                type="date"
                disabled={isSubmitting}
                {...register("deadline")}
                className={`w-full h-11 bg-[#EEF1FC]/50 border rounded-[4px] px-4 text-[12px] text-[#0A1629] outline-none focus:border-[#0052CC] transition-colors ${errors.deadline ? "border-red-500" : "border-transparent"}`}
              />
              {errors.deadline && (
                <p className="text-[10px] text-red-500 mt-1">{errors.deadline.message}</p>
              )}
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-4 mt-4 border-t border-[#F0F1F6] pt-6">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => router.push(`/projects/${projectId}/epics`)}
              className="w-full md:w-auto h-10 px-6 text-[12px] font-bold text-[#526487] hover:text-[#0A1629] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto h-10 bg-[#0052CC] hover:bg-[#0040A3] disabled:opacity-75 disabled:cursor-not-allowed text-white font-bold text-[12px] px-8 rounded-[4px] shadow-[0_2px_6px_rgba(0,82,204,0.15)] transition-colors"
            >
              {isSubmitting ? "Creating Epic..." : "Create Epic"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}