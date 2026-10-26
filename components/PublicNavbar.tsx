import Image from 'next/image';

export default function PublicNavbar() {
  return (
    <nav className="w-full flex items-center gap-2 py-6.5 pl-10 border-none">
      <Image 
        src="/Icons/Taskly_Icon.svg" 
        alt="Taskly Logo" 
        width={18} 
        height={20} 
      />
      <span className="text-slate-neutral-dark font-bold text-taskly-logo w-44.5">Taskly</span>
    </nav>
  );
}
