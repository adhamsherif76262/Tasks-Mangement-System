import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()

    // 1. Initialize server client
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_BASE_URL!,
      process.env.NEXT_PUBLIC_SECRET_KEYS!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              })
            )
          },
        },
      }
    )

    // 2. Safely verify user identity using server context
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    // 3. Request projects data using standard Supabase RPC via administrative credentials
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/rpc/get_projects`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
          // Pass the user's secure token derived safely on the server side
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch projects database rows' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Projects proxy error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


// Add this brand new POST handler for record creation
// export async function POST(request: Request) {
//   try {
//     const body = await request.json()
//     const cookieStore = await cookies()

//     const supabase = createServerClient(
//       process.env.NEXT_PUBLIC_BASE_URL!,
//       process.env.NEXT_PUBLIC_SECRET_KEYS!,
//       {
//         cookies: {
//           getAll() { return cookieStore.getAll() },
//           setAll(cookiesToSet) {
//             cookiesToSet.forEach(({ name, value, options }) =>
//               cookieStore.set(name, value, options)
//             )
//           },
//         },
//       }
//     )

//     // 1. Verify identity safely on the server side
//     const { data: { user } } = await supabase.auth.getUser()
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
//     }

//     const sessionToken = (await supabase.auth.getSession()).data.session?.access_token

//     // 2. Perform the database creation query on your isolated backend thread
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/projects`, {
//       method: "POST",
//       headers: {
//         apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
//         Authorization: `Bearer ${sessionToken}`,
//         "Content-Type": "application/json",
//         // Force database to return the newly generated row if needed by adding Prefer header
//         "Prefer": "return=representation"
//       },
//       body: JSON.stringify({
//         name: body.name.trim(),
//         description: body.description?.trim() || "",
//         user_id: user.id // Wire the authenticated user ID reference to your foreign keys schema
//       }),
//     })

//     if (!response.ok) {
//       const errPayload = await response.json().catch(() => null)
//       console.error("Database table entry error:", errPayload)
//       return NextResponse.json({ error: 'Failed to create record' }, { status: response.status })
//     }

//     const createdRecord = await response.json()
//     return NextResponse.json({ success: true, data: createdRecord }, { status: 201 })
//   } catch (error) {
//     console.error('Projects proxy POST error:', error)
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
//   }
// }


export async function POST(request: Request) {
  try {
    const body = await request.json()
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_BASE_URL!,
      process.env.NEXT_PUBLIC_SECRET_KEYS!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    const sessionToken = (await supabase.auth.getSession()).data.session?.access_token

    // 💡 Build out the insert payload dynamically
    const insertData: Record<string, any> = {
      name: body.name.trim(),
      description: body.description?.trim() || "",
    }

    // Try assigning standard foreign keys dynamically based on your schema config.
    // If your column matches one of these, uncomment it or map it to your exact field name:
    // insertData.user_id = user.id
    // insertData.created_by = user.id

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/projects`, {
      method: "POST",
      headers: {
        apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
        Authorization: `Bearer ${sessionToken}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(insertData),
    })

    if (!response.ok) {
      // 💡 PRINT OUT THE EXACT DB ERROR MESSAGE PAYLOAD SO YOU CAN TRACK THE FIELD MISMATCH
      const errPayload = await response.json().catch(() => null)
      console.error("❌ SUPABASE INSERTS DATABASE REJECTION REASON:", errPayload)
      
      return NextResponse.json({ 
        error: errPayload?.message || errPayload?.details || 'Failed to create record' 
      }, { status: response.status })
    }

    const createdRecord = await response.json()
    return NextResponse.json({ success: true, data: createdRecord }, { status: 201 })
  } catch (error) {
    console.error('Projects proxy POST error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

