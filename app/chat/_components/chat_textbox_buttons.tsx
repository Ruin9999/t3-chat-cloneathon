"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Doc } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Mic, Send, Globe, Paperclip, Bot, Check, ChevronsUpDown, Loader, Square } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface ChatTextboxButtonProps {
  // Model selection props
  models: Record<string, Doc<"models">[]>;
  selectedModel: Doc<"models"> | null;
  onSelectedModelChange: (model: Doc<"models"> | null) => void;

  // Button state props
  isSubmittable?: boolean;
  generationStatus?: "submitted" | "streaming" | "ready" | "error";

  // Event handlers
  onWebSearch: () => void;
  onFileUpload: () => void;
  onMicClick: () => void;
  onSubmit: () => void;
}

export default function ChatTextboxButtons(props: ChatTextboxButtonProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const {
    models,
    selectedModel,
    isSubmittable,
    generationStatus,
    onSelectedModelChange,
    onWebSearch,
    onFileUpload,
    onMicClick,
    onSubmit,
  } = props;

  const renderSubmitIcon = () => {
    switch (generationStatus) {
      case "submitted":
        return <Loader className="size-4 animate-spin" />;
      case "streaming":
        return <Square className="size-4 fill-black" />;
      case "ready":
        return <Send className="size-4" />;
      case "error":
        return <Square className="size-4 fill-red-500" />;
    }
  };

  return <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2 text-xs">
      {/* Model selection popover */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isPopoverOpen}
            className="w-[200px] justify-between h-8 text-xs"
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
              {Object.entries(models).map(([category, models]) => (
                <CommandGroup key={category} heading={category}>
                  {models.map((model) => (
                    <CommandItem
                      key={model._id}
                      value={`${model.name} ${model.category}`}
                      className="text-xs"
                      disabled={!model.enabled}
                      onSelect={() => {
                        onSelectedModelChange(model);
                        setIsPopoverOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-2 flex-1">
                        <Bot className="size-4 mr-2" />
                        <span>{model.name}</span>
                      </div>
                      <Check className={cn("size-4 ml-auto", selectedModel?._id === model._id ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Web search and file attachment buttons */}
      <Button variant="outline" size="sm" className="h-8 px-3 text-xs" onClick={onWebSearch}>
        <Globe className="size-3" />
        <span className="ml-1">Search</span>
      </Button>
      <Button variant="ghost" size="sm" className="size-8 p-0" onClick={onFileUpload}>
        <Paperclip className="size-4" />
      </Button>
    </div>

    {/* Voice and send buttons */}
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" onClick={onMicClick}>
        <Mic className="size-4" />
      </Button>
      <Button variant="default" size="sm" disabled={(generationStatus != "ready" && generationStatus !== "streaming") || (generationStatus === "ready" && !isSubmittable)} onClick={onSubmit}>
        {renderSubmitIcon()}
      </Button>
    </div>
  </div>
}

