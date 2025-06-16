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
  const [ isWebSearchToggled, setIsWebSearchToggled ] = useState(false);
  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { status, input, handleInputChange, setMessages, handleSubmit, stop, reload } = useChat({
    id: chatId || CONSTANTS.DEFAULT_CHAT_ID,
    body: {
      selectedModel: selectedModel?.id || null,
      isWebSearchToggled: isWebSearchToggled,
    },
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
      sender: selectedModel?.id || "assistant",
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
        // role: message.sender === "assistant" ? "assistant" as const : "user" as const,
        role: message.sender.includes("user") ? "user" as const : "assistant" as const,
      }));
      setMessages(formattedMessages);
    }
    loadMessages();
  }, [chatId, convex, setMessages])

  // Handling speech recognition transcript updates
  useEffect(() => {
    if (transcript) {
      handleInputChange({
        target: { value: input + transcript }
      } as React.ChangeEvent<HTMLTextAreaElement>);
      resetTranscript();
    }
  }, [transcript, input, handleInputChange, resetTranscript]);

  return <div className="relative w-full max-w-4xl mx-auto m-4 rounded-lg border  bg-background/20 backdrop-blur-md">
    <Textarea
      value={input}
      onChange={handleInputChange}
      placeholder="Type your message here..."
      className="min-h-[50px] max-h-[500px] resize-none border-0 shadow-none rounded-lg focus-visible:ring-0 transition-all duration-200 ease-in-out bg-inherit dark:bg-transparent placeholder:text-muted-foreground"
    />

    <div className="p-2">
      <ChatTextboxButtons
        generationStatus={status}
        isSubmittable={isReadyToSubmit}
        models={groupedModels}
        selectedModel={selectedModel}
        onSelectedModelChange={setSelectedModel}
        isWebSearchToggled={isWebSearchToggled}
        onWebSearch={() => setIsWebSearchToggled(prev => !prev)}
        onFileUpload={() => toast("File upload is not implemented yet.")}
        onMicClick={() => { if (listening) SpeechRecognition.stopListening(); else SpeechRecognition.startListening({ continuous: true, language: "en-US" }) }}
        isMicEnabled={browserSupportsSpeechRecognition}
        isMicListening={listening}
        onSubmit={handleSubmitClick}
      />
    </div>
  </div>
}