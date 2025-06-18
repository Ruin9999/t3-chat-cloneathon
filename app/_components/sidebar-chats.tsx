"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

import { SidebarGroup, SidebarGroupLabel } from "@/components/ui/sidebar";
import ChatButton from "./sidebar-chat-button";

export default function SidebarChats() {
  const { user } = useUser();
  const chats = useQuery(api.chats.get, user?.id ? { user: user.id } : "skip");

  return <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel className="flex items-center justify-between h-fit pb-1">
        Recent Chats
      </SidebarGroupLabel>
      { chats?.length ? chats.map((chat) => <ChatButton key={chat._id} id={chat._id} title={chat.title || ""} />) : <p className="text-sm px-2">No chats</p> }
    </SidebarGroup>
}