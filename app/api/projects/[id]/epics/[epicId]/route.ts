import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function getSupabaseServerClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_BASE_URL!,
    process.env.NEXT_PUBLIC_SECRET_KEYS!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
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
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; epicId: string }> },
) {
  try {
    const { id: projectId, epicId } = await params;

    if (!projectId || !epicId) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const sessionToken = (await supabase.auth.getSession()).data.session?.access_token;
    if (!sessionToken) {
      return NextResponse.json({ error: "No active session" }, { status: 401 });
    }

    // Direct targeted table call using query operators
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_epics?project_id=eq.${encodeURIComponent(
        projectId,
      )}&id=eq.${encodeURIComponent(epicId)}`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("❌ SUPABASE GET EPIC DETAILS ERROR:", data);
      return NextResponse.json(
        { error: data?.message || "Failed to fetch epic details" },
        { status: response.status },
      );
    }

    // PostgREST returns arrays for filter queries; pull the single matching epic row
    const epic = Array.isArray(data) ? data[0] : null;

    if (!epic) {
      return NextResponse.json({ error: "Epic not found" }, { status: 404 });
    }

    return NextResponse.json(epic);
  } catch (error) {
    console.error("❌ Epic details proxy error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; epicId: string }> },
) {
  try {
    const { id: projectId, epicId } = await params;

    if (!projectId || !epicId) {
      return NextResponse.json(
        { error: "Project ID and epic ID are required." },
        { status: 400 },
      );
    }

    const body: unknown = await request.json();

    if (
      !body ||
      typeof body !== "object" ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        { error: "A valid update body is required." },
        { status: 400 },
      );
    }

    const input = body as Record<string, unknown>;
    const allowedFields = [
      "title",
      "description",
      "assignee_id",
      "deadline",
    ] as const;

    const updates: Record<string, string | null> = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(input, field)) {
        const value = input[field];

        if (field === "title") {
          if (typeof value !== "string" || !value.trim()) {
            return NextResponse.json(
              { error: "Epic title cannot be empty." },
              { status: 400 },
            );
          }

          updates.title = value.trim();
        } else if (field === "description") {
          if (value !== null && typeof value !== "string") {
            return NextResponse.json(
              { error: "Epic description must be text or null." },
              { status: 400 },
            );
          }

          updates.description =
            typeof value === "string" && value.trim() === ""
              ? null
              : (value as string | null);
        } else if (field === "assignee_id") {
          if (value !== null && typeof value !== "string") {
            return NextResponse.json(
              { error: "Assignee must be a user ID or null." },
              { status: 400 },
            );
          }

          updates.assignee_id = value as string | null;
        } else if (field === "deadline") {
          if (
            value !== null &&
            (typeof value !== "string" ||
              !/^\d{4}-\d{2}-\d{2}$/.test(value))
          ) {
            return NextResponse.json(
              { error: "Deadline must use YYYY-MM-DD or null." },
              { status: 400 },
            );
          }

          updates.deadline = value as string | null;
        }
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No supported fields were provided." },
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
      id: `eq.${epicId}`,
      project_id: `eq.${projectId}`,
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/epics?${query.toString()}`,
      {
        method: "PATCH",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(updates),
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      console.error("Supabase PATCH epic error:", errorData);

      return NextResponse.json(
        {
          error:
            errorData?.message ||
            errorData?.details ||
            "Failed to update epic.",
        },
        { status: response.status },
      );
    }

    // Supabase may return 204 No Content for a successful PATCH.
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Epic PATCH proxy error:", error);

    return NextResponse.json(
      { error: "Failed to update epic. Please try again." },
      { status: 500 },
    );
  }
}