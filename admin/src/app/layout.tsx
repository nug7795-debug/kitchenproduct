import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KitchenProduct Admin | Dashboard",
  description: "Management dashboard for KitchenProduct e-commerce platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "bg-slate-50")}>
        <Sidebar />
        <div className="p-4 sm:ml-64">
          <header className="mb-8 flex h-16 items-center justify-between rounded-xl bg-white px-8 shadow-sm">
            <h1 className="text-xl font-bold">KitchenProduct Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">Admin User</span>
              <div className="h-10 w-10 rounded-full bg-slate-200" />
            </div>
          </header>
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
