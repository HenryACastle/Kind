import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import "./globals.css";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from 'next/link';
import { Toaster } from "@/components/ui/sonner";



export const metadata: Metadata = {
  title: "Kind: Better Contact App",
  description: "A contact management solution focused on helping to grow your network and provide value to your relationships.",
  openGraph: {
    title: "Kind: Better Contact App",
    description: "A contact management solution focused on helping to grow your network and provide value to your relationships.",
    images: [
      {
        url: "/kind_logo_yellow_bg.png", // path relative to public/
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
          {/* ...other tags... */}
          <meta property="og:image" content="/kind_logo_yellow_bg.png" />
          <meta name="twitter:image" content="/kind_logo_yellow_bg.png" />
          <meta name="twitter:card" content="summary_large_image" />
        </head>
        <body className="flex flex-col min-h-screen h-full">
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <Link href="/contacts">
                <Button size="icon">
                  <Users />
                </Button>
              </Link>
              <UserButton />
            </SignedIn>
          </header>
          <main className="flex-1 p-4">{children}</main>
          <Toaster />
          <footer className="p-4 e md:p-8 lg:p-10 dark:bg-gray-800 bg-[#FFD700]">
            <div className="mx-auto max-w-screen-xl text-center">
              <div className="flex justify-center">
                <img src="/kind_logo_yellow_bg.png" alt="Kind Logo" width={100} height={100} />
              </div>
              <p className="my-6 text-black-500 font-bold text-2xl dark:text-gray-400">Contact Management with Purpose: Be Kind</p>
              <ul className="flex flex-wrap justify-center items-center mb-6 text-gray-900 dark:text-white">
                <li>
                  <a href="https://henryacastillo.com/" target="_blank" rel="noopener noreferrer" className="mr-4 hover:underline md:mr-6 ">About Henry</a>
                </li>
                <li>
                  <a href="#" className="mr-4 hover:underline md:mr-6">Contact</a>
                </li>
              </ul>
              <span className="text-sm text-black sm:text-center dark:text-gray-400">© 2025 <a href="#" className="hover:underline">Kind by Yeve</a>. All Rights Reserved.</span>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
