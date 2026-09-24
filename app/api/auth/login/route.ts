// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import { NextResponse } from 'next/server'

// export async function POST(request: Request) {
//   const { email, password } = await request.json()
//   const cookieStore = await cookies()

//   const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_BASE_URL!,
//     process.env.NEXT_PUBLIC_SECRET_KEYS!,
//     {
//       cookies: {
//         getAll() { return cookieStore.getAll() },
//         setAll(cookiesToSet) {
//           cookiesToSet.forEach(({ name, value, options }) =>
//             cookieStore.set(name, value, {
//               ...options,
//               httpOnly: true, // 🔒 Prevents client-side script access
//               secure: process.env.NODE_ENV === 'production',
//               sameSite: 'lax',
//             })
//           )
//         },
//       },
//     }
//   )

//   const { data, error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   })

//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 400 })
//   }

//   return NextResponse.json({ success: true })
// }


import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email, password, rememberMe } = await request.json()
  const cookieStore = await cookies()

  // Create a base response object pointing to your dashboard destination path
  const response = NextResponse.json({ success: true })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_BASE_URL!,
    process.env.NEXT_PUBLIC_SECRET_KEYS!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // 1. Commit the cookie state to the server store
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            })
            
            // 2. 💡 CRITICAL: Append the cookie directly to the outgoing API network response header.
            // This guarantees the browser registers the session data instantly on the same cycle!
            response.cookies.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
            })
          })
        },
      },
    }
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Return the configured response carrying the fresh cookie credentials
  return response
}
