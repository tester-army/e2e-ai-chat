import type { Metadata, Viewport } from "next";
import "@/styles/e2e.css";

import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "e2e ai chat",
  description: "A support chat on a real model through the AI SDK, tested end to end with e2e.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      {/* h-dvh, not min-h-dvh: the conversation scrolls inside the page so the message box stays in view. */}
      <body className="flex h-dvh flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
