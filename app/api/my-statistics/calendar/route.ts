
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

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function getInclusiveDays(start: string, end: string) {
  const startTime = Date.parse(`${start}T00:00:00.000Z`);
  const endTime = Date.parse(`${end}T00:00:00.000Z`);

  return Math.floor((endTime - startTime) / 86_400_000) + 1;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const {
      p_start_date,
      p_end_date,
      p_project_id = null,
      p_status = null,
    } = body ?? {};

    if (!isValidDate(p_start_date) || !isValidDate(p_end_date)) {
      return NextResponse.json(
        { error: "Valid start and end dates are required in YYYY-MM-DD format." },
        { status: 400 },
      );
    }

    const days = getInclusiveDays(p_start_date, p_end_date);

    if (days < 1 || days > 7) {
      return NextResponse.json(
        { error: "The selected date range must contain between 1 and 7 calendar days." },
        { status: 400 },
      );
    }

    if (p_project_id !== null && typeof p_project_id !== "string") {
      return NextResponse.json(
        { error: "The project filter must be a project UUID or null." },
        { status: 400 },
      );
    }

    if (
      p_status !== null &&
      !(TASK_STATUSES as readonly string[]).includes(p_status)
    ) {
      return NextResponse.json(
        { error: "The selected task status is invalid." },
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
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return NextResponse.json(
        { error: "No active session." },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/rpc/get_tasks_calendar_stats`,
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_start_date,
          p_end_date,
          p_project_id,
          p_status,
        }),
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("Calendar statistics RPC error:", data);

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            "Failed to fetch calendar statistics.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Calendar statistics proxy error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
