import ChatTextbox from "../_components/chat_textbox";
import ChatMessages from "../_components/chat_messages";

export default function ChatPage() {
  return <div className="flex-1">
    <ChatMessages />
    <ChatTextbox />
  </div>
}