import { Sidebar } from "../../components/admin/Sidebar";
import { cn } from "../../lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <div className="md:ml-64 transition-all duration-300">
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                KitchenProduct
              </h1>
              <div className="flex items-center gap-2">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Dashboard</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end border-r border-slate-200 pr-6">
              <span className="text-sm font-bold text-slate-900 leading-tight">Ansarul Admin</span>
              <span className="text-[11px] font-semibold text-slate-400">System Administrator</span>
            </div>
            <div className="relative group cursor-pointer">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[10px] bg-white overflow-hidden">
                   <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center text-slate-500 font-bold">
                     AA
                   </div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
            </div>
          </div>
        </header>

        <main className="p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
          <footer className="mt-12 py-6 border-t border-slate-200/60 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Kitchen E-commerce Admin &bull; v1.2.0 &bull; Ref: {new Date().getTime()}
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
