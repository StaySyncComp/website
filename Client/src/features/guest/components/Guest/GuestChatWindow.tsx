import { useEffect, useRef, useState } from "react";
import { ArrowUp, Hotel } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import GuestChatRecommendations from "@/features/guest/components/Guest/GuestChatRecommendations";
import TypingBubble from "@/components/ui/TypingBubble";
import { useGuest } from "@/features/guest/hooks/useGuest";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GuestChatSkeleton } from "./GuestChatSkeleton";
import apiClient from "@/lib/api-client";

interface ChatMessage {
  text: string;
  sender: "user" | "bot";
}

// Loading Skeleton Component with smooth animations

// Welcome screen component
const WelcomeScreen = ({
  // @ts-ignore
  organization,
  // @ts-ignore
  recommendations,
  // @ts-ignore
  onRecommendationClick,
}) => (
  <motion.div
    className="h-full w-full mt-[10%] flex flex-col gap-6 px-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
    >
      <Avatar className="rounded-full size-32 flex items-center justify-center mx-auto">
        <AvatarImage
          className="size-36"
          src={organization?.logo}
          style={{ borderRadius: 40 }}
        />
        <AvatarFallback className="bg-sidebar-primary text-surface rounded-md">
          <Hotel className="size-10" />
        </AvatarFallback>
      </Avatar>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <p>ברוכים הבאים למרכז השירות של {organization?.name}!</p>
      <p className="font-semibold mt-1">נתקלתם בבעיה? אנחנו כאן לעזור</p>
    </motion.div>

    <motion.div
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
    >
      <p className="text-muted-foreground font-medium text-sm">הצעות</p>
      {/* @ts-ignore */}
      {recommendations.map((rec, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }}
          onClick={() => onRecommendationClick(rec.header)}
          className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 rounded-lg"
        >
          <GuestChatRecommendations header={rec.header} text={rec.text} />
        </motion.div>
      ))}
    </motion.div>
  </motion.div>
);

export default function GuestChatWindow() {
  const { organization, isOrganizationLoading } = useGuest();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>(() => uuidv4());
  const textAreaRef = useRef(null);

  const recommendations = [
    {
      header: "חסר מגבות",
      text: "בקש מהצוות שלנו מגבות",
    },
    {
      header: "לא עובד מזגן",
      text: "בקש מהצוות שלנו לתקן את המזגן",
    },
    {
      header: "באיזה שעה ארוחת הבוקר?",
      text: "בדוק את שעות ארוחת הבוקר שלנו",
    },
  ];

  useEffect(() => {
    return () => {
      setConversationId(uuidv4());
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const prompt = input.trim();
    setMessages((prev) => [...prev, { text: prompt, sender: "user" }]);
    setInput("");
    setIsLoading(true);

    const orgId = organization?.id;
    if (!orgId) {
      setMessages((prev) => [
        ...prev,
        { text: "לא ניתן לזהות את המלון. פתחו שוב את הקישור מהחדר.", sender: "bot" },
      ]);
      setIsLoading(false);
      return;
    }

    const res = await apiClient.post("/ai/request-guest", {
      prompt,
      organizationId: orgId,
      conversationId,
    });

    const botReply =
      res.data?.gemini_response ?? "מצטערת, לא הצלחתי להבין. נסה שוב.";
    console.log("Bot reply:", botReply);

    setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    setIsLoading(false);
  };

  const handleRecommendationClick = (recommendationText: string) => {
    setInput(recommendationText);
    // Focus the textarea after setting the input
    if (textAreaRef.current) {
      // @ts-ignore
      textAreaRef.current.focus();
    }
  };

  return (
    <div className="flex flex-col w-full h-dvh md:max-w-md md:h-[90vh] md:rounded-xl md:shadow-lg md:border bg-surface overflow-hidden">
      <AnimatePresence mode="wait">
        {/* Show loading skeleton while organization is loading */}
        {isOrganizationLoading ? (
          <GuestChatSkeleton key="loading" />
        ) : messages.length === 0 ? (
          <WelcomeScreen
            key="welcome"
            organization={organization}
            recommendations={recommendations}
            onRecommendationClick={handleRecommendationClick}
          />
        ) : (
          <motion.div
            key="chat-header"
            className="w-full border-b p-4 flex gap-3 items-center shadow-sm"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Avatar className="rounded-full size-10 flex items-center justify-center">
              <AvatarImage
                className="size-10"
                src={organization?.logo}
                style={{ borderRadius: 40 }}
              />
              <AvatarFallback className="bg-sidebar-primary text-surface rounded-md">
                <Hotel className="size-4" />
              </AvatarFallback>
            </Avatar>
            <p>
              מרכז השירות של מלון{" "}
              <span className="font-semibold">{organization?.name}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-sm">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col gap-1 ${
                msg.sender === "user" ? "self-end items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2.5 rounded-2xl shadow-sm w-fit whitespace-pre-line ${
                  msg.sender === "user"
                    ? "text-surface bg-accent rounded-bl-md"
                    : "bg-background rounded-br-md"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <TypingBubble />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className="p-3 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="כתוב הודעה..."
          className="w-full py-4 pt-4 px-4 pl-14 rounded-3xl duration-150 ease-in-out shadow-[0_1px_4px_0_rgba(0,0,0,0.16)]"
          autoExpand
          ref={textAreaRef}
        />
        <button
          onClick={handleSend}
          className="absolute top-[2.25rem] left-7 bg-background rounded-full p-1"
        >
          <ArrowUp className="w-4 h-4 text-muted-foreground" />
        </button>
      </motion.div>
    </div>
  );
}
