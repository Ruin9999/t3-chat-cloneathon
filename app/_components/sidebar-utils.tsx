"use client"

import { cn } from "@/lib/utils"
import { SidebarGroup, useSidebar } from "@/components/ui/sidebar"
import { Button, buttonVariants } from "@/components/ui/button"
import { Plus, PanelLeft } from "lucide-react"
import Link from "next/link"

export default function SidebarUtils() {
  const { toggleSidebar, state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarGroup className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => toggleSidebar()}>
          <PanelLeft className="size-4" />
        </Button>
        <Link href="/" className={cn("text-2xl font-bold transition-opacity", "group-data-[collapsible=icon]:hidden")}>
          Huh.
        </Link>
      </div>

      <Button
        variant="default"
        size={isCollapsed ? "icon" : "sm"}
        className={cn("flex items-center", isCollapsed ? "size-8" : "w-full")}
        onClick={() => window.location.href = "/"}
      >
        <Plus className="size-4 shrink-0" />
        <span className="flex-1 flex items-center text-left group-data-[collapsible=icon]:hidden">New Chat</span>
      </Button>
    </SidebarGroup>
  )
}
