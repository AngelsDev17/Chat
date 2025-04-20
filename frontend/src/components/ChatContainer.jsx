import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { MessageSkeleton } from "./skeletons/MessageSkeleton";

export const ChatContainer = () => {
  const { selectedUser, messages, getMessages, isMessagesLoading } =
    useChatStore();

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex-col overflow-auto">
      <ChatHeader />
      <p>Messages...</p>
      <MessageInput />
    </div>
  );
};
