import type { Metadata } from "next";
import "./globals.css";
import { LayoutWrapper } from "../components/layout/LayoutWrapper";
import { cn } from "../lib/utils";

export const metadata: Metadata = {
  title: "Flpkart Big sale is Live",
  description: "Shop online at Flpkart Big sale is Live.",
  manifest: "/manifest.json",
  icons: {
    icon: "/fk_logo.jpg",
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
      <head>
        {/* Preload critical above-the-fold header & hero banner images for instant rendering */}
        <link rel="preload" href="/upor5.webp" as="image" type="image/webp" />
        <link rel="preload" href="/banner_freedom_site.jpg" as="image" />
        <link rel="preload" href="/cat_mobiles.jpg" as="image" />
        <link rel="preload" href="/cat_electronics.jpg" as="image" />
        <link rel="preload" href="/cat_appliances.png" as="image" />
        <link rel="preload" href="/cat_furniture.jpg" as="image" />
        <link rel="preload" href="/cat_grocery.png" as="image" />
      </head>
      <body className={cn("min-h-screen flex flex-col antialiased")}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
