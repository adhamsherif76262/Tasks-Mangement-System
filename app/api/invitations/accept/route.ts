
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    let token: string;

    try {
      const body = await request.json();

      token =
        typeof body?.token === "string"
          ? body.token.trim()
          : "";
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 },
      );
    }

    if (!token) {
      return NextResponse.json(
        { error: "This invitation link is invalid." },
        { status: 400 },
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SECRET_KEYS;

    if (!baseUrl || !anonKey) {
      console.error(
        "Invitation acceptance API configuration is missing.",
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
        {
          error: "You need to log in to accept this invitation.",
        },
        { status: 401 },
      );
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      return NextResponse.json(
        {
          error: "Your session has expired. Please log in again.",
        },
        { status: 401 },
      );
    }

    const rpcUrl =
      `${baseUrl.replace(/\/+$/, "")}/rest/v1/rpc/accept_invitation`;

    const upstreamResponse = await fetch(rpcUrl, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_token: token,
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
        "Accept invitation RPC failed:",
        upstreamResponse.status,
        responseData,
      );

      const backendMessage =
        typeof responseData === "object" &&
        responseData !== null &&
        "message" in responseData &&
        typeof responseData.message === "string"
          ? responseData.message
          : typeof responseData === "object" &&
              responseData !== null &&
              "error" in responseData &&
              typeof responseData.error === "string"
            ? responseData.error
            : undefined;

      return NextResponse.json(
        {
          error:
            backendMessage ||
            "Something went wrong while accepting the invitation. Please try again.",
          data: responseData,
        },
        { status: upstreamResponse.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Invitation accepted successfully.",
        data: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Accept invitation API error:", error);

    return NextResponse.json(
      {
        error:
          "Something went wrong while accepting the invitation. Please try again.",
      },
      { status: 500 },
    );
  }
}
