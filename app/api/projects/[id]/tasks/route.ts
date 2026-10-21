import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TASK_STATUSES = [
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
] as const;

type TaskStatus = (typeof TASK_STATUSES)[number];

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => null);

    if (!body || typeof body.title !== "string" || !body.title.trim()) {
      return NextResponse.json(
        { error: "Task title is required." },
        { status: 400 },
      );
    }

    const status: TaskStatus = body.status ?? "TO_DO";

    if (!TASK_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid task status." },
        { status: 400 },
      );
    }

    const title = body.title.trim();

    if (
      body.description != null &&
      typeof body.description !== "string"
    ) {
      return NextResponse.json(
        { error: "Invalid task description." },
        { status: 400 },
      );
    }

    const optionalIdIsValid = (value: unknown) =>
      value === undefined ||
      value === null ||
      (typeof value === "string" && value.trim().length > 0);

    if (
      !optionalIdIsValid(body.epic_id) ||
      !optionalIdIsValid(body.assignee_id)
    ) {
      return NextResponse.json(
        { error: "Epic and assignee IDs must be valid." },
        { status: 400 },
      );
    }

    let dueDate: string | undefined;

    if (body.due_date !== undefined && body.due_date !== null) {
      if (
        typeof body.due_date !== "string" ||
        !body.due_date.trim() ||
        !Number.isFinite(Date.parse(body.due_date))
      ) {
        return NextResponse.json(
          { error: "Invalid due date." },
          { status: 400 },
        );
      }

      dueDate = new Date(body.due_date).toISOString();
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_BASE_URL!,
      process.env.NEXT_PUBLIC_SECRET_KEYS!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              });
            });
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const sessionToken = (
      await supabase.auth.getSession()
    ).data.session?.access_token;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No active session." },
        { status: 401 },
      );
    }

    const payload: {
      project_id: string;
      title: string;
      status: TaskStatus;
      epic_id?: string;
      description?: string;
      assignee_id?: string;
      due_date?: string;
    } = {
      project_id: projectId,
      title,
      status,
    };

    if (typeof body.epic_id === "string" && body.epic_id.trim()) {
      payload.epic_id = body.epic_id.trim();
    }

    if (
      typeof body.description === "string" &&
      body.description.trim()
    ) {
      payload.description = body.description.trim();
    }

    if (
      typeof body.assignee_id === "string" &&
      body.assignee_id.trim()
    ) {
      payload.assignee_id = body.assignee_id.trim();
    }

    if (dueDate) {
      payload.due_date = dueDate;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/tasks`,
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Supabase create task error:", data);

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            "Failed to create task. Please try again.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      { success: true, data },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create task proxy error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while creating the task." },
      { status: 500 },
    );
  }
}

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const { id: projectId } = await params;
//     const { searchParams } = new URL(request.url);

//     const status = searchParams.get("status");
//     const rawLimit = searchParams.get("limit");
//     const rawOffset = searchParams.get("offset");

//     // Defaults maintain compatibility with existing callers
//     // while the frontend pagination hook is being updated.
//     const limit = rawLimit === null ? 10 : Number(rawLimit);
//     const offset = rawOffset === null ? 0 : Number(rawOffset);

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Project ID is required." },
//         { status: 400 },
//       );
//     }

//     if (
//       !Number.isSafeInteger(limit) ||
//       limit < 1 ||
//       limit > 100 ||
//       !Number.isSafeInteger(offset) ||
//       offset < 0
//     ) {
//       return NextResponse.json(
//         { error: "Invalid pagination parameters." },
//         { status: 400 },
//       );
//     }

//     if (
//       status !== null &&
//       !TASK_STATUSES.includes(status as TaskStatus)
//     ) {
//       return NextResponse.json(
//         { error: "Invalid task status." },
//         { status: 400 },
//       );
//     }

//     const cookieStore = await cookies();

//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_BASE_URL!,
//       process.env.NEXT_PUBLIC_SECRET_KEYS!,
//       {
//         cookies: {
//           getAll() {
//             return cookieStore.getAll();
//           },
//           setAll(cookiesToSet) {
//             cookiesToSet.forEach(({ name, value, options }) => {
//               cookieStore.set(name, value, {
//                 ...options,
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === "production",
//                 sameSite: "lax",
//               });
//             });
//           },
//         },
//       },
//     );

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json(
//         { error: "Unauthorized access." },
//         { status: 401 },
//       );
//     }

//     const sessionToken = (
//       await supabase.auth.getSession()
//     ).data.session?.access_token;

//     if (!sessionToken) {
//       return NextResponse.json(
//         { error: "No active session." },
//         { status: 401 },
//       );
//     }

//     const query = new URLSearchParams({
//       select: "*",
//       project_id: `eq.${projectId}`,
//       limit: String(limit),
//       offset: String(offset),
//       order: "created_at.desc,id.asc",
//     });

//     // Desktop: fetch a particular status column.
//     // Mobile: omit status to fetch tasks across all statuses.
//     if (status !== null) {
//       query.set("status", `eq.${status}`);
//     }

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_tasks?${query.toString()}`,
//       {
//         method: "GET",
//         headers: {
//           apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
//           Authorization: `Bearer ${sessionToken}`,
//           "Content-Type": "application/json",
//           Prefer: "count=exact",
//         },
//         cache: "no-store",
//       },
//     );

//     const data = await response.json().catch(() => null);

//     if (!response.ok) {
//       console.error("Supabase GET project tasks error:", data);

//       return NextResponse.json(
//         {
//           error:
//             data?.message ||
//             data?.details ||
//             "Failed to fetch project tasks.",
//         },
//         { status: response.status },
//       );
//     }

//     if (!Array.isArray(data)) {
//       return NextResponse.json(
//         { error: "Invalid response received while fetching tasks." },
//         { status: 502 },
//       );
//     }

//     // Preserve the backend's pagination metadata for the frontend.
//     const contentRange = response.headers.get("content-range");
//     const headers = new Headers();

//     if (contentRange) {
//       headers.set("Content-Range", contentRange);
//     }

//     return NextResponse.json(data, { headers });
//   } catch (error) {
//     console.error("Project tasks GET proxy error:", error);

//     return NextResponse.json(
//       { error: "Failed to fetch project tasks." },
//       { status: 500 },
//     );
//   }
// }



export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const rawTitle = searchParams.get("title");
    const title = rawTitle?.trim() ?? "";

    const rawLimit = searchParams.get("limit");
    const rawOffset = searchParams.get("offset");

    // Preserve compatibility with existing callers.
    const limit = rawLimit === null ? 10 : Number(rawLimit);
    const offset = rawOffset === null ? 0 : Number(rawOffset);

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required." },
        { status: 400 },
      );
    }

    if (
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > 100 ||
      !Number.isSafeInteger(offset) ||
      offset < 0
    ) {
      return NextResponse.json(
        { error: "Invalid pagination parameters." },
        { status: 400 },
      );
    }

    if (
      status !== null &&
      !TASK_STATUSES.includes(status as TaskStatus)
    ) {
      return NextResponse.json(
        { error: "Invalid task status." },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_BASE_URL!,
      process.env.NEXT_PUBLIC_SECRET_KEYS!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              });
            });
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const sessionToken = (
      await supabase.auth.getSession()
    ).data.session?.access_token;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No active session." },
        { status: 401 },
      );
    }

    const query = new URLSearchParams({
      select: "*",
      project_id: `eq.${projectId}`,
      limit: String(limit),
      offset: String(offset),
      order: "created_at.desc,id.asc",
    });

    // Keep board columns scoped to their individual statuses.
    // Mobile can omit status to search across all statuses.
    if (status !== null) {
      query.set("status", `eq.${status}`);
    }

    // Search the title using case-insensitive, partial matching.
    // URLSearchParams encodes the percent signs in the ilike pattern.
    // An empty or whitespace-only title intentionally adds no filter.
    if (title) {
      // query.set("title", `ilike.%${title}%`);
      const escapedTitle = title.replace(/[\\%_*]/g, "\\$&");
      query.set("title", `ilike.%${escapedTitle}%`);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_tasks?${query.toString()}`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Supabase GET project tasks error:", data);

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            "Failed to fetch project tasks.",
        },
        { status: response.status },
      );
    }

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid response received while fetching tasks." },
        { status: 502 },
      );
    }

    // Preserve the exact count supplied by PostgREST.
    const contentRange = response.headers.get("content-range");
    const headers = new Headers();

    if (contentRange) {
      headers.set("Content-Range", contentRange);
    }

    return NextResponse.json(data, { headers });
  } catch (error) {
    console.error("Project tasks GET proxy error:", error);

    return NextResponse.json(
      { error: "Failed to fetch project tasks." },
      { status: 500 },
    );
  }
}

