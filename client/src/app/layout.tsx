import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "../components/layout/LayoutWrapper";
import { cn } from "../lib/utils";

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
      <body className={cn("min-h-screen flex flex-col antialiased")}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
