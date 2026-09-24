"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEYS;

const projectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Project title must be at least 3 characters.")
    .max(100, "Project title must not exceed 100 characters."),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters.")
    .optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface AuthSession {
  access_token: string;
}

type ToastType = "success" | "error";

interface Toast {
  type: ToastType;
  message: string;
}

export default function AddProjectPage() {
  const router = useRouter();

  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const descriptionValue = watch("description") ?? "";

  // 1. Standard toast dismissal timer hook (Left unchanged)
  useEffect(() => {
    if (!toast) return;

    const timeout = window.setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  // 2. Updated Project Creation Handler
  const handleCreateProject = async (data: ProjectFormValues) => {
    if (isSubmittingProject) return;

    setIsSubmittingProject(true);

    try {
      // 🔒 Route creation directly through your local secure proxy endpoint
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          router.replace("/login");
          return;
        }
        throw new Error(responseData?.error || "Creation rejected.");
      }

      // Reset form controls on success
      reset({
        name: "",
        description: "",
      });

      setToast({
        type: "success",
        message: "Project created successfully",
      });

      // Clear layout routing state caches and bounce back to dashboard list
      setTimeout(() => {
        router.push("/projects");
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Create project action execution failure:", error);
      setToast({
        type: "error",
        message: "Failed To Add New Project, Try Again Later",
      });
    } finally {
      setIsSubmittingProject(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#F9F9FF]">
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 px-7 py-5 max-md:px-5 max-xxs:px-4">
          <div className="mb-2 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] hidden xxs:flex">
            <span className="text-[#8B91A3] hover:cursor-pointer" onClick={()=> router.push("/projects")}>Projects</span>

            <span className="text-[#8B91A3]">›</span>

            <span className="text-primary">Add New Project</span>
          </div>

          <h1 className="hidden xxs:flex text-[30px] font-bold leading-tight tracking-[-0.02em] text-slate-neutral-dark max-md:text-[25px] max-xxs:text-[22px]">
            Add New Project
          </h1>

          <div className="mx-auto mt-8 w-full max-w-138.5 overflow-hidden rounded-lg bg-white max-md:mt-7 max-md:max-w-none max-md:bg-transparent">
            <div className="flex items-center gap-3 border-b border-[#EEF0F6] px-6 py-7 max-md:px-0 max-md:py-0 max-md:pb-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#E5EEFF] text-primary">
                <ProjectCreateIcon />
              </div>

              <div className="min-w-0">
                <h2 className="text-[21px] font-bold leading-6 text-slate-neutral-dark max-md:text-[20px]">
                  Initialize New Project
                </h2>

                <p className="mt-0.5 text-[12px] leading-4 text-slate-neutral-medium">
                  Define the scope and foundational details of your project.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleSubmit(handleCreateProject)}
              noValidate
              className="px-6 py-7 max-md:px-0 max-md:py-0"
            >
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="project-title"
                    className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#526487]"
                  >
                    Project Title <span className="text-semantic-error">*</span>
                  </label>
                </div>

                <input
                  id="project-title"
                  type="text"
                  maxLength={100}
                  autoComplete="off"
                  placeholder=""
                  {...register("name")}
                  className={`h-11 w-full rounded-[4px] border bg-[#D5E1FB] px-4 text-[14px] text-slate-neutral-dark outline-none transition-colors placeholder:text-[#94A5C8] focus:border-primary ${
                    errors.name
                      ? "border-transparent"
                      : "border-transparent"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1.5 flex items-center gap-1 text-[10px] leading-4 text-semantic-error">
                    <ErrorIcon />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="mt-7">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="project-description"
                    className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#526487]"
                  >
                    Description
                  </label>

                  <span className="text-[9px] text-[#98A2B8]">Optional</span>
                </div>

                <textarea
                  id="project-description"
                  maxLength={500}
                  rows={5}
                  placeholder="Provide a high-level overview of the project's architectural objectives and key milestones..."
                  {...register("description")}
                  className="min-h-30 w-full resize-none rounded-[4px] border border-transparent bg-[#D5E1FB] px-4 py-3.5 text-[14px] leading-5 text-slate-neutral-dark outline-none transition-colors placeholder:text-[#94A5C8] focus:border-primary"
                />

                <div className="mt-1 flex justify-end">
                  <span className="text-[9px] text-slate-neutral-medium">
                    {descriptionValue.length} / 500 characters
                  </span>
                </div>

                {errors.description && (
                  <p className="mt-1 text-right text-[10px] text-semantic-error">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {toast?.type === "error" && (
                <p className="mt-4 text-center text-[10px] text-semantic-error">
                  {toast.message}
                </p>
              )}

              <div className="mt-10 flex items-center justify-between max-md:flex-col-reverse max-md:gap-5">
                <button
                  type="button"
                  onClick={() => router.back()}
                  disabled={isSubmittingProject}
                  className="text-[12px] font-bold text-[#526487] transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingProject}
                  className="flex h-9.5 w-33.5 items-center justify-center rounded-[4px] bg-[#0052CC] px-5 text-[12px] font-bold text-white shadow-[0px_4px_10px_rgba(0,61,155,0.22)] transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-70 max-md:h-11 max-md:w-full"
                >
                  {isSubmittingProject ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>

            <div className="flex items-start gap-2 bg-[#F0F3FF] px-6 py-5 text-[9px] leading-4 text-[#526487] max-sm:mb-14 max-md:mt-6 max-md:rounded-md max-md:px-5">
              <TipIcon />

              <p>
                <span className="font-bold">Pro Tip:</span>{" "}
                You can invite project members and assign epics immediately
                after the initial creation process.
              </p>
            </div>
          </div>
        </main>
      </div>

      {toast?.type === "success" && (
        <div className="fixed right-6 top-6 z-100 rounded-md bg-[#0E8A55] px-5 py-3 text-[12px] font-semibold text-white shadow-lg max-md:left-4 max-md:right-4 max-md:top-4 max-md:text-center">
          {toast.message}
        </div>
      )}
    </div>
  );
}

function ProjectCreateIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="7.5"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M12 8V16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M8 12H16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M17.5 4.5L19 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M18 18L20 20"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
      />

      <path
        d="M12 7V13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TipIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="mt-0.5 shrink-0"
    >
      <path
        d="M9 18H15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M10 21H14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M8.5 14.5C7.55 13.62 7 12.39 7 11C7 8.24 9.24 6 12 6C14.76 6 17 8.24 17 11C17 12.39 16.45 13.62 15.5 14.5C14.67 15.27 14 16.03 14 17H10C10 16.03 9.33 15.27 8.5 14.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}