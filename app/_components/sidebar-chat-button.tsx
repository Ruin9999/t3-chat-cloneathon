"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Pin, Trash2, Share } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";

interface SidebarChatButtonProps {
  id: string
  title: string
  className?: string
}

export function SidebarChatButton(props: SidebarChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return <ContextMenu>
    <ContextMenuTrigger asChild>
      <Button
        variant="ghost"
        asChild
        className={cn("group relative flex items-center gap-3 py-2 h-auto justify-start overflow-hidden", props.className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/chat/${props.id}`}>
          <span className="text-sm font-medium flex-1 truncate">{ props.title }</span>
          
          {/* <div className={cn("absolute right-2 flex items-center gap-2 transition-all duration-200 ease-in-out bg-background px-2 py-1 rounded-lg", isHovered ? "opacity-100" : "opacity-0")}>
            <div className="group/pin">
              <Pin className="size-4 text-gray-400 group-hover/pin:text-muted-foreground transition-colors" />
            </div>
            <div className="group/trash">
              <Trash2 className="size-4 text-red-400 group-hover/trash:text-red-600 transition-colors cursor-pointer" />
            </div>
          </div> */}
        </Link>
      </Button>
    </ContextMenuTrigger>
    <ContextMenuContent className="w-48">
      <ContextMenuItem className="flex items-center gap-2">
        <ExternalLink className="size-4" />
        <Link href={`/chat/${props.id}`} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </Link>
      </ContextMenuItem>
      <ContextMenuItem className="flex items-center gap-2" onClick={() => navigator.clipboard.writeText(window.location.origin + `/chat/${props.id}`)}>
        <Share className="size-4" />
        Share
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem className="flex items-center gap-2">
        <Edit3 className="size-4" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem className="flex items-center gap-2">
        <Pin className="size-4" />
        Pin
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem className="flex items-center gap-2 text-red-500 focus:text-red-500">
        <Trash2 className="size-4 text-red-500" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
}