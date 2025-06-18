"use client"

import { Message } from "ai";
import { cn } from "@/lib/utils";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CustomReactMarkdown } from "../../../components/react-markdown/custom_react_markdown";
import { Copy, Edit, RotateCcw, GitBranch, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

export default function ChatBubble(props: Message) {
  const isUser = props.role === "user";
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(false);

  async function handleCopyClick() {
    await navigator.clipboard.writeText(props.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return <div className="flex flex-col group relative">
    <div className={cn("rounded-md p-4", isUser ? "bg-accent ml-auto max-w-3/4" : "w-full")}>
      <CustomReactMarkdown>
        {props.content}
      </CustomReactMarkdown>
    </div>

    {/* Icons section */}
    <div className={cn(
      "flex items-center gap-1 mx-2 my-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
      isUser ? "justify-end" : "justify-start"
    )}>
      {isUser ? (<>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <RotateCcw className="size-4" />
              <span className="sr-only">Retry</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-sm">Retry</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="size-8 p-0" onClick={handleCopyClick}>
              {isCopied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-sm">{isCopied ? "Copied!" : "Copy"}</p>            
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="size-8 p-0" onClick={() => setIsEditing(true)}>
              <Edit className="size-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-sm">Edit</p>            
          </TooltipContent>
        </Tooltip>
      </>) : (<>
        <Tooltip>
          <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="size-8 p-0">
            <RotateCcw className="size-4" />
            <span className="sr-only">Retry</span>
          </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-sm">Retry</p>            
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="size-8 p-0" onClick={handleCopyClick}>
              {isCopied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-sm">{isCopied ? "Copied!" : "Copy"}</p>            
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="size-8 p-0">
              <GitBranch className="size-4" />
              <span className="sr-only">Branch</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-sm">Branch</p>            
          </TooltipContent>
        </Tooltip>
        <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {props.annotations?.[0] && typeof props.annotations[0] === 'object' && 'sender' in props.annotations[0] && (props.annotations[0] as any).sender} 
        </p>
      </>)}
    </div>
  </div>
}