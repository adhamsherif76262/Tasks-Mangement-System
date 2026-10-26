import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string; epicId: string }> },
) {
  try {
    const { epicId } = await params;

    if (!epicId) {
      return NextResponse.json(
        { error: "Epic ID is required." },
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
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 },
      );
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return NextResponse.json(
        { error: "No active session." },
        { status: 401 },
      );
    }

    const query = new URLSearchParams({
      epic_id: `eq.${epicId}`,
      select: "id,project_id,epic_id,title,description,status,created_at,due_date,task_id,epic,created_by,assignee",
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_tasks?${query.toString()}`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Failed to fetch epic tasks:", data);

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            "Failed to fetch tasks for this epic.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Epic tasks proxy error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}