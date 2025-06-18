"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { useDraggable } from "@dnd-kit/core";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, Edit3, Pin, Trash2, Share } from "lucide-react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, ContextMenuSeparator } from "@/components/ui/context-menu";

interface SidebarChatButtonProps extends Doc<"chats"> {
  className?: string
}

export function SidebarChatButton(props: SidebarChatButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const deleteChat = useMutation(api.chats.deleteChat);
  const togglePin = useMutation(api.chats.toggleChatPin);

  return <ContextMenu>
    <ContextMenuTrigger asChild>
      <Button
        variant="ghost"
        asChild
        className={cn("group relative flex items-center gap-3 py-2 h-auto justify-start overflow-hidden", props.className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/chat/${props._id}`}>
          <span className="text-sm font-medium flex-1 truncate">{ props.title }</span>
        </Link>
      </Button>
    </ContextMenuTrigger>
    <ContextMenuContent className="w-48">
      <ContextMenuItem className="flex items-center gap-2">
        <ExternalLink className="size-4" />
        <Link href={`/chat/${props._id}`} target="_blank" rel="noopener noreferrer">
          Open in new tab
        </Link>
      </ContextMenuItem>
      <ContextMenuItem className="flex items-center gap-2" onClick={() => navigator.clipboard.writeText(window.location.origin + `/chat/${props._id}`)}>
        <Share className="size-4" />
        Share
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem className="flex items-center gap-2">
        <Edit3 className="size-4" />
        Rename
      </ContextMenuItem>
      <ContextMenuItem className="flex items-center gap-2" onClick={() => togglePin({ chatId: props._id })}>
        <Pin className={cn("size-4", props.pinned && "fill-current")}/>
        {props.pinned ? "Unpin" : "Pin"}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem className="flex items-center gap-2 text-red-500 focus:text-red-500" onClick={() => deleteChat({ chatId: props._id })}>
        <Trash2 className="size-4 text-red-500" />
        Delete
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
}