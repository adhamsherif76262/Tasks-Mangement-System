"use client";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
import PublicNavbar from '@/components/PublicNavbar';
import { useRouter } from "next/navigation";
import Image from "next/image"; // Imported to handle checking status icons
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/button';
import Checkbox from '@/components/ui/Checkbox';
// import {
//   signUpSchema,
//   type SignUpFormData,
// } from "@/schemas/signUpSchema";
export default function Loginpage() {


  const router = useRouter();

  // const {
  //   register,
  //   handleSubmit,
  //   watch, // Added watch to observe the password value live
  //   formState: { errors, isSubmitting },
  // } = useForm<SignUpFormData>({
  //   resolver: zodResolver(signUpSchema),
  //   mode: "onBlur",
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     password: "",
  //     confirmPassword: "",
  //     jobTitle: "",
  //   },
  // });

  return (
  <section className='w-full bg-surface-low min-h-221'>
        <PublicNavbar></PublicNavbar>   
        {/* <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-xl mx-auto mt-4 mb-32 pb-18.5 px-6 xxs:p-12 shadow[0px_24px_48px_0px_#041B3C0F]"> */}
        <div className="w-full xxs:px-6 xxs:py-36.75">
          <form className="bg-white max-w-120 mx-auto pb-12 px-6 xxs:p-12 shadow[0px_24px_48px_0px_#041B3C0F]">
            <article className="text-center pb-10 max-xxs:pt-22">
              <h1 className="text-slate-neutral-dark text-signup-headline-lg font-semibold">Welcome Back</h1>
              <p className="text-signup-p-headline text-slate-neutral-medium mt-2 xxs:mx-0">Please enter your details to access your workspace.</p>
            </article>
            <article className="mx-auto flex flex-col gap-6">

              {/* Email */}
              {/* <Input {...register("email")} type="text" variant={errors.email ? "error" : "default"} label="Email" label_class={`text-label-xs uppercase ml-1 mb-0 ${errors.email? "text-semantic-error" : "text-slate-neutral-medium"}`} helperText={errors.email && errors.email.message || ""} placeholder="yourname@company.com"  className="rounded-sm py-3.5 px-4"/> */}
              <Input type="text" variant={"default"} label="Email" label_class={`text-label-xs uppercase ml-1 mb-0 ${"text-slate-neutral-medium"}`} helperText={""} placeholder="yourname@company.com"  className="rounded-sm py-3.5 px-4"/>

                {/* Password */}
                <Input type="password" variant={"default"} label="Password" label_class={`text-label-xs uppercase ml-1 mb-0 ${"text-slate-neutral-medium"}`} helperText={""} placeholder="Password"  className="rounded-sm py-3.5 px-4"/>

              <div className="flex items-center justify-between py-2">
                <Checkbox
                  id="rememberMe"
                  label="Remember Me"
                  // {...register("rememberMe")}
                />

                <span className="text-primary text-primary-button-sm font-semibold hover:cursor-pointer" onClick={()=>{router.push("/forgot-password")}}>Forgot Password?</span>
              </div>
              {/* <Button disabled={isSubmitting} text={isSubmitting ? "Creating Account..." : "Create Account"} variant="primary" className="shadow-[0px_1px_2px_0px_#0000000D] mt-6 px-20 py-3 rounded-lg hover:cursor-pointer w-full"></Button> */}
              <Button text={"Log In"} variant="primary" className="shadow-[0px_1px_2px_0px_#0000000D] mt-0 px-20 py-3 rounded-lg hover:cursor-pointer w-full"></Button>

            </article>
            <article className="text-center mx-auto flex items-center gap-1 justify-center pt-16 max-xxs:pt-59 max-xxs:pb-0">
              <span className="text-signup-p-headline text-slate-neutral-medium">Don&apos;t have an account ?</span><span className="text-primary text-primary-button-sm font-semibold hover:cursor-pointer" onClick={()=>{router.push("/sign-up")}}>Sign Up</span>
            </article>
          </form>
        </div>
    </section>
  )
}
