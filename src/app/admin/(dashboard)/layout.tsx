import Link from "next/link";
import { SessionProvider } from "@/components/admin/SessionProvider";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#0a0a0a] flex">
        <aside className="w-56 border-r border-[#2a2a2a] p-6 shrink-0 hidden md:flex flex-col gap-8">
          <Link
            href="/"
            className="font-serif text-xl tracking-[0.15em] text-[#f5f0e8] hover:text-[#c9a84c] transition-colors"
          >
            SUNATRA
          </Link>
          <AdminNav />
        </aside>
        <div className="flex-1 p-6 md:p-10 overflow-auto">{children}</div>
      </div>
    </SessionProvider>
  );
}
