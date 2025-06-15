import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexQueryCacheProvider  } from "convex-helpers/react/cache";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

import { Toaster } from "@/components/ui/sonner";
import CustomSidebar from "./_components/custom_sidebar";

export const metadata: Metadata = {
  title: "Huh.",
  description: "Connect and converse with AI models.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider>
          <ConvexClientProvider>
            <ConvexClientProvider>
              <SidebarProvider>
                <CustomSidebar />
                <main className="flex-1 flex">{children}</main>
                <Toaster />
              </SidebarProvider>
            </ConvexClientProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}