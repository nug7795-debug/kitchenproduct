import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "../components/layout/LayoutWrapper";
import { cn } from "../lib/utils";

export const metadata: Metadata = {
  title: "Flpkart Big sale is Live",
  description: "Shop online at Flpkart Big sale is Live.",
  manifest: "/manifest.json",
  icons: {
    icon: "/kitchen_logo.png",
  },
  openGraph: {
    title: "Flpkart Big sale is Live",
    description: "Shop online at Flpkart Big sale is Live.",
    type: "website",
  }
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
