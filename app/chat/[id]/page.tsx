"use client";

import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";

import ChatTextbox from "../_components/chat_textbox";
import { SidebarInset } from "@/components/ui/sidebar";
import ChatBubble from "../_components/chat_bubble";

export default function ChatPage() {
  const { id } = useParams();
  const { messages } = useChat({ id: id as string || "default" });

  return <SidebarInset className="flex-1 flex flex-col">
    <div className="flex-1 flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="w-full max-w-4xl mx-auto space-y-4 p-4 pt-7 pb-36">
          {messages.map((message, index) => (
            <ChatBubble 
              key={index} 
              {...message}
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <ChatTextbox />
      </div>
    </div>
  </SidebarInset>
}