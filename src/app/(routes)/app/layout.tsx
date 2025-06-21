
import "@/app/globals.css";

import MobileNavigationBar from "@/components/MobileNavigationBar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen h-full">

      <main className="flex-1 p-4 mb-16">{children}</main>
      <MobileNavigationBar />

    </div>
  );
}
