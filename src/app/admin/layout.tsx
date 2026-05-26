'use client';

import * as React from 'react';
import { Sidebar } from "../../components/admin/Sidebar";
import { cn } from "../../lib/utils";
import { Lock, Mail, Eye, EyeOff, KeyRound, Loader2, ShieldCheck, Menu, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Responsive sidebar drawer state for mobile
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    // Check if user is already authenticated in local storage
    const session = localStorage.getItem('admin_session');
    if (session === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay for a high-end feel
    setTimeout(() => {
      if (email.trim().toLowerCase() === 'nug7795@gmail.com' && password === 'Hifjur@123') {
        localStorage.setItem('admin_session', 'authenticated');
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Invalid admin email or password.');
      }
      setLoading(false);
    }, 800);
  };

  // Prevent flash or hydration issues during mounting
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  // Render Premium Admin Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090D1A] flex items-center justify-center relative overflow-hidden select-none">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />
        
        {/* Glowing orbs */}
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

        <div className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl p-8 max-w-md w-full mx-4 transition-all duration-300">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-xl shadow-orange-500/20 mx-auto mb-5">
            <Lock className="h-7 w-7 text-white animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black text-center text-white tracking-tight">
            ADMIN<span className="text-orange-500">PRO</span>
          </h2>
          <p className="text-xs text-slate-400 text-center mt-1.5 font-bold uppercase tracking-wider">
            Sign in to access your dashboard
          </p>

          <form onSubmit={handleLogin} className="space-y-5 mt-8">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors duration-300">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kitchenpro.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/60 border border-slate-800/80 focus:border-orange-500/80 rounded-xl text-sm font-semibold text-white placeholder-slate-600 outline-none transition-all duration-300 focus:ring-4 focus:ring-orange-500/5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-orange-500 transition-colors duration-300">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-950/60 border border-slate-800/80 focus:border-orange-500/80 rounded-xl text-sm font-semibold text-white placeholder-slate-600 outline-none transition-all duration-300 focus:ring-4 focus:ring-orange-500/5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300 transition-colors duration-300"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[11px] font-extrabold transition-all duration-300">
                <span className="flex h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-500/10 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Sign In to Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render Dashboard Layout once authenticated
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <style dangerouslySetInnerHTML={{ __html: `
        /* Overrides to break out of storefront max-w-[500px] mobile container */
        body > div { 
          align-items: stretch !important;
          background-color: transparent !important;
        }
        body > div > div { 
          max-width: none !important; 
          width: 100% !important;
          box-shadow: none !important;
        }
        .md\\:ml-64 { margin-left: 16rem !important; }
      ` }} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-64 transition-all duration-300">
        <header className="sticky top-0 z-30 h-20 flex items-center justify-between px-4 sm:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Hamburger menu toggle button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition-transform"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
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

        <main className="p-4 sm:p-8 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
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
