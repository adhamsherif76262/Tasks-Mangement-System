// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     const response = await fetch(
//     //   `${process.env.NEXT_PUBLIC_BASE_URL}/auth/v1/signup`,
//       `https://bflnaoywkzdsarnkktyu.supabase.co/auth/v1/signup`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         //   apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await response.json();

//     return NextResponse.json(data, {
//       status: response.status,
//     });
//   } catch (error) {
//     console.error("Signup API error:", error);

//     return NextResponse.json(
//       {
//         message: "Something went wrong while creating the account.",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }








// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();

//     console.log("BASE URL:", process.env.NEXT_PUBLIC_BASE_URL);
//     console.log("API KEY EXISTS:", !!process.env.SECRET_KEYS);
//     console.log("API KEY:", process.env.SECRET_KEYS);

//     const response = await fetch(
//       `${process.env.NEXT_PUBLIC_BASE_URL}/auth/v1/signup`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           apikey: process.env.SECRET_KEYS!,
//         },
//         body: JSON.stringify(body),
//       }
//     );

//     const data = await response.json();

//     return NextResponse.json(data, {
//       status: response.status,
//     });
//   } catch (error) {
//     console.error("Signup API error:", error);

//     return NextResponse.json(
//       {
//         message: "Something went wrong while creating the account.",
//       },
//       {
//         status: 500,
//       }
//     );
//   }
// }



import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    // const apiKey = process.env.SECRET_KEYS;
    const apiKey = "ss";

    if (!baseUrl) {
      console.error("NEXT_PUBLIC_BASE_URL is undefined");

      return NextResponse.json(
        { message: "Server configuration error: Base URL is missing." },
        { status: 500 }
      );
    }

    if (!apiKey) {
      console.error("SECRET_KEYS is undefined");

      return NextResponse.json(
        { message: "Server configuration error: API key is missing." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${baseUrl}/auth/v1/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });

  } catch (error) {
    console.error("Signup API error:", error);

    return NextResponse.json(
      {
        message: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}