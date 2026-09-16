"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PublicNavbar from '@/components/PublicNavbar';
import { useRouter } from "next/navigation";
import Image from "next/image"; // Imported to handle checking status icons
import {
  signUpSchema,
  type SignUpFormData,
} from "@/schemas/signUpSchema";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { useState } from "react";

export default function SignUpPage() {
    const router = useRouter();
    const [res, setRes] = useState(null); 

    const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      jobTitle: "",
    },
  });
  const passwordValue = watch("password", "");

  const isAtLeast8Chars = passwordValue.length >= 8;
  const hasUpperLowerDigit = 
    /[A-Z]/.test(passwordValue) && 
    /[a-z]/.test(passwordValue) && 
    /[0-9]/.test(passwordValue);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordValue);
  
const onSubmit = async (data: SignUpFormData) => {
const payload = {
  email: data.email,
  password: data.password,
  data: {
    name: data.name,
    ...(data.jobTitle?.trim() ? { job_title: data.jobTitle.trim() } : {})
  }
};


  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.NEXT_PUBLIC_SECRET_KEYS!,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      setRes(result.msg);
      throw new Error(JSON.stringify({ status: response.status, result }));
    }

    router.push("/projects");
    
  } catch (error) {
    console.error("Network error or manual throw:", error);
  }
};

  return (
      <section className='w-full bg-surface-low'>
        <PublicNavbar></PublicNavbar>   
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white max-w-xl mx-auto mt-4 mb-32 pb-18.5 px-6 xxs:p-12 shadow[0px_24px_48px_0px_#041B3C0F]">
          <article className="text-center pb-10 max-xxs:pt-8">
            <h1 className="text-slate-neutral-dark text-signup-headline-lg font-semibold">Create Your Workspace</h1>
            <p className="text-signup-p-headline text-slate-neutral-medium mt-2 xxs:mx-0">Join the editorial approach to task management.</p>
          </article>
          <article className="mx-auto flex flex-col gap-6">

            {res && (<h2 className="text-semantic-error text-label-xs w-full rounded-xs p-4 bg-error-input-bg uppercase ml-1 mb-0">{res}</h2>)}
            <Input {...register("name")} type="text" variant={errors.name ? "error" : "default"} label="Name" label_class={`text-label-xs uppercase ml-1 mb-0 ${errors.name? "text-semantic-error" : "text-slate-neutral-medium"}`} helperText={errors.name && errors.name.message || "3-50 characters, letters only."} placeholder="Enter Your Full Name"  className="rounded-sm py-3.5 px-4"/>
            
            <Input {...register("email")} type="text" variant={errors.email ? "error" : "default"} label="Email" label_class={`text-label-xs uppercase ml-1 mb-0 ${errors.email? "text-semantic-error" : "text-slate-neutral-medium"}`} helperText={errors.email && errors.email.message || ""} placeholder="yourname@company.com"  className="rounded-sm py-3.5 px-4"/>
            
                <Input {...register("jobTitle")} type="text" variant={errors.jobTitle ? "error" : "default"} label="Job Title (Optional)" label_class={`text-label-xs uppercase ml-1 mb-0 ${errors.jobTitle? "text-semantic-error" : "text-slate-neutral-medium"}`} helperText={errors.jobTitle && errors.jobTitle.message || ""} placeholder="e.g. Project Manager"  className="rounded-sm py-3.5 px-4"/>

            <div className="flex flex-col xs:flex-row gap-4">
              <Input {...register("password")} type="password" variant={errors.password ? "error" : "default"} label="Password" label_class={`text-label-xs uppercase ml-1 mb-0 ${errors.password? "text-semantic-error" : "text-slate-neutral-medium"}`} helperText={errors.password && errors.password.message || ""} placeholder="Password"  className="rounded-sm py-3.5 px-4"/>

              <Input {...register("confirmPassword")} type="password" variant={errors.confirmPassword ? "error" : "default"} label="Confirm Password" label_class={`text-label-xs uppercase ml-1 mb-0 ${errors.confirmPassword? "text-semantic-error" : "text-slate-neutral-medium"}`} helperText={errors.confirmPassword && errors.confirmPassword.message || ""} placeholder="Repeat your password"  className="rounded-sm py-3.5 px-4"/>

            </div>

          <div className="p-4 rounded-xl bg-password-rules text-slate-neutral-dark text-sm hidden xxs:flex xxs:flex-col xxs:gap-3">
            {/* Requirement 1 */}
            <div className="flex items-center gap-3">
              {isAtLeast8Chars ? (
                <Image src="/Icons/Checked_Circle.svg" alt="Checked" width={18} height={18} />
              ) : (
                <Image src="/Icons/Empty_Circle.svg" alt="Unchecked" width={18} height={18} />
              )}
              <span className={isAtLeast8Chars ? "text-[#0F375A]" : "text-slate-neutral-medium"}>At least 8 characters</span>
            </div>

            {/* Requirement 2 */}
            <div className="flex items-center gap-3">
              {hasUpperLowerDigit ? (
                <Image src="/Icons/Checked_Circle.svg" alt="Checked" width={18} height={18} />
              ) : (
                <Image src="/Icons/Empty_Circle.svg" alt="Unchecked" width={18} height={18} />
              )}
              <span className={hasUpperLowerDigit ? "text-[#0F375A]" : "text-slate-neutral-medium"}>One uppercase, lowercase, and digit</span>
            </div>

            {/* Requirement 3 */}
            <div className="flex items-center gap-3">
              {hasSpecialChar ? (
                <Image src="/Icons/Checked_Circle.svg" alt="Checked" width={18} height={18} />
              ) : (
                <Image src="/Icons/Empty_Circle.svg" alt="Unchecked" width={18} height={18} />
              )}
              <span className={hasSpecialChar ? "text-[#0F375A]" : "text-slate-neutral-medium"}>One special character</span>
            </div>
          </div>

            <Button disabled={isSubmitting} text={isSubmitting ? "Creating Account..." : "Create Account"} variant="primary" className="shadow-[0px_1px_2px_0px_#0000000D] mt-6 px-20 py-3 rounded-lg hover:cursor-pointer w-full"></Button>

          </article>
          <article className="text-center mx-auto flex items-center gap-1 justify-center pt-8 max-xxs:pt-12 max-xxs:pb-8">
            <span className="text-signup-p-headline text-slate-neutral-medium">Already have an account ?</span><span className="text-primary text-primary-button-sm font-semibold hover:cursor-pointer" onClick={()=>{router.push("/login")}}>Log in</span>
          </article>
        </form>
    </section>
  )
}
