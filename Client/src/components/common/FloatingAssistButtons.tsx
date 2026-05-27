import AccessibilityLauncher from "@/components/common/accessibility/AccessibilityLauncher";
import ChatbotLauncher from "@/features/guest/components/ChatBotLauncher";

export default function FloatingAssistButtons() {
  return (
    <div className="fixed bottom-6 rtl:left-6 ltr:right-6 z-50 flex flex-col items-center gap-3">
      <AccessibilityLauncher />
      <ChatbotLauncher />
    </div>
  );
}
