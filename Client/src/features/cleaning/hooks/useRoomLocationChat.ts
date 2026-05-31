import { useEffect, useState } from "react";
import api from "@/lib/api-client";
import { Message } from "@/types/ui/chat.types";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useRoomMessageHandling } from "@/hooks/useRoomChat";
import { normalizeLocationMessage } from "@/features/cleaning/utils/chatHelpers";

export const useRoomLocationChat = (locationId: number) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { newMessage, setNewMessage, handleSendMessage } =
    useRoomMessageHandling(locationId, user, setMessages);

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(`/locations/${locationId}/messages`);
        const normalized = (response.data as any[]).map(normalizeLocationMessage);
        setMessages(normalized);
      } catch (error) {
        console.error("Error fetching location messages:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [locationId]);

  return {
    messages,
    isLoading,
    newMessage,
    setNewMessage,
    handleSendMessage,
    currentUser: user,
  };
};
