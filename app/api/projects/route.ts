import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()

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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 })
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/rest/v1/rpc/get_projects`,
      {
        method: "GET",
        headers: {
          apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
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

    const insertData: Record<string, any> = {
      name: body.name.trim(),
      description: body.description?.trim() || "",
    }

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

