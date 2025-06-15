"use client";

import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ChatMessages() {
  const { id } = useParams();
  const { messages } = useChat({ id: id as string || "default" });

  return <div className="flex-1 w-full max-w-4xl mx-auto p-4">
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div key={index} className={`p-4 rounded-lg ${message.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
          <div className="font-semibold">{message.role === "user" ? "You" : "AI"}</div>
          <div className="mt-2 whitespace-pre-wrap">{message.content}</div>
        </div>
      ))}
    </div>
  </div>
}