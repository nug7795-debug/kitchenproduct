import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "../components/layout/LayoutWrapper";
import { cn } from "../lib/utils";

export const metadata: Metadata = {
  title: "Online Shopping for Electronics, Mobile, Fashion, etc.",
  description: "Shop online for Electronics, Mobile, Fashion, Appliances and more.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
