import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import "@/app/globals.css";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from 'next/link';
import MobileNavigationBar from "@/components/MobileNavigationBar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen h-full">
      <header className="flex justify-end items-center p-4 gap-4 h-16">
        <SignedOut>
          <SignInButton />
          <SignUpButton />
        </SignedOut>
        <SignedIn>
        
          
        </SignedIn>
      </header>
      <main className="flex-1 p-4 mb-16">{children}</main>
      <MobileNavigationBar />
      
    </div>
  );
}
