import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AccessibilityIcon from "@/assets/icons/AccessibilityIcon";
import AccessibilityMenu from "./AccessibilityMenu";

export default function AccessibilityLauncher() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="size-12 shadow-lg rounded-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-surface ring-1 ring-black/5 hover:shadow-xl transition-shadow"
        aria-label="Open accessibility menu"
      >
        <AccessibilityIcon className="w-6 h-6" />
      </button>

      <AnimatePresence mode="wait">
        {open && (
          <AccessibilityMenu key="accessibility-menu" onClose={handleClose} />
        )}
      </AnimatePresence>
    </div>
  );
}
