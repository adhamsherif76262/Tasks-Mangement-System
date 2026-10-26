import Button from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-gray-200 px-16 py-32 sm:items-start ">
              <h1>Statistics Page</h1>

      <Button text="Primary Action" variant="ghost" className="shadow[0px_25px_50px_-12px_#003D9B4D] h-10 px-6 py-2.5 hover:cursor-pointer"></Button>
      <Input type="text" variant="error" label="Email" label_class="text-label-xs uppercase text-slate-neutral-medium" helperText="THe Helper Text" placeholder="ssssssssssssssssss"  className="rounded-sm"/>
      </main>
    </div>
  );
}
