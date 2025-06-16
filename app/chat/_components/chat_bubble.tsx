"use client"

import { Message } from "ai";
import { cn } from "@/lib/utils";
import { useState } from "react";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import { Copy, Edit, RotateCcw, GitBranch, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@radix-ui/react-tooltip";

export default function ChatBubble(props: Message) {
  const isUser = props.role === "user";
  const [ isCopied, setIsCopied ] = useState(false);

  async function handleCopyClick() {
    await navigator.clipboard.writeText(props.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return <div className="flex flex-col group relative">
    <div className={cn("rounded-md p-4", isUser ? "bg-accent ml-auto w-3/4" : "w-full")}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        className="prose prose-sm dark:prose-invert max-w-none"
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
        }}
      >
        {props.content}
      </ReactMarkdown>
    </div>

    {/* Icons section */}
    <div className={cn(
      "flex items-center gap-1 px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
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
            <Button variant="ghost" size="sm" className="size-8 p-0">
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
        <span className="text-sm text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {props.role}
        </span>
      </>)}
    </div>
  </div>
}