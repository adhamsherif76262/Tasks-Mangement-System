import Button from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">

      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-gray-200 px-16 py-32 sm:items-start ">ADD NEW TASK PAGE
      <Input type="text" variant="error" label="Email" label_class="text-label-xs uppercase text-slate-neutral-medium" helperText="THe Helper Text" placeholder="ssssssssssssssssss"  className="rounded-sm"/>
      ADD NEW TASK PAGE
      </main>
    </div>
  );
}
