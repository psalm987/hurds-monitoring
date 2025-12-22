import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { BUSINESS_PHONE_NUMBER } from "../services/whatsappService";

// Hook to get unique phone numbers from messages
export function useContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();

    // Subscribe to new messages
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          fetchContacts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchContacts() {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("sender_id, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Get unique sender_ids with their latest message time
      const uniqueContacts = {};
      data.forEach((msg) => {
        if (
          !uniqueContacts[msg.sender_id] ||
          new Date(msg.created_at) >
            new Date(uniqueContacts[msg.sender_id].lastMessage)
        ) {
          uniqueContacts[msg.sender_id] = {
            phoneNumber: msg.sender_id,
            lastMessage: msg.created_at,
          };
        }
      });

      const contactsList = Object.values(uniqueContacts)
        .sort((a, b) => new Date(b.lastMessage) - new Date(a.lastMessage))
        .filter((contact) => contact.phoneNumber !== BUSINESS_PHONE_NUMBER);

      setContacts(contactsList);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  }

  return { contacts, loading, refetch: fetchContacts };
}

// Hook to get messages for a specific sender
export function useMessages(senderId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!senderId) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${senderId},receiver_id.eq.${senderId}`)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [senderId]);

  useEffect(() => {
    if (!senderId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    fetchMessages();

    // Subscribe to all message changes for this contact (INSERT, UPDATE, DELETE)
    // Listen for messages where contact is either sender or receiver
    const channel = supabase
      .channel(`messages-${senderId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          console.log("Realtime event received:", payload);
          const message = payload.new || payload.old;
          const isRelevant =
            message.sender_id === senderId || message.receiver_id === senderId;

          if (!isRelevant) {
            console.log("Message not relevant for this conversation");
            return;
          }

          if (payload.eventType === "INSERT") {
            console.log("Adding new message:", payload.new);
            setMessages((prev) => [...prev, payload.new]);
          } else if (payload.eventType === "UPDATE") {
            console.log("Updating message:", payload.new);
            setMessages((prev) =>
              prev.map((msg) => (msg.id === payload.new.id ? payload.new : msg))
            );
          } else if (payload.eventType === "DELETE") {
            console.log("Deleting message:", payload.old);
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [senderId, fetchMessages]);

  return { messages, loading, refetch: fetchMessages };
}

// Hook to manage auto-respond status
export function useAutoRespond(userId) {
  const [autoRespond, setAutoRespond] = useState(true);
  const [loading, setLoading] = useState(true);

  const updateAutoRespond = useCallback(
    async (value) => {
      if (!userId) return;

      try {
        const { data: existing } = await supabase
          .from("autoresponse")
          .select("id")
          .eq("user", userId)
          .single();

        if (existing) {
          const { error } = await supabase
            .from("autoresponse")
            .update({
              autorespond: value,
              last_updated: new Date().toISOString(),
            })
            .eq("user", userId);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("autoresponse")
            .insert({ user: userId, autorespond: value });

          if (error) throw error;
        }

        setAutoRespond(value);
      } catch (error) {
        console.error("Error updating auto-respond:", error);
      }
    },
    [userId]
  );

  useEffect(() => {
    if (!userId) {
      setAutoRespond(true);
      setLoading(false);
      return;
    }

    async function fetchAutoRespond() {
      try {
        const { data, error } = await supabase
          .from("autoresponse")
          .select("*")
          .eq("user", userId)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        if (data) {
          setAutoRespond(data.autorespond);
        } else {
          // Create default entry if none exists
          await updateAutoRespond(true);
        }
      } catch (error) {
        console.error("Error fetching auto-respond:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAutoRespond();

    // Subscribe to autoresponse changes
    const channel = supabase
      .channel("autoresponse-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "autoresponse",
          filter: `user=eq.${userId}`,
        },
        (payload) => {
          if (payload.new) {
            setAutoRespond(payload.new.autorespond);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, updateAutoRespond]);

  return { autoRespond, loading, updateAutoRespond };
}

// Function to save a message to the database
export async function saveMessage(
  senderId,
  message,
  currentMessageId,
  nextMessageId = null,
  receiverId = null
) {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        sender_id: senderId,
        message: message,
        current_message_id: currentMessageId,
        next_message_id: nextMessageId,
        receiver_id: receiverId,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}
