"use client"

import { useChat } from "@ai-sdk/react"
import { useMutation } from "convex/react"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useEnter } from "@/hooks/use-enter"
import { useModels } from "@/hooks/use-models"
import { Doc } from "@/convex/_generated/dataModel"

import { Textarea } from "@/components/ui/textarea"
import ChatTextboxButtons from "./chat_textbox_buttons"

export default function ChatTextbox() {
  const { id } = useParams<{ id: string }>();
  const groupedModels = useModels();
  const [selectedModel, setSelectedModel] = useState<Doc<"models"> | null>(null);
  const { input, status, handleInputChange, handleSubmit, stop, messages } = useChat({ id: id || "default", body: { selectedModel: selectedModel?.id || null}});
  useEnter(() => { if (status === "ready" && input.trim().length > 0) handleSubmit(); }); // Submitting logic for keyboard, the logic for the button itself is below.

  useEffect(() => {
    setSelectedModel(groupedModels["OpenAI"]?.[0] || null);
  }, [groupedModels]);

  return <div className="relative w-full max-w-4xl mx-auto p-4">
    {messages.map(m => (
      <div key={m.id} className="whitespace-pre-wrap">
      <strong>{m.role === 'user' ? 'User: ' : 'AI: '}</strong>
      {m.content}
      </div>
    ))}
    <div className="relative">
      <Textarea
        value={input}
        onChange={handleInputChange}
        placeholder="Type your message here..."
        className="min-h-[100px] max-h-[300px] resize-none pb-16"
      />
      <div className="absolute bottom-2 left-2 right-2">
        <ChatTextboxButtons
          generationStatus={status}
          isSubmittable={input.trim().length > 0}
          models={groupedModels}
          selectedModel={selectedModel}
          onSelectedModelChange={setSelectedModel}
          onWebSearch={() => console.log("Web search clicked")}
          onFileUpload={() => console.log("File upload clicked")}
          onMicClick={() => console.log("Mic clicked")}
          onSubmit={() => {
            if (status === "ready" && input.trim().length > 0) handleSubmit();
            else if (status === "streaming") stop();
          }}
        />
      </div>

    </div>
    
  </div>
}