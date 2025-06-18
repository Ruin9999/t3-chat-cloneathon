"use client";

import { useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LogOut, CreditCard, BadgeCheck, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuGroup } from "@/components/ui/dropdown-menu";

export default function SidebarUser() {
  const { user } = useUser();
  const { isMobile } = useSidebar();

  if (!user) return <Button className="mb-2 py-5" onClick={() => redirect("/sign-in")}>Login</Button>

  return <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <Avatar className="size-8 rounded-full">
              <AvatarImage src={user?.imageUrl || ""} alt={user?.fullName || "User Avatar"} />
              <AvatarFallback className="text-xs">{user?.firstName?.[0] || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex flex-col text-left text-sm leading-tight">
              <span className="truncate font-medium">{user?.fullName || "User"}</span>
              <span className="truncate text-xs text-muted-foreground">{user?.emailAddresses?.[0]?.emailAddress || "Email Address"}</span>
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "top"}
          align="end"
          sideOffset={4}
        >
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => redirect("/settings")}>
              <Settings />
              <span className="ml-2">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={true}>
              <CreditCard />
              <span className="ml-2">Billing</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="group/logout">
            <LogOut className="text-red-500" />
            <span className="ml-2 text-red-500">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>
}