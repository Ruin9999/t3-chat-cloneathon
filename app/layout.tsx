import type { Metadata } from "next";
import "./globals.css";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";

export const metadata: Metadata = {
  title: "Chat Forge",
  description: "Connect and converse with AI models.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <html lang="en">
          <body className={`antialiased`}>
            <SidebarProvider>
              {children}
            </SidebarProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
