import type { Metadata } from "next";
import localFont from "next/font/local";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import SmoothScroll from "@/components/smooth-scroll";
import Cursor from "@/components/cursor";

const bdoGrotesk = localFont({
  src: [
    {
      path: "./fonts/BDOGrotesk-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/BDOGrotesk-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/BDOGrotesk-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-bdo-grotesk",
  display: "swap",
});

// LCT Ciburial — statement industrial display face, used for large titles.
const ciburial = localFont({
  src: [
    {
      path: "./fonts/LCT-Ciburial-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-ciburial",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stanford AI Club",
  description: "Stanford's home for students in AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bdoGrotesk.variable} ${ciburial.variable} antialiased`}>
        <NuqsAdapter>
          <SmoothScroll>{children}</SmoothScroll>
          <Cursor />
        </NuqsAdapter>
      </body>
    </html>
  );
}
