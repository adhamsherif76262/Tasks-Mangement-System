import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
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
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // 2. Terminate the session on Supabase's backend authority server
    await supabase.auth.signOut()

    // 3. Create a clean redirect response back to your login gate
    const response = NextResponse.json({ success: true })

    // 4. Force override active auth cookies by zeroing out their lifetimes
    const activeCookies = ['sb-access-token', 'sb-refresh-token'] // or whatever your client names them
    cookieStore.getAll().forEach(cookie => {
      if (cookie.name.includes('supabase') || cookie.name.includes('auth')) {
        response.cookies.set(cookie.name, '', { maxAge: 0, expires: new Date(0) })
      }
    })

    return response;
  } catch (error) {
    console.error('Logout handler exception:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
