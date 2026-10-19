
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string; taskId: string }>;
  },
) {
  try {
    const { id: projectId, taskId } = await params;

    if (!projectId || !taskId) {
      return NextResponse.json(
        { error: "Project ID and task ID are required." },
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
      id: `eq.${taskId}`,
    });
    const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_tasks?${query.toString()}`,
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);
    console.log(query.toString())

    if (!response.ok) {
      console.error("Supabase GET task details error:", data);

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            "Failed to load task details.",
        },
        { status: response.status },
      );
    }

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Invalid task response from the server." },
        { status: 502 },
      );
    }

    // An empty array is valid; the frontend displays "Task not found".
    return NextResponse.json(data);
  } catch (error) {
    console.error("Task details proxy error:", error);

    return NextResponse.json(
      { error: "Failed to load task details." },
      { status: 500 },
    );
  }
}
