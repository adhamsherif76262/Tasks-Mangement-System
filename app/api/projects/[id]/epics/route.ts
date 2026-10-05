// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { NextResponse } from 'next/server';

// async function getSupabaseServerClient() {
//   const cookieStore = await cookies();
//   return createServerClient(
//     process.env.NEXT_PUBLIC_BASE_URL!,
//     process.env.NEXT_PUBLIC_SECRET_KEYS!,
//     {
//       cookies: {
//         getAll() { return cookieStore.getAll(); },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             cookieStore.set(name, value, {
//               ...options,
//               httpOnly: true,
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'lax',
//             })
//           );
//         },
//       },
//     }
//   );
// }



// // 1. GET: Fetch current project members for the Assignee dropdown
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//         const { searchParams } = new URL(request.url);

//     const projectId =
//       searchParams.get("project_id");
//     // const { id: projectId } = await params;
//     const supabase = await getSupabaseServerClient();

//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
//     }

//     const sessionToken = (await supabase.auth.getSession()).data.session?.access_token;

//     // Fetch members belonging to this specific project from your database
//     const response = await fetch(
//     //   `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_members?project_id=26b13df2-ad1c-4642-bec1-e611ced071f0&select=*,profiles(*)`,
//       `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_members?project_id=${projectId}&select=*,profiles(*)`,
//       {
//         method: "GET",
//         headers: {
//           apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
//           Authorization: `Bearer ${sessionToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     if (!response.ok) {
//       return NextResponse.json({ error: 'Failed to retrieve project members' }, { status: response.status });
//     }

//     const data = await response.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Project members fetch proxy error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// // 2. POST: Create a brand new Epic entry
// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id: projectId } = await params;
//     const body = await request.json();
//     const supabase = await getSupabaseServerClient();

//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
//     }

//     const sessionToken = (await supabase.auth.getSession()).data.session?.access_token;

//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/epics`, {
//       method: "POST",
//       headers: {
//         apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
//         Authorization: `Bearer ${sessionToken}`,
//         "Content-Type": "application/json",
//         "Prefer": "return=representation"
//       },
//       body: JSON.stringify({
//         title: body.title.trim(),
//         description: body.description?.trim() || null,
//         assignee_id: body.assignee_id || null,
//         project_id: projectId,
//         deadline: body.deadline || null,
//       }),
//     });

//     if (!response.ok) {
//       const errPayload = await response.json().catch(() => null);
//       return NextResponse.json({ error: errPayload?.message || 'Failed to create epic record' }, { status: response.status });
//     }

//     const data = await response.json();
//     return NextResponse.json({ success: true, data }, { status: 201 });
//   } catch (error) {
//     console.error('Epic proxy creation error:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);

//     const projectId = searchParams.get("project_id");
//     const limit = searchParams.get("limit") ?? "10";
//     const offset = searchParams.get("offset") ?? "0";

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Project ID is required" },
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
//         { error: "Unauthorized access" },
//         { status: 401 },
//       );
//     }

//     const sessionToken = (
//       await supabase.auth.getSession()
//     ).data.session?.access_token;

//     if (!sessionToken) {
//       return NextResponse.json(
//         { error: "Unauthorized access" },
//         { status: 401 },
//       );
//     }

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/rpc/project_epics?project_id=eq.${encodeURIComponent(
//         projectId,
//       )}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
//       {
//         method: "GET",
//         headers: {
//           apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
//           Authorization: `Bearer ${sessionToken}`,
//           "Content-Type": "application/json",
//           Prefer: "count=exact",
//         },
//       },
//     );

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null);

//       return NextResponse.json(
//         {
//           error:
//             errorData?.message ||
//             errorData?.details ||
//             "Failed to fetch project epics",
//         },
//         { status: response.status },
//       );
//     }

//     const data = await response.json();

//     const result = NextResponse.json(data);

//     const contentRange = response.headers.get("Content-Range");

//     if (contentRange) {
//       result.headers.set("Content-Range", contentRange);
//     }

//     return result;
//   } catch (error) {
//     console.error("Project epics proxy error:", error);

//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 },
//     );
//   }
// }


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
}

// GET: Fetch project epics with pagination
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> },
// ) {
//   try {
//     const { id: projectId } = await params;

//     const { searchParams } = new URL(request.url);

//     const limit = searchParams.get("limit") ?? "10";
//     const offset = searchParams.get("offset") ?? "0";

//     if (!projectId) {
//       return NextResponse.json(
//         { error: "Project ID is required" },
//         { status: 400 },
//       );
//     }

//     const supabase = await getSupabaseServerClient();

//     const {
//       data: { user },
//     } = await supabase.auth.getUser();

//     if (!user) {
//       return NextResponse.json(
//         { error: "Unauthorized access" },
//         { status: 401 },
//       );
//     }

//     const sessionToken = (
//       await supabase.auth.getSession()
//     ).data.session?.access_token;

//     if (!sessionToken) {
//       return NextResponse.json(
//         { error: "No active session" },
//         { status: 401 },
//       );
//     }

//     const response = await fetch(    
//       `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_epics?project_id=eq.${encodeURIComponent(
//         projectId,
//       )}&limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
//       {
//         method: "GET",
//         headers: {
//           apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
//           Authorization: `Bearer ${sessionToken}`,
//           "Content-Type": "application/json",
//           Prefer: "count=exact",
//         },
//       },
//     );

//     const data = await response.json().catch(() => null);

//     if (!response.ok) {
//       console.error(
//         "❌ SUPABASE GET PROJECT EPICS ERROR:",
//         data,
//       );

//       return NextResponse.json(
//         {
//           error:
//             data?.message ||
//             data?.details ||
//             "Failed to fetch project epics database rows",
//         },
//         {
//           status: response.status,
//         },
//       );
//     }

//     const result = NextResponse.json(data);

//     const contentRange = response.headers.get("Content-Range");

//     if (contentRange) {
//       result.headers.set("Content-Range", contentRange);
//     }

//     return result;
//   } catch (error) {
//     console.error(
//       "❌ Project epics proxy error:",
//       error,
//     );

//     return NextResponse.json(
//       {
//         error: "Internal Server Error",
//       },
//       {
//         status: 500,
//       },
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

    const limit = searchParams.get("limit") ?? "10";
    const offset = searchParams.get("offset") ?? "0";
    const search = searchParams.get("search")?.trim() ?? "";

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const sessionToken = (
      await supabase.auth.getSession()
    ).data.session?.access_token;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No active session" },
        { status: 401 },
      );
    }

    const queryParams = new URLSearchParams();

    queryParams.set("project_id", `eq.${projectId}`);
    queryParams.set("limit", limit);
    queryParams.set("offset", offset);

    if (search) {
      queryParams.set("title", `ilike.%${search}%`);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/project_epics?${queryParams.toString()}`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(
        "❌ SUPABASE GET PROJECT EPICS ERROR:",
        data,
      );

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            "Failed to fetch project epics database rows",
        },
        {
          status: response.status,
        },
      );
    }

    const result = NextResponse.json(data);

    const contentRange = response.headers.get("Content-Range");

    if (contentRange) {
      result.headers.set("Content-Range", contentRange);
    }

    return result;
  } catch (error) {
    console.error(
      "❌ Project epics proxy error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

// POST: Create a brand new Epic entry
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: projectId } = await params;

    const body = await request.json();

    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 },
      );
    }

    const sessionToken = (
      await supabase.auth.getSession()
    ).data.session?.access_token;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No active session" },
        { status: 401 },
      );
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/epics`,
      {
        method: "POST",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          title: body.title.trim(),
          description: body.description?.trim() || null,
          assignee_id: body.assignee_id || null,
          project_id: projectId,
          deadline: body.deadline || null,
        }),
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(
        "❌ SUPABASE CREATE EPIC ERROR:",
        data,
      );

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            "Failed to create epic record",
        },
        {
          status: response.status,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "❌ Epic proxy creation error:",
      error,
    );

    return NextResponse.json(
      {
        error: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}