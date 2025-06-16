"use client";

import { toast } from "sonner";
import DOMPurify from "dompurify";
import { useUser } from "@clerk/nextjs";
import { useConvex } from "convex/react";
import { CONSTANTS } from "@/lib/constants";
import { Message, useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useEnter } from "@/hooks/use_enter";
import { api } from "@/convex/_generated/api";
import { useModels } from "@/hooks/use_models";
import { Doc } from "@/convex/_generated/dataModel";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import { Textarea } from "@/components/ui/textarea";
import ChatTextboxButtons from "./chat_textbox_buttons";

export default function ChatTextbox() {
  const user = useUser();
  const convex = useConvex();
  const { id: chatId } = useParams<{ id: string }>();
  const { groupedModels, onGroupedModelsChange } = useModels();
  const [ selectedModel, setSelectedModel ] = useState<Doc<"models"> | null>(null);
  
  const { status, input, handleInputChange, setMessages, handleSubmit, stop, reload } = useChat({
    id: chatId || CONSTANTS.DEFAULT_CHAT_ID,
    body: { selectedModel: selectedModel?.id || null },
    onError: () => toast.error("Something went wrong. Please try again later or choose a different model.", { action: { label: "Retry", onClick: () => reload() } }),
    onFinish: handleChatFinish,
  });
  
  const currentChatId = chatId || CONSTANTS.DEFAULT_CHAT_ID;
  const isReadyToSubmit = status === "ready" && input.trim().length > 0;
  const isStreaming = status === "streaming";

  async function createMessage({ messageId, content, sender }: { messageId: string; content: string; sender: string }) {
    const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "code"] });
    return convex.mutation(api.messages.create, {
      chatId: currentChatId,
      messageId: messageId,
      content: sanitizedContent,
      sender: sender,
      avatarUrl: user?.user?.imageUrl || CONSTANTS.DEFAULT_AVATAR_URL,
      model: selectedModel?.id || "",
      type: "text",
    })
  }

  async function handleChatFinish(message: Message) {
    await createMessage({
      messageId: message.id,
      content: message.content,
      sender: user?.user?.id || "User",
    })
  }

  async function submitNewUserMessage() {
    if (!isReadyToSubmit) return;
    await createMessage({
      messageId: crypto.randomUUID(),
      content: input,
      sender: user?.user?.id || "DELETE_ME",
    })
    handleSubmit();
  }

  async function handleSubmitClick() {
    if (isReadyToSubmit) submitNewUserMessage();
    else if (isStreaming) stop();
  }

  useEnter(submitNewUserMessage);
  onGroupedModelsChange((models) => setSelectedModel(models["Google"]?.[0] || null));

  // Handling loading of previous chat messages
  useEffect(() => {
    async function loadMessages() {
      if (!chatId) return;
      const messages = await convex.query(api.messages.get, { chatId });
      const formattedMessages = messages.map((message) => ({
        id: message.messageId,
        content: message.content,
        role: message.sender === "assistant" ? "assistant" as const : "user" as const,
      }));
      setMessages(formattedMessages);
    }
    loadMessages();
  }, [chatId, convex, setMessages])

  return <div className="relative w-full max-w-4xl mx-auto m-4 rounded-lg border">
    <Textarea
      value={input}
      onChange={handleInputChange}
      placeholder="Type your message here..."
      className="min-h-[50px] max-h-[500px] resize-none border-0 shadow-none rounded-lg focus-visible:ring-0 transition-all duration-200 ease-in-out"
    />

    <div className="p-2">
      <ChatTextboxButtons
        generationStatus={status}
        isSubmittable={isReadyToSubmit}
        models={groupedModels}
        selectedModel={selectedModel}
        onSelectedModelChange={setSelectedModel}
        onWebSearch={() => toast("Web search is not implemented yet.")}
        onFileUpload={() => toast("File upload is not implemented yet.")}
        onMicClick={() => toast("Voice input is not implemented yet.")}
        onSubmit={handleSubmitClick}
      />
    </div>
  </div>
}