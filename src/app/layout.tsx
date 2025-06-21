import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Kind: Better Contact App",
  description: "A contact management solution focused on helping to grow your network and provide value to your relationships.",
  openGraph: {
    title: "Kind: Better Contact App",
    description: "A contact management solution focused on helping to grow your network and provide value to your relationships.",
    images: [
      {
        url: "/kind_logo_yellow_bg.png",
        width: 500,
        height: 500,
        alt: "Kind Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kind: Better Contact App",
    description: "A contact management solution focused on helping to grow your network and provide value to your relationships.",
    images: ["/kind_logo_yellow_bg.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <meta property="og:image" content="/kind_logo_yellow_bg.png" />
          <meta name="twitter:image" content="/kind_logo_yellow_bg.png" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body>
          {children}
          <Toaster />
        </body>
        
      </html>
    </ClerkProvider>
  );
}
