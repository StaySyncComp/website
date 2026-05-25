import { useState } from "react";
import ChatWindow from "./ChatWindow";
import { AnimatePresence } from "framer-motion";
import { AiOrb } from "@/features/ai-assistant/components/AiOrb";

export default function ChatbotLauncher() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="fixed bottom-6 rtl:left-6 ltr:right-6 z-50">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open AI assistant"
        className="size-12 rounded-full overflow-hidden p-0 border-0 bg-transparent shadow-lg ring-1 ring-black/5 hover:shadow-xl transition-shadow"
      >
        <AiOrb className="size-12" animated={false} />
      </button>

      <AnimatePresence mode="wait">
        {open && <ChatWindow key="chat-window" onClose={handleClose} />}
      </AnimatePresence>
    </div>
  );
}
