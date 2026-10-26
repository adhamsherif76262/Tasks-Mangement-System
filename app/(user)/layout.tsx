"use client"
import { Inter } from "next/font/google";
import "../globals.css";
import MobileBottomNavigator from "@/components/MobileBottomNavigator";
import AppNavbar from "@/components/AppNavbar";
import AppSidebar from "@/components/AppSidebar";
import { useState } from "react";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function UserLayout({ children }: LayoutProps<"/">) {
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div
      lang="en"
      className={`${inter.variable} flex min-h-screen w-full bg-surface-low`}
    >
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((previous) => !previous)}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AppNavbar
          onMenuClick={() => setMobileSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-84px)] flex-1">
          {children}
        </main>
      </div>
        <MobileBottomNavigator />
    </div>
  );
}
