import React, { useEffect, useRef } from "react";
import { formatTime } from "../lib/utils";
import { BUSINESS_PHONE_NUMBER } from "../services/whatsappService";
import { REPLIES } from "../constants/replies";

export function ChatMessages({ messages, loading }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">Loading messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No messages yet</p>
      </div>
    );
  }

  // Build message list with virtual replies
  const displayMessages = [];
  messages.forEach((msg) => {
    displayMessages.push(msg);

    // If message has next_message_id, add virtual reply from REPLIES
    if (msg.current_message_id) {
      const replyMessage = REPLIES.find((r) => r.id === msg.current_message_id);
      if (replyMessage) {
        displayMessages.push({
          id: `virtual-${msg.id}-${msg.current_message_id}`,
          message: replyMessage.message,
          sender_id: BUSINESS_PHONE_NUMBER,
          created_at: msg.created_at,
          isVirtual: true,
        });
      }
    }
  });

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background to-primary/5">
      {displayMessages.map((msg) => {
        const isFromBusiness = msg.sender_id === BUSINESS_PHONE_NUMBER;

        return (
          <div
            key={msg.id}
            className={`flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              isFromBusiness ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-md hover:shadow-lg transition-shadow ${
                isFromBusiness
                  ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground"
                  : "bg-card border-2 border-border text-foreground"
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>
            <span className="text-xs text-muted-foreground mt-1.5">
              {formatTime(msg.created_at)}
            </span>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
