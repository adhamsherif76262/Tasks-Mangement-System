import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/projects'

  if (code) {
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
                httpOnly: true, // 🔒 Safe from XSS token extraction
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              })
            )
          },
        },
      }
    )

    // 🔄 Server-side swap: Exchange the single-use code for secure session cookies
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Clean redirect to your frontend page (/reset-password)
      return NextResponse.redirect(`${origin}${next}`)
    }
    
    console.error('Code exchange failed:', error.message)
  }

  // Fallback to error gate or login page if the code is invalid or missing
  return NextResponse.redirect(`${origin}/login?error=invalid_recovery_link`)
}
