// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";

// import PublicNavbar from "@/components/PublicNavbar";
// import { Input } from "@/components/ui/Input";
// import Button from "@/components/ui/button";
// import Checkbox from "@/components/ui/Checkbox";
// import {
//   loginSchema,
//   type LoginFormData,
// } from "@/app/(user)/schemas/loginSchema";

// interface AuthResponse {
//   access_token: string;
//   token_type: string;
//   expires_in: number;
//   expires_at: number;
//   refresh_token: string;

//   user: {
//     id: string;
//     email: string;
//     role: string;
//     user_metadata?: {
//       name?: string;
//       job_title?: string;
//     };
//   };
// }

// const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
// const API_KEY = process.env.NEXT_PUBLIC_SECRET_KEYS;

// export default function Loginpage() {
//   const router = useRouter();

//   const [rememberMe, setRememberMe] = useState(false);
//   const [loginError, setLoginError] = useState("");

// const {
//   register,
//   handleSubmit,
//   formState: {
//     errors,
//     isSubmitting,
//   },
// } = useForm({
//   resolver: zodResolver(loginSchema),

//   mode: "onBlur",

//   defaultValues: {
//     email: "",
//     password: "",
//     rememberMe: false,
//   },
// });

//   const onSubmit = async (data: LoginFormData) => {
//     try {

//       setLoginError("");
//       if (!BASE_URL) {
//         throw new Error("NEXT_PUBLIC_BASE_URL is not configured.");
//       }

//       if (!API_KEY) {
//         throw new Error("NEXT_PUBLIC_API_KEY is not configured.");
//       }

//       const response = await fetch(
//         `${BASE_URL}/auth/v1/token?grant_type=password`,
//         {
//           method: "POST",

//           headers: {
//             "Content-Type": "application/json",
//             apikey: API_KEY,
//           },

//           body: JSON.stringify({
//             email: data.email,
//             password: data.password,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (!response.ok) {

//         setLoginError(
//           result?.message ||
//           result?.error_description ||
//           "Invalid email or password."
//         );

//         return;
//       }

//       if (
//         !result.access_token ||
//         !result.refresh_token
//       ) {
//         setLoginError(
//           "Login succeeded but authentication tokens were not returned."
//         );

//         return;
//       }

//       const session: AuthResponse = {
//         access_token: result.access_token,
//         token_type: result.token_type,
//         expires_in: result.expires_in,
//         expires_at: result.expires_at,
//         refresh_token: result.refresh_token,
//         user: result.user,
//       };

//       if (rememberMe) {
//   sessionStorage.removeItem("auth_session");

//   localStorage.setItem(
//     "auth_session",
//     JSON.stringify(session),
//   );
// } else {
//   localStorage.removeItem("auth_session");

//   sessionStorage.setItem(
//     "auth_session",
//     JSON.stringify(session),
//   );
// }
//       router.push("/projects");

//     } catch (error) {

//       console.error("Login error:", error);

//       setLoginError(
//         error instanceof Error
//           ? error.message
//           : "Something went wrong while logging in."
//       );
//     }
//   };

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import PublicNavbar from "@/components/PublicNavbar";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/button";
import Checkbox from "@/components/ui/Checkbox";
import {
  loginSchema,
  type LoginFormData,
} from "@/app/(user)/schemas/loginSchema";

export default function Loginpage() {
  const router = useRouter();
  const [loginError, setLoginError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoginError("");

    try {
      // 🔒 Route the credentials through your secure API wrapper endpoint
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe, // Can be consumed by API route to extend cookie lifetimes if required
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(
          result?.error || "Invalid email or password."
        );
        return;
      }

      // Success! Cookies are safely bound in the browser background.
      // Flush any leftover client-side legacy references just in case.
      localStorage.removeItem("auth_session");
      sessionStorage.removeItem("auth_session");

      router.push("/projects");
      router.refresh(); // Tells Next.js to recalculate server layout/middleware states
    } catch (error) {
      console.error("Login client processing error:", error);
      setLoginError("Something went wrong while logging in. Please try again.");
    }
  };

  // ... rest of your JSX code block follows exactly the same here


  return (
    <section className="w-full bg-surface-low min-h-221">

      <div className="w-full xxs:px-6 xxs:py-36.75">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="
            bg-white
            max-w-120
            mx-auto
            pb-12
            px-6
            xxs:p-12
            shadow-[0px_24px_48px_0px_#041B3C0F]
          "
        >

          <article className="text-center pb-10 max-xxs:pt-22">

            <h1 className="text-slate-neutral-dark text-signup-headline-lg font-semibold">
              Welcome Back
            </h1>

            <p className="text-signup-p-headline text-slate-neutral-medium mt-2">
              Please enter your details to access your workspace.
            </p>

          </article>

          <article className="mx-auto flex flex-col gap-6">

            <Input
              {...register("email")}
              type="text"

              variant={
                errors.email
                  ? "error"
                  : "default"
              }

              label="Email"

              label_class="
                text-label-xs
                uppercase
                ml-1
                mb-0
                text-slate-neutral-medium
              "

              helperText={
                errors.email?.message || ""
              }

              placeholder="yourname@company.com"

              className="
                rounded-sm
                py-3.5
                px-4
              "
            />

            <Input
              {...register("password")}
              mobile={true}
              type="password"

              variant={
                errors.password
                  ? "error"
                  : "default"
              }

              label="Password"

              label_class="
                text-label-xs
                uppercase
                ml-1
                mb-0
                text-slate-neutral-medium
              "

              helperText={
                errors.password?.message || ""
              }

              placeholder="Password"

              className="
                rounded-sm
                py-3.5
                px-4
              "
            />

            <div className="flex items-center justify-between py-2">

              <Checkbox
                id="rememberMe"

                label="Remember Me"

                checked={rememberMe}

                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
              />


              <span
                className="
                  text-primary
                  text-primary-button-sm
                  font-semibold
                  hover:cursor-pointer
                  hidden
                  xxs:block
                "

                onClick={() => {
                  router.push("/forgot-password");
                }}
              >
                Forgot Password?
              </span>

            </div>

            {loginError && (
              <p className="text-semantic-error text-sm">
                {loginError}
              </p>
            )}
            <Button
              text={
                isSubmitting
                  ? "Logging In..."
                  : "Log In"
              }

              variant="primary"

              disabled={isSubmitting}

              className="
                shadow-[0px_1px_2px_0px_#0000000D]
                mt-0
                px-20
                py-3
                rounded-lg
                hover:cursor-pointer
                w-full
              "
            />

          </article>

          <article
            className="
              text-center
              mx-auto
              flex
              items-center
              gap-1
              justify-center
              pt-16
              max-xxs:pt-59
              max-xxs:pb-0
            "
          >

            <span className="text-signup-p-headline text-slate-neutral-medium">
              Don&apos;t have an account?
            </span>

            <span
              className="
                text-primary
                text-primary-button-sm
                font-semibold
                hover:cursor-pointer
              "

              onClick={() => {
                router.push("/sign-up");
              }}
            >
              Sign Up
            </span>

          </article>

        </form>

      </div>

    </section>
  );
}