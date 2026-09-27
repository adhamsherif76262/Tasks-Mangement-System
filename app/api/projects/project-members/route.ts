// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const projectId = searchParams.get('project_id')

//     if (!projectId) {
//       return NextResponse.json(
//         { error: 'Project ID is required' },
//         { status: 400 }
//       )
//     }

//     const cookieStore = await cookies()

//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_BASE_URL!,
//       process.env.NEXT_PUBLIC_SECRET_KEYS!,
//       {
//         cookies: {
//           getAll() {
//             return cookieStore.getAll()
//           },

//           setAll(cookiesToSet) {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, {
//                 ...options,
//                 httpOnly: true,
//                 secure: process.env.NODE_ENV === 'production',
//                 sameSite: 'lax',
//               })
//             )
//           },
//         },
//       }
//     )

//     const {
//       data: { user },
//     } = await supabase.auth.getUser()

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Unauthorized access' },
//         { status: 401 }
//       )
//     }

//     const sessionToken = (
//       await supabase.auth.getSession()
//     ).data.session?.access_token

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/get_project_members?project_id=eq.${encodeURIComponent(projectId)}`,
//       {
//         method: 'GET',
//         headers: {
//           apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
//           Authorization: `Bearer ${sessionToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     )

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => null)

//       console.error(
//         '❌ SUPABASE GET PROJECT MEMBERS ERROR:',
//         errorData
//       )

//       return NextResponse.json(
//         {
//           error:
//             errorData?.message ||
//             errorData?.details ||
//             'Failed to fetch project members database rows',
//         },
//         { status: response.status }
//       )
//     }

//     const data = await response.json()

//     return NextResponse.json(data)
//   } catch (error) {
//     console.error('Project members proxy error:', error)

//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     )
//   }
// }


import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {

    const { searchParams } = new URL(request.url);

    const projectId =
      searchParams.get("project_id");

    if (!projectId) {
      console.error(
        "Project ID was not provided.",
      );

      return NextResponse.json(
        {
          error: "Project ID is required",
        },
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
            cookiesToSet.forEach(
              ({ name, value, options }) =>
                cookieStore.set(name, value, {
                  ...options,
                  httpOnly: true,
                  secure:
                    process.env.NODE_ENV ===
                    "production",
                  sameSite: "lax",
                }),
            );
          },
        },
      },
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized access",
        },
        { status: 401 },
      );
    }

    const sessionToken = (
      await supabase.auth.getSession()
    ).data.session?.access_token;

    if (!sessionToken) {
      return NextResponse.json(
        {
          error: "No active session",
        },
        { status: 401 },
      );
    }

    const supabaseUrl =
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/get_project_members?project_id=${projectId}`;

    const response = await fetch(
      supabaseUrl,
      {
        method: "GET",
        headers: {
          apikey:
            process.env.NEXT_PUBLIC_SECRET_KEYS!,
          Authorization: `Bearer ${sessionToken}`,
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      console.error(
        "❌ SUPABASE GET PROJECT MEMBERS ERROR:",
        data,
      );

      return NextResponse.json(
        {
          error:
            data?.message ||
            data?.details ||
            "Failed to fetch project members database rows",
        },
        {
          status: response.status,
        },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      "❌ Project members proxy error:",
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