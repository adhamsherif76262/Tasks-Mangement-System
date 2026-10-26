import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
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

    const originHost = request.headers.get('origin') || request.headers.get('host') || ''
    const protocol = process.env.NODE_ENV === 'production' ? 'https://' : 'http://'
    const cleanOrigin = originHost.startsWith('http') ? originHost : `${protocol}${originHost}`
    
const redirectToUrl = `${cleanOrigin}/api/auth/callback?next=/reset-password`

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectToUrl,
    })

    if (error) {
      console.error('Supabase recovery internal error:', error)
      return NextResponse.json({ error: error.message }, { status: error.status || 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('BFF Recovery route handler exception:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
