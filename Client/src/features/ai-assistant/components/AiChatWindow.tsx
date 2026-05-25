import { useCallback, useState, useEffect } from "react";
import { AiOrb } from "./AiOrb";
import { WelcomeHeader } from "./WelcomeHeader";
import { SuggestedPrompts } from "./SuggestedPrompts";
import { ChatInput } from "./ChatInput";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { promptAdmin } from "@/features/guest/api/microservice";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/features/guest/components/ChatWindow";
import { AiMessagesList } from "./AiMessagesList";

/**
 * AiChatWindow Component
 *
 * Main AI chat interface with a beautiful blue/glass design.
 * Features:
 * - Transparent container
 * - Glassmorphism effects
 * - Modern typography and gradients
 */
export function AiChatWindow() {
  const auth = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => uuidv4());

  // Suggested prompts data
  const suggestedPrompts = [
    "אני רוצה רשימה של החדרים המלוכלים",
    "אני רוצה לפתוח פניה חדשה",
    "מי העובד שפתר הכי הרבה פניות?",
    "איזה פניות בדרך כלל נתקעות הכי הרבה זמן?",
    "מהו החדר עם הכי הרבה תקלות חוזרות מה אפשר לעשות בשביל לפתור את הבעיה לצמיתות?",
  ];

  useEffect(() => {
    return () => {
      setConversationId(uuidv4());
    };
  }, []);

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      // Optimistic update
      setMessages((prev) => [
        ...prev,
        {
          text: message,
          sender: "user",
        },
      ]);
      setIsLoading(true);

      try {
        const response = await promptAdmin({
          prompt: message,
          conversationId: conversationId,
        });

        const botReply =
          // @ts-expect-error - Response type might be loose
          response?.data?.gemini_response ??
          "מצטערת, לא הצלחתי להבין. נסה שוב.";

        setMessages((prev) => [
          ...prev,
          {
            text: botReply,
            sender: "bot",
          },
        ]);
      } catch (error) {
        console.error("Error getting response:", error);
        setMessages((prev) => [
          ...prev,
          { text: "אירעה שגיאה. נסה שוב מאוחר יותר.", sender: "bot" },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId],
  );

  const handlePromptClick = useCallback(
    (prompt: string) => {
      handleSendMessage(prompt);
    },
    [handleSendMessage],
  );

  const handleAttachment = useCallback(() => {
    console.log("Attachment button clicked");
    // TODO: Implement file attachment logic
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div
      className={`min-h-fit h-[80vh] justify-between  flex flex-col relative overflow-hidden transition-all duration-500 ease-in-out mt-2`}
    >
      {/* Background Ambience - Optional, but adds depth */}
      {/* {!hasMessages && (
        <div className="absolute bottom-0 inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        </div>
      )} */}

      {!hasMessages ? (
        <div className="w-full text-center flex flex-col justify-between max-w-4xl mx-auto z-10">
          {/* Welcome View */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative">
              <AiOrb animated />
            </div>
            <div className="text-white drop-shadow-md">
              <WelcomeHeader
                userName={`ערב טוב ${auth.user?.name || "אורח"}`}
                statusText="איך אוכל לעזור?"
              />
            </div>
          </div>
        </div>
      ) : (
        /* Chat View */
        <div className="w-full max-w-5xl mx-auto flex-1 overflow-hidden flex flex-col h-[calc(100vh-100px)] z-10">
          <AiMessagesList
            messages={messages}
            isLoading={isLoading}
            userName={auth.user?.name || ""}
          />
        </div>
      )}

      {/* Input Area */}
      <div
        className={`w-full max-w-3xl mx-auto z-20 transition-all duration-500 space-y-6`}
      >
        {!hasMessages && (
          <div className="max-w-3xl mx-auto w-full">
            <SuggestedPrompts
              prompts={suggestedPrompts}
              onPromptClick={handlePromptClick}
            />
          </div>
        )}
        <ChatInput
          onSend={handleSendMessage}
          onAttach={handleAttachment}
          placeholder="שאל הכל או בקש שיעורים..."
        />
      </div>
    </div>
  );
}
