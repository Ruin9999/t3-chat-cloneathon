"use client";

import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ChatMessages() {
  const [isUserScrolled, setIsUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  
}