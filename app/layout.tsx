import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { ConvexQueryCacheProvider } from "convex-helpers/react/cache";

import { Toaster } from "@/components/ui/sonner";
import CustomSidebar from "./_components/custom_sidebar";

export const metadata: Metadata = {
  title: "Huh.",
  description: "Connect and converse with AI models.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ClerkProvider>
          <ConvexClientProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <SidebarProvider>
                  <CustomSidebar />
                  <main className="flex-1 flex h-screen">{children}</main>
                  <Toaster />
                </SidebarProvider>
              </ThemeProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}