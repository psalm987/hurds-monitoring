import React, { useState } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Send, FileText } from "lucide-react";

export function ChatInput({ disabled, onSendMessage, onOpenTemplates }) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="border-t border-border bg-card p-4 shadow-lg">
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onOpenTemplates}
          title="Use Template"
          className="hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
        >
          <FileText className="h-5 w-5" />
        </Button>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={
            disabled ? "Auto-respond is enabled" : "Type a message..."
          }
          disabled={disabled}
          className="flex-1 h-12 text-base rounded-xl border-2 focus-visible:border-primary"
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !message.trim()}
          className="h-12 w-12 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
}
