// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//     const apiKey = process.env.NEXT_PUBLIC_SECRET_KEYS;

//     if (!baseUrl || !apiKey) {
//       return NextResponse.json(
//         { message: "Server configuration error." },
//         { status: 500 }
//       );
//     }

//     const response = await fetch(
//       `${baseUrl}/auth/v1/signup`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           apikey: apiKey,
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await response.json();

//     if (!response.ok) {
//       return NextResponse.json(data, {
//         status: response.status,
//       });
//     }

//     const nextResponse = NextResponse.json(
//       {
//         user: data.user,
//       },
//       {
//         status: 200,
//       }
//     );

//     nextResponse.cookies.set("access_token", data.access_token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//       maxAge: data.expires_in,
//     });

//     nextResponse.cookies.set("refresh_token", data.refresh_token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       path: "/",
//     });

//     return nextResponse;

//   } catch (error) {
//     console.error("Signup API error:", error);

//     return NextResponse.json(
//       {
//         message: "Internal server error.",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }