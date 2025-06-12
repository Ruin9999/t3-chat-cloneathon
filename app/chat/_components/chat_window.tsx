"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import CustomTextbox from "./custom_textbox";

export default function ChatWindow() {
  const { user } = useUser();
  const { chatId } = useParams();
  const messages = useQuery(api.messages.get, chatId && typeof chatId === "string" ? { chatId } : "skip");

  return <div className="flex-1 flex flex-col">
    <div className="flex-1">
      {messages?.length === 0 ? 
        <Greeting /> :
        messages?.map((message) => (
          <div key={message._id} className="p-4 border-b border-gray-200">
            <p className="text-gray-800">{typeof message.content === 'object' ? message.content.text : message.content}</p>
          </div>
        ))}

    </div>
    <CustomTextbox />
  </div>
}

function Greeting() {
  return <div className="flex-1 flex items-center justify-center text-gray-500">
    <p className="text-lg">Welcome to Huh. Start a new chat or select an existing one.</p>
  </div>;
}