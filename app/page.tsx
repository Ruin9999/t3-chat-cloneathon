"use client"

import ChatTextbox from "./chat/_components/chat_textbox"

export default function Main() {
  return <div className="flex-1 flex flex-col items-center justify-center">
    <div className="space-x-2">
      <span className="font-bold text-5xl">Huh.</span>
      <span className="text-3xl">what shall we do today?</span>
    </div>
    <ChatTextbox />
  </div>
}