"use client"

import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";

import Link from "next/link"
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarChatButton } from "./sidebar-chat-button";
import { LogOut, CreditCard, Settings, PanelLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar, Sidebar, SidebarHeader, SidebarTrigger, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarGroupLabel } from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuGroup } from "@/components/ui/dropdown-menu";

export default function CustomSidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { state, isMobile, toggleSidebar } = useSidebar();
  const chats = useQuery(api.chats.get);

  return <Sidebar collapsible="icon">
    <SidebarHeader>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => toggleSidebar()}>
          <PanelLeft className="size-4" />
        </Button>
        <Link href="/" className={cn("text-2xl font-bold transition-opacity", "group-data-[collapsible=icon]:hidden")}>
          Huh.
        </Link>
      </div>
    </SidebarHeader>
    <SidebarContent className="flex flex-col px-2">
      {/* New Chat button */}
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          size={state === "collapsed" ? "icon" : "sm"}
          className={cn("flex items-center", state === "collapsed" ? "size-8" : "w-full")}
          onClick={() => redirect("/")}
        >
          <Plus className="size-4 shrink-0" />
          <span className="flex-1 flex items-center text-left group-data-[collapsible=icon]:hidden">New Chat</span>
        </Button>
      </div>
      <SidebarGroup className="px-0">
        <SidebarGroupLabel className="h-fit pb-2">Recent Chats</SidebarGroupLabel>
        <SidebarGroupContent>
          {/* Scrollable content area */}
          <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            { chats?.length ? chats.map((chat) => <SidebarChatButton key={chat._id} {...chat} />) : <p className="text-sm px-2">No chats</p> }
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
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
          <DropdownMenuItem className="group/logout" onClick={async () => { await signOut(); redirect('/');}}>
            <LogOut className="text-red-500" />
            <span className="ml-2 text-red-500">Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  </Sidebar>
}