"use client"

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { a11yLight, a11yDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";

import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import SyntaxHighlighter from "react-syntax-highlighter";

interface CustomCodeBlockProps {
  className?: string,
  children?: React.ReactNode | React.ReactNode[],
  inline?: boolean,
}

export function CustomCodeBlock(props: CustomCodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const { className, children, inline } = props;
  const [isCopied, setIsCopied] = useState(false);

  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  async function handleCopyClick() {
    await navigator.clipboard.writeText(children?.toString() || "");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  if (!inline && match) return <div className="relative group/code">
    <Button
      size="sm"
      variant="secondary"
      className="absolute right-1 top-1 size-8 p-0 opacity-0 group-hover/code:opacity-100 transition-opacity"
      onClick={handleCopyClick}
    >
      {isCopied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
    </Button>
    <SyntaxHighlighter
      style={resolvedTheme === "dark" ? a11yDark :  a11yLight}
      language={match[1]}
      PreTag="div"
      className="rounded-md"
    >
      {codeString}
    </SyntaxHighlighter>
  </div>
  
  return <code {...props}>
    {children}
  </code>
}