import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const cookieStore = await cookies()

    // 1. Initialize server client utilizing browser cookie jar context
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

    // 2. Safely verify that the incoming link session context is valid on the server
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Invalid or expired reset link." }, { status: 401 })
    }

    // 3. Issue the secure user update command to change the password
    const { error } = await supabase.auth.updateUser({
      password: password,
    })

    if (error) {
      // Pass the precise error string payload out to the client wrapper to match rules checks
      return NextResponse.json({ 
        error: error.message,
        status: error.status 
      }, { status: error.status || 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('BFF Reset Password route handler exception:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
