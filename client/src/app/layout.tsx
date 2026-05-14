import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "KitchenProduct | Modern Kitchen Appliances",
  description: "Explore the best kitchen products and appliances on KitchenProduct.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("inter-fallback min-h-screen flex flex-col")}>
        <Header />
        <main className="flex-grow pb-16 md:pb-0">
          {children}
        </main>
        <BottomNav />
        <Footer />
      </body>
    </html>
  );
}
