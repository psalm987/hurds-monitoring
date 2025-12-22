import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ChatHeader } from "./components/ChatHeader";
import { ChatMessages } from "./components/ChatMessages";
import { ChatInput } from "./components/ChatInput";
import { TemplateDrawer } from "./components/TemplateDrawer";
import { useMessages, useAutoRespond, saveMessage } from "./hooks/useSupabase";
import {
  sendTextMessage,
  BUSINESS_PHONE_NUMBER,
} from "./services/whatsappService";
import "./index.css";

function App() {
  const [selectedContact, setSelectedContact] = useState(null);
  const [templateDrawerOpen, setTemplateDrawerOpen] = useState(false);

  const { messages, loading: messagesLoading } = useMessages(selectedContact);
  const { autoRespond, updateAutoRespond } = useAutoRespond(selectedContact);

  async function handleSendMessage(message) {
    if (!selectedContact) return;
    try {
      const result = await sendTextMessage(selectedContact, message);

      // Save the sent message to the database
      // Business is sender, selected contact is receiver
      const currentMessageId = result.messages?.[0]?.id || `msg_${Date.now()}`;
      await saveMessage(
        BUSINESS_PHONE_NUMBER,
        message,
        currentMessageId,
        null,
        selectedContact
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message");
    }
  }

  function handleAutoRespondToggle(value) {
    updateAutoRespond(value);
  }

  return (
    <div className="h-screen flex bg-background">
      <Sidebar
        selectedContact={selectedContact}
        onSelectContact={setSelectedContact}
      />
      <div className="flex-1 flex flex-col">
        <ChatHeader
          phoneNumber={selectedContact}
          autoRespond={autoRespond}
          onAutoRespondChange={handleAutoRespondToggle}
        />
        {selectedContact ? (
          <>
            <ChatMessages messages={messages} loading={messagesLoading} />
            <ChatInput
              disabled={!autoRespond}
              onSendMessage={handleSendMessage}
              onOpenTemplates={() => setTemplateDrawerOpen(true)}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background">
            <div className="text-center space-y-4 p-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                HURDS Monitoring App
              </h2>
              <p className="text-muted-foreground text-lg">
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
      <TemplateDrawer
        open={templateDrawerOpen}
        onClose={() => setTemplateDrawerOpen(false)}
        recipientPhone={selectedContact}
      />
    </div>
  );
}

export default App;
