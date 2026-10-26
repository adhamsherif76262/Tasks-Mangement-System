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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          rememberMe: data.rememberMe,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(
          result?.error || "Invalid email or password."
        );
        return;
      }

      localStorage.removeItem("auth_session");
      sessionStorage.removeItem("auth_session");

      router.push("/projects");
      router.refresh(); 
    } catch (error) {
      console.error("Login client processing error:", error);
      setLoginError("Something went wrong while logging in. Please try again.");
    }
  };

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