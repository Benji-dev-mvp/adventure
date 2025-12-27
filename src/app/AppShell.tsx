import { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type AppShellProps = { children: ReactNode };

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
