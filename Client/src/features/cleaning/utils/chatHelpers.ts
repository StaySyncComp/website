import { Message } from "@/types/ui/chat.types";
import { User } from "@/types/api/user";

export const normalizeLocationMessage = (raw: any): Message => ({
  id: raw.id,
  content: raw.content ?? undefined,
  createdAt: raw.createdAt,
  user: raw.user,
  CallMessageAttachment:
    raw.LocationMessageAttachment ?? raw.CallMessageAttachment ?? [],
});

export const isHotelMessage = (
  messageUser: User,
  currentUserId?: number,
) => {
  if (currentUserId && messageUser.id === currentUserId) return true;
  return messageUser.userType === "EMPLOYEE" || messageUser.userType === "EMPLOYER";
};

export const formatChatTime = (iso: string, locale: string) =>
  new Date(iso).toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export const formatChatDateLabel = (iso: string, locale: string) =>
  new Date(iso).toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

export const groupMessagesByDate = (
  messages: Message[],
  locale: string,
) => {
  const groups: { dateKey: string; label: string; messages: Message[] }[] = [];

  for (const message of messages) {
    const dateKey = new Date(message.createdAt).toDateString();
    const existing = groups.find((group) => group.dateKey === dateKey);

    if (existing) {
      existing.messages.push(message);
    } else {
      groups.push({
        dateKey,
        label: formatChatDateLabel(message.createdAt, locale),
        messages: [message],
      });
    }
  }

  return groups;
};

export const getGuestInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
