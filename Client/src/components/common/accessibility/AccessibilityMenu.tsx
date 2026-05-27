import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { GetTextDirection } from "@/lib/i18n";
import "@/app/styles/accessibility.css";

interface AccessibilityMenuProps {
  onClose: () => void;
}

interface AccessibilitySettings {
  fontSize: "small" | "medium" | "large";
  highContrast: boolean;
  cursorLarge: boolean;
  highlightLinks: boolean;
  readableDesign: boolean;
  stopAnimations: boolean;
  keyboardOnly: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: "medium",
  highContrast: false,
  cursorLarge: false,
  highlightLinks: false,
  readableDesign: false,
  stopAnimations: false,
  keyboardOnly: false,
};

export default function AccessibilityMenu({ onClose }: AccessibilityMenuProps) {
  const { t } = useTranslation();
  const dir = GetTextDirection();

  const handleFontSizeChange = (size: "small" | "medium" | "large") => {
    document.documentElement.style.fontSize = {
      small: "14px",
      medium: "16px",
      large: "18px",
    }[size];
    saveSettings({ fontSize: size });
  };

  const toggleClass = (className: string, enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add(className);
    } else {
      document.documentElement.classList.remove(className);
    }
  };

  const handleToggle = (
    setting: keyof AccessibilitySettings,
    className: string
  ) => {
    const currentValue = getSettings()[setting] as boolean;
    const newValue = !currentValue;
    toggleClass(className, newValue);
    saveSettings({ [setting]: newValue });
  };

  const getSettings = (): AccessibilitySettings => {
    const saved = localStorage.getItem("accessibility-settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  };

  const saveSettings = (updates: Partial<AccessibilitySettings>) => {
    const current = getSettings();
    const newSettings = { ...current, ...updates };
    localStorage.setItem("accessibility-settings", JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    localStorage.setItem(
      "accessibility-settings",
      JSON.stringify(defaultSettings)
    );
    document.documentElement.style.fontSize = "16px";
    [
      "high-contrast",
      "cursor-large",
      "highlight-links",
      "readable-design",
      "stop-animations",
      "keyboard-navigation-only",
    ].forEach((className) => {
      document.documentElement.classList.remove(className);
    });
  };

  useEffect(() => {
    const settings = getSettings();
    if (settings.fontSize !== "medium") {
      handleFontSizeChange(settings.fontSize);
    }
    toggleClass("high-contrast", settings.highContrast);
    toggleClass("cursor-large", settings.cursorLarge);
    toggleClass("highlight-links", settings.highlightLinks);
    toggleClass("readable-design", settings.readableDesign);
    toggleClass("stop-animations", settings.stopAnimations);
    toggleClass("keyboard-navigation-only", settings.keyboardOnly);
  }, []);

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-full rtl:left-0 ltr:right-0 mb-3 w-80 bg-surface dark:bg-gray-800 rounded-lg shadow-xl p-4 max-h-[80vh] overflow-y-auto text-start"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-surface">
          {t("accessibility.title")}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4">
        {/* Font Size Controls */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t("accessibility.fontSize")}
          </h4>
          <div className="flex gap-2">
            <button
              onClick={() => handleFontSizeChange("small")}
              className="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              {t("accessibility.small")}
            </button>
            <button
              onClick={() => handleFontSizeChange("medium")}
              className="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              {t("accessibility.medium")}
            </button>
            <button
              onClick={() => handleFontSizeChange("large")}
              className="px-3 py-1 text-sm rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
            >
              {t("accessibility.large")}
            </button>
          </div>
        </div>

        {/* Toggle Controls */}
        <div className="space-y-2">
          <button
            onClick={() => handleToggle("highContrast", "high-contrast")}
            className="w-full px-4 py-2 text-sm text-start rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            {t("accessibility.toggleHighContrast")}
          </button>

          <button
            onClick={() => handleToggle("cursorLarge", "cursor-large")}
            className="w-full px-4 py-2 text-sm text-start rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            {t("accessibility.toggleLargeCursor")}
          </button>

          <button
            onClick={() => handleToggle("highlightLinks", "highlight-links")}
            className="w-full px-4 py-2 text-sm text-start rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            {t("accessibility.toggleHighlightLinks")}
          </button>

          <button
            onClick={() => handleToggle("readableDesign", "readable-design")}
            className="w-full px-4 py-2 text-sm text-start rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            {t("accessibility.toggleReadableDesign")}
          </button>

          <button
            onClick={() => handleToggle("stopAnimations", "stop-animations")}
            className="w-full px-4 py-2 text-sm text-start rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            {t("accessibility.toggleStopAnimations")}
          </button>

          <button
            onClick={() =>
              handleToggle("keyboardOnly", "keyboard-navigation-only")
            }
            className="w-full px-4 py-2 text-sm text-start rounded bg-blue-100 hover:bg-blue-200 text-blue-700"
          >
            {t("accessibility.toggleKeyboardOnly")}
          </button>
        </div>

        {/* Reset and Statement Links */}
        <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={resetSettings}
            className="w-full px-4 py-2 text-sm text-start rounded bg-red-100 hover:bg-red-200 text-red-700 mb-2"
          >
            {t("accessibility.resetSettings")}
          </button>

          <a
            href="/accessibility-statement"
            className="block w-full px-4 py-2 text-sm text-start rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            {t("accessibility.viewStatement")}
          </a>
        </div>
      </div>
    </motion.div>
  );
}
