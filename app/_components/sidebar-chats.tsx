"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import ChatButton from "./sidebar-chat-button";

export default function SidebarChats() {
  const { user } = useUser();
  const chats = useQuery(api.chats.get, user?.id ? { user: user.id } : "skip");

  return <SidebarGroup>
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between">
        Recent Chats
        <Button
          variant="ghost"
          size="sm"
          className="size-6 p-0 hover:cursor-pointer"
        >
          <Plus className="size-4" />
          <span className="sr-only">New Chat</span>
        </Button>
      </SidebarGroupLabel>
      { chats?.length ? chats.map((chat) => <ChatButton key={chat._id} id={chat._id} title={chat.title} />) : null }
    </SidebarGroup>
  </SidebarGroup>
}