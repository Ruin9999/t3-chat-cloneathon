import "./globals.css";
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ConvexQueryCacheProvider  } from "convex-helpers/react/cache";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";

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
            <ConvexClientProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
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
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}