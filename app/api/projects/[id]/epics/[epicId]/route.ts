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
