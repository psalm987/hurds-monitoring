import React, { useState, useEffect } from "react";
import { Drawer } from "./ui/Drawer";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import {
  getMessageTemplates,
  parseTemplateComponents,
  buildTemplateComponents,
  sendTemplateMessage,
  formatTemplateContent,
  BUSINESS_PHONE_NUMBER,
} from "../services/whatsappService";
import { saveMessage } from "../hooks/useSupabase";
import { supabase } from "../lib/supabase";

export function TemplateDrawer({ open, onClose, recipientPhone }) {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  async function loadTemplates() {
    setLoading(true);
    try {
      const templateList = await getMessageTemplates();
      const approvedTemplates = templateList.filter(
        (t) => t.status === "APPROVED"
      );
      setTemplates(approvedTemplates);
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleTemplateSelect(template) {
    setSelectedTemplate(template);
    const fields = parseTemplateComponents(template);
    setFormFields(fields);
    setFormData({});
  }

  function handleFormChange(fieldId, value) {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  }

  async function handleSendTemplate() {
    if (!selectedTemplate || !recipientPhone) return;
    setSending(true);
    try {
      const components = buildTemplateComponents(formFields, formData);
      await sendTemplateMessage(
        recipientPhone,
        selectedTemplate.name,
        selectedTemplate.language,
        components
      );

      // Save the template message to the database
      // Business is sender, recipient is receiver
      const messageContent = formatTemplateContent(selectedTemplate, formData);

      // Get the last valid message ID from this conversation
      const { data: lastMessage } = await supabase
        .from("messages")
        .select("current_message_id")
        .or(`sender_id.eq.${recipientPhone},receiver_id.eq.${recipientPhone}`)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      await saveMessage(
        BUSINESS_PHONE_NUMBER,
        messageContent,
        lastMessage?.current_message_id,
        null,
        recipientPhone
      );

      setSelectedTemplate(null);
      setFormData({});
      onClose();
    } catch (error) {
      console.error("Failed to send template:", error);
      alert("Failed to send template message");
    } finally {
      setSending(false);
    }
  }

  function handleBack() {
    setSelectedTemplate(null);
    setFormData({});
  }

  return (
    <Drawer open={open} onClose={onClose} title="Message Templates">
      {loading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading templates...</p>
        </div>
      ) : !selectedTemplate ? (
        <div className="space-y-3">
          {templates.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground font-medium">
                No templates available
              </p>
            </div>
          ) : (
            templates.map((template) => (
              <button
                key={template.name}
                onClick={() => handleTemplateSelect(template)}
                className="w-full p-5 border-2 border-border rounded-xl hover:border-primary hover:bg-accent transition-all duration-200 text-left group shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                      {template.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {template.category}
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="-ml-2 hover:text-primary transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to templates
          </Button>
          <div className="p-5 bg-accent/50 rounded-xl border-l-4 border-l-primary">
            <h3 className="font-bold text-lg text-foreground mb-1">
              {selectedTemplate.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedTemplate.category}
            </p>
          </div>
          {formFields.length > 0 ? (
            <div className="space-y-5">
              <h4 className="font-semibold text-foreground">
                Fill in the details:
              </h4>
              {formFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-semibold mb-2 text-foreground">
                    {field.label}
                  </label>
                  <Input
                    type={field.type}
                    value={formData[field.id] || ""}
                    onChange={(e) => handleFormChange(field.id, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className="h-11 border-2 focus-visible:border-primary"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              This template has no variables to fill.
            </p>
          )}
          <Button
            onClick={handleSendTemplate}
            disabled={sending}
            className="w-full h-12 text-base font-semibold shadow-md hover:shadow-lg transition-all"
          >
            {sending ? "Sending..." : "Send Template"}
          </Button>
        </div>
      )}
    </Drawer>
  );
}
