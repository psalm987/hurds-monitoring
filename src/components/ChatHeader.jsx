import React from "react";
import { Toggle } from "./ui/Toggle";
import { formatPhoneNumber } from "../lib/utils";

export function ChatHeader({ phoneNumber, autoRespond, onAutoRespondChange }) {
  return (
    <div className="h-16 border-b border-border bg-linear-to-r from-card via-card to-primary/5 px-6 flex items-center justify-between shadow-sm">
      <div>
        {phoneNumber ? (
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {formatPhoneNumber(phoneNumber)}
            </h2>
            <p className="text-xs text-muted-foreground">Active conversation</p>
          </div>
        ) : (
          <h2 className="text-lg font-semibold text-muted-foreground">
            Select a conversation
          </h2>
        )}
      </div>
      {phoneNumber && (
        <div className="flex items-center gap-3 bg-accent/50 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-foreground">
            Auto-respond
          </span>
          <Toggle checked={autoRespond} onCheckedChange={onAutoRespondChange} />
        </div>
      )}
    </div>
  );
}
