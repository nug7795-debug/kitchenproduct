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
        {/* Suppress and permanently remove Netlify badge/HUD iframe */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.setItem("nl-hud:public:v1", "hidden:9999999999999");
                localStorage.setItem("nl-hud:owner-private:v1", "hidden:9999999999999");
              } catch(e) {}
              if (typeof window !== 'undefined') {
                var killBadge = function() {
                  var frames = document.querySelectorAll('#nl-badge-frame:not(.hud-blocker), #nl-hud-frame:not(.hud-blocker), iframe[title*="Powered by Netlify"], iframe[title*="Netlify"], iframe[src*="netlify"], script[src*="/.netlify/scripts/hud"]');
                  for (var i = 0; i < frames.length; i++) {
                    frames[i].remove();
                  }
                };
                if (window.MutationObserver) {
                  new MutationObserver(killBadge).observe(document.documentElement, { childList: true, subtree: true });
                }
                document.addEventListener('DOMContentLoaded', killBadge);
                window.addEventListener('load', killBadge);
              }
            `
          }}
        />
      </head>
      <body className={cn("min-h-screen flex flex-col antialiased")}>
        {/* Blocker elements: Netlify HUD script checks for these exact IDs and aborts immediately without rendering the badge */}
        <div id="nl-badge-frame" className="hud-blocker" style={{ display: 'none', visibility: 'hidden', width: 0, height: 0, position: 'absolute', top: -9999, left: -9999, pointerEvents: 'none' }} />
        <div id="nl-hud-frame" className="hud-blocker" style={{ display: 'none', visibility: 'hidden', width: 0, height: 0, position: 'absolute', top: -9999, left: -9999, pointerEvents: 'none' }} />
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  );
}
