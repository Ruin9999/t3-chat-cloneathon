"use client"

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useRef, useState, useEffect } from "react";
import { useConvex, useMutation } from "convex/react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Mic, Send, Globe, Paperclip, Bot, Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export default function CustomTextbox() {
  const convex = useConvex();
  
  const [models, setModels] = useState<Doc<"models">[] | null>(null);
  const [selectedModel, setSelectedModel] = useState<Doc<"models"> | null>(null);
  const [message, setMessage] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { convex.query(api.models.get).then(setModels) }, [convex]); //TODO: Reduce and group.

  return <div className="w-full max-w-4xl mx-auto p-4">
    <div className="relative border border-input rounded-lg bg-background shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        disabled={isDisabled}
        className="min-h-[100px] max-h-[300px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-4 pb-16"
      />

      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isPopoverOpen}
                className="w-[200px] justify-between h-8 text-xs"
                disabled={isDisabled}
              >
                <div className="flex items-center space-x-2">
                  <span className="truncate">{selectedModel?.name || "Select model..."}</span>
                </div>
                <ChevronsUpDown className="size-3 ml-2 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
              <Command>
                <CommandInput placeholder="Search models..." className="h-8" />
                <CommandEmpty>No model found.</CommandEmpty>
                <CommandList>
                  { models?.map((model) => {
                    return <CommandItem
                      key={model._id}
                      value={`${model.name} ${model.category}`}  
                      className="text-xs"
                      onSelect={() => {
                        setSelectedModel(model);
                        setIsPopoverOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <Bot className="size-4 mr-2" />
                        <span>{model.name}</span>
                      </div>
                      <Check className={cn("size-4 ml-auto", selectedModel?._id === model._id ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  })}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          
          {/* Web search and file attachment buttons */}
          <Button variant="outline" size="sm" className="h-8 px-3 text-xs" disabled={isDisabled} onClick={() => { /* Handle web search */ }}>
            <Globe className="size-3" />
            <span className="ml-1">Search</span>
          </Button>
          <Button variant="ghost" size="sm" className="size-8 p-0" disabled={isDisabled} onClick={() => { /* Handle file attachment */ }}>
            <Paperclip className="size-4" />
          </Button>
        </div>

        {/* Voice and send buttons */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" disabled={isDisabled} onClick={() => { /* Handle mic click */ }}>
            <Mic className="size-4" />
          </Button>
          <Button variant="default" size="sm" disabled={isDisabled || !message.trim()} onClick={() => { /* Handle file attachment */ }}>
            <Send className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
}