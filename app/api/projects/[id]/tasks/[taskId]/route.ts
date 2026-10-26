// import { createServerClient } from "@supabase/ssr";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// interface RouteContext {
//   params: Promise<{
//     id: string;
//     taskId: string;
//   }>;
// }



// const TASK_STATUSES = [
//   "TO_DO",
//   "IN_PROGRESS",
//   "BLOCKED",
//   "IN_REVIEW",
//   "READY_FOR_QA",
//   "REOPENED",
//   "READY_FOR_PRODUCTION",
//   "DONE",
// ] as const;

// export async function PATCH(
//   request: Request,
//   { params }: {
//     params: Promise<{ id: string; taskId: string }>;
//   }
// ) {
//   try {
//     const { id: projectId, taskId } = await params;

//     let body: { status?: unknown };

//     try {
//       body = await request.json();
//     } catch {
//       return NextResponse.json(
//         { error: "Invalid JSON request body" },
//         { status: 400 }
//       );
//     }

//     if (
//       typeof body.status !== "string" ||
//       !TASK_STATUSES.includes(
//         body.status as (typeof TASK_STATUSES)[number]
//       )
//     ) {
//       return NextResponse.json(
//         { error: "Invalid task status" },
//         { status: 400 }
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
//             try {
//               cookiesToSet.forEach(({ name, value, options }) => {
//                 cookieStore.set(name, value, {
//                   ...options,
//                   httpOnly: true,
//                   secure: process.env.NODE_ENV === "production",
//                   sameSite: "lax",
//                 });
//               });
//             } catch {
//               // Cookie writes may not be available in every context.
//             }
//           },
//         },
//       }
//     );

//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       return NextResponse.json(
//         { error: "Unauthorized access" },
//         { status: 401 }
//       );
//     }

//     const {
//       data: { session },
//       error: sessionError,
//     } = await supabase.auth.getSession();

//     if (sessionError || !session?.access_token) {
//       return NextResponse.json(
//         { error: "No active session" },
//         { status: 401 }
//       );
//     }

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//     const apiKey = process.env.NEXT_PUBLIC_SECRET_KEYS;

//     if (!baseUrl || !apiKey) {
//       return NextResponse.json(
//         { error: "Server configuration is missing" },
//         { status: 500 }
//       );
//     }

//     const url = new URL(`${baseUrl}/rest/v1/tasks`);
//     url.searchParams.set("id", `eq.${taskId}`);
//     url.searchParams.set("project_id", `eq.${projectId}`);

//     const response = await fetch(url.toString(), {
//       method: "PATCH",
//       headers: {
//         apikey: apiKey,
//         Authorization: `Bearer ${session.access_token}`,
//         "Content-Type": "application/json",
//         Prefer: "return=representation",
//       },
//       body: JSON.stringify({ status: body.status }),
//       cache: "no-store",
//     });

//     const responseText = await response.text();

//     if (!response.ok) {
//       console.error(
//         "Failed to update task status:",
//         response.status,
//         responseText
//       );

//       return NextResponse.json(
//         {
//           error: "Failed to update task status",
//           details: responseText || response.statusText,
//         },
//         { status: response.status }
//       );
//     }

//     let updatedTasks: unknown;

//     try {
//       updatedTasks = JSON.parse(responseText);
//     } catch {
//       return NextResponse.json(
//         { error: "Invalid response from tasks API" },
//         { status: 502 }
//       );
//     }

//     if (!Array.isArray(updatedTasks) || updatedTasks.length === 0) {
//       return NextResponse.json(
//         { error: "Task not found in this project" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       data: updatedTasks[0],
//     });
//   } catch (error) {
//     console.error("PATCH task status error:", error);

//     return NextResponse.json(
//       { error: "An unexpected error occurred while updating the task" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(
//   _request: Request,
//   { params }: RouteContext
// ) {
//   try {
//     const { id: projectId, taskId } = await params;

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
//             try {
//               cookiesToSet.forEach(
//                 ({ name, value, options }) => {
//                   cookieStore.set(name, value, {
//                     ...options,
//                     httpOnly: true,
//                     secure: process.env.NODE_ENV === "production",
//                     sameSite: "lax",
//                   });
//                 }
//               );
//             } catch {
//               // Cookies cannot be modified in every Server Component context.
//             }
//           },
//         },
//       }
//     );

//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       return NextResponse.json(
//         { error: "Unauthorized access" },
//         { status: 401 }
//       );
//     }

//     const {
//       data: { session },
//       error: sessionError,
//     } = await supabase.auth.getSession();

//     if (sessionError || !session?.access_token) {
//       return NextResponse.json(
//         { error: "No active session" },
//         { status: 401 }
//       );
//     }

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//     const apiKey = process.env.NEXT_PUBLIC_SECRET_KEYS;

//     if (!baseUrl || !apiKey) {
//       return NextResponse.json(
//         { error: "Server configuration is missing" },
//         { status: 500 }
//       );
//     }

//     const url = new URL(`${baseUrl}/rest/v1/project_tasks`);

//     url.searchParams.set("select", "*");
//     url.searchParams.set("id", `eq.${taskId}`);
//     url.searchParams.set("project_id", `eq.${projectId}`);

//     const response = await fetch(url.toString(), {
//       method: "GET",
//       headers: {
//         apikey: apiKey,
//         Authorization: `Bearer ${session.access_token}`,
//         "Content-Type": "application/json",
//       },
//       cache: "no-store",
//     });

//     const responseText = await response.text();

//     if (!response.ok) {
//       return NextResponse.json(
//         {
//           error: "Failed to fetch task details",
//           details: responseText || response.statusText,
//         },
//         { status: response.status }
//       );
//     }

//     let data: unknown;

//     try {
//       data = JSON.parse(responseText);
//     } catch {
//       return NextResponse.json(
//         { error: "The tasks API returned invalid JSON" },
//         { status: 502 }
//       );
//     }

//     if (!Array.isArray(data)) {
//       return NextResponse.json(
//         { error: "Unexpected task response format" },
//         { status: 502 }
//       );
//     }

//     if (data.length === 0) {
//       return NextResponse.json(
//         { error: "Task not found in this project" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(data);
//   } catch (error) {
//     console.error("GET task details error:", error);

//     return NextResponse.json(
//       { error: "An unexpected error occurred while fetching task details" },
//       { status: 500 }
//     );
//   }
// }




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

const TASK_FIELDS = [
  "title",
  "description",
  "assignee_id",
  "due_date",
  "epic_id",
  "status",
] as const;

type TaskField = (typeof TASK_FIELDS)[number];
type TaskUpdates = Partial<
  Record<TaskField, string | null>
>;

interface RouteContext {
  params: Promise<{
    id: string;
    taskId: string;
  }>;
}

async function getAuthenticatedContext() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const apiKey = process.env.NEXT_PUBLIC_SECRET_KEYS;

  if (!baseUrl || !apiKey) {
    return {
      error: NextResponse.json(
        { error: "Server configuration is missing" },
        { status: 500 },
      ),
    };
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    baseUrl,
    apiKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
              });
            });
          } catch {
            // Cookie writes may not be available in every context.
          }
        },
      },
    },
  );

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      ),
    };
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    return {
      error: NextResponse.json(
        { error: "No active session" },
        { status: 401 },
      ),
    };
  }

  return {
    baseUrl,
    apiKey,
    accessToken: session.access_token,
  };
}

function isValidCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function validateUpdates(
  input: unknown,
): { updates: TaskUpdates } | { error: string } {
  if (
    !input ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return { error: "A valid update body is required." };
  }

  const body = input as Record<string, unknown>;
  const updates: TaskUpdates = {};
  const suppliedFields = Object.keys(body);

  if (suppliedFields.length === 0) {
    return { error: "No fields were provided to update." };
  }

  for (const field of suppliedFields) {
    if (!TASK_FIELDS.includes(field as TaskField)) {
      return { error: `Unsupported task field: ${field}` };
    }
  }

  for (const field of TASK_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(body, field)) {
      continue;
    }

    const value = body[field];

    switch (field) {
      case "title": {
        if (typeof value !== "string" || !value.trim()) {
          return {
            error: "Task title cannot be empty.",
          };
        }

        updates.title = value.trim();
        break;
      }

      case "description": {
        if (value !== null && typeof value !== "string") {
          return {
            error: "Task description must be text or null.",
          };
        }

        updates.description =
          typeof value === "string"
            ? value.trim() || null
            : null;
        break;
      }

      case "assignee_id":
      case "epic_id": {
        if (value !== null && typeof value !== "string") {
          return {
            error: `${field} must be an ID or null.`,
          };
        }

        // Empty strings are treated as an explicit clear.
        updates[field] =
          typeof value === "string"
            ? value.trim() || null
            : null;
        break;
      }

      case "due_date": {
        if (value === null) {
          updates.due_date = null;
          break;
        }

        if (
          typeof value !== "string" ||
          !isValidCalendarDate(value)
        ) {
          return {
            error: "Due date must be a valid YYYY-MM-DD date or null.",
          };
        }

        updates.due_date = value;
        break;
      }

      case "status": {
        if (
          typeof value !== "string" ||
          !TASK_STATUSES.includes(
            value as (typeof TASK_STATUSES)[number],
          )
        ) {
          return { error: "Invalid task status." };
        }

        updates.status = value;
        break;
      }
    }
  }

  if (Object.keys(updates).length === 0) {
    return { error: "No supported fields were provided." };
  }

  return { updates };
}

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  try {
    const { id: projectId, taskId } = await params;

    if (!projectId || !taskId) {
      return NextResponse.json(
        { error: "Project ID and task ID are required." },
        { status: 400 },
      );
    }

    const auth = await getAuthenticatedContext();

    if ("error" in auth) {
      return auth.error;
    }

    const url = new URL(
      `${auth.baseUrl}/rest/v1/project_tasks`,
    );

    url.searchParams.set("select", "*");
    url.searchParams.set("id", `eq.${taskId}`);
    url.searchParams.set("project_id", `eq.${projectId}`);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        apikey: auth.apiKey,
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Failed to fetch task details:",
        response.status,
        responseText,
      );

      return NextResponse.json(
        {
          error: "Failed to fetch task details",
          details: responseText || response.statusText,
        },
        { status: response.status },
      );
    }

    let data: unknown;

    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "The tasks API returned invalid JSON" },
        { status: 502 },
      );
    }

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Unexpected task response format" },
        { status: 502 },
      );
    }

    if (data.length === 0) {
      return NextResponse.json(
        { error: "Task not found in this project" },
        { status: 404 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET task details error:", error);

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while fetching the task",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  try {
    const { id: projectId, taskId } = await params;

    if (!projectId || !taskId) {
      return NextResponse.json(
        { error: "Project ID and task ID are required." },
        { status: 400 },
      );
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request body." },
        { status: 400 },
      );
    }

    const validation = validateUpdates(body);

    if ("error" in validation) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 },
      );
    }

    const auth = await getAuthenticatedContext();

    if ("error" in auth) {
      return auth.error;
    }

    const url = new URL(`${auth.baseUrl}/rest/v1/tasks`);

    url.searchParams.set("id", `eq.${taskId}`);
    url.searchParams.set("project_id", `eq.${projectId}`);

    const response = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        apikey: auth.apiKey,
        Authorization: `Bearer ${auth.accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      // Only supplied fields are sent. Explicit nulls are preserved.
      body: JSON.stringify(validation.updates),
      cache: "no-store",
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error(
        "Failed to update task:",
        response.status,
        responseText,
      );

      return NextResponse.json(
        {
          error: "Failed to update task",
          details: responseText || response.statusText,
        },
        { status: response.status },
      );
    }

    let updatedTasks: unknown;

    try {
      updatedTasks = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { error: "Invalid response from tasks API" },
        { status: 502 },
      );
    }

    if (
      !Array.isArray(updatedTasks) ||
      updatedTasks.length === 0
    ) {
      return NextResponse.json(
        { error: "Task not found in this project" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTasks[0],
    });
  } catch (error) {
    console.error("PATCH task error:", error);

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while updating the task",
      },
      { status: 500 },
    );
  }
}
