import { Sidebar } from "@/components/admin/Sidebar";
import { cn } from "../../../lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="md:ml-64 p-4">
        <header className="mb-8 flex h-16 items-center justify-between rounded-xl bg-white px-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-800">KitchenProduct</h1>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-500 rounded uppercase tracking-wider">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800 leading-none">Admin User</span>
              <span className="text-[10px] text-muted-foreground">Super Admin</span>
            </div>
            <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
               <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500" />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
