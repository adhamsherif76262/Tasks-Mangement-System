
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface RouteContext {
  params: Promise<{ id: string }>;
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id: projectId } = await context.params;

    if (!UUID_REGEX.test(projectId)) {
      return NextResponse.json(
        { error: "A valid project ID is required." },
        { status: 400 },
      );
    }

    let email: string;

    try {
      const body = await request.json();
      email =
        typeof body?.email === "string"
          ? body.email.trim()
          : "";
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SECRET_KEYS;
    const appUrl = process.env.DEPLOYMENT_URL;

    if (!baseUrl || !anonKey || !appUrl) {
      console.error(
        "Invitation API configuration is missing.",
      );

      return NextResponse.json(
        { error: "Invitation service is not configured." },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();

    const supabase = createServerClient(
      baseUrl,
      anonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              },
            );
          },
        },
      },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "You must be logged in to invite a member." },
        { status: 401 },
      );
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return NextResponse.json(
        { error: "Your session has expired. Please log in again." },
        { status: 401 },
      );
    }

    const rpcUrl =
      `${baseUrl.replace(/\/+$/, "")}/rest/v1/rpc/invite_member`;

    const upstreamResponse = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_email: email,
        p_project_id: projectId,
        p_app_url: appUrl.replace(/\/+$/, ""),
        p_base_url: baseUrl.replace(/\/+$/, ""),
      }),
      cache: "no-store",
    });

    const responseText = await upstreamResponse.text();

    let responseData: unknown = null;

    if (responseText) {
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }
    }

    if (!upstreamResponse.ok) {
      console.error(
        "Invite member RPC failed:",
        upstreamResponse.status,
        responseData,
      );

      const errorMessage =
        typeof responseData === "object" &&
        responseData !== null
          ? (
              responseData as {
                message?: string;
                details?: string;
                hint?: string;
              }
            ).message ||
            (
              responseData as {
                details?: string;
              }
            ).details
          : undefined;

      return NextResponse.json(
        {
          error:
            errorMessage ||
            "Unable to send the invitation. Please try again.",
        },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Invitation sent successfully.",
        data: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Invite member API error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while sending the invitation.",
      },
      { status: 500 },
    );
  }
}
