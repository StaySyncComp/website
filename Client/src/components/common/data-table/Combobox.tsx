import * as React from "react";
import { Check, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRTL } from "@/hooks/useRtl";
import { useNestedOverlayContainer } from "@/contexts/nestedOverlayContext";

interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  className?: string;
  popoverClassName?: string;
  searchPlaceholder?: string;
  multiple?: boolean;
  maxSelectedDisplay?: number;
  disabled?: boolean;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  className,
  popoverClassName,
  searchPlaceholder = "חיפוש...",
  multiple = false,
  maxSelectedDisplay = 2,
  disabled = false,
}: ComboboxProps) {
  const { textAlign, isRtl } = useRTL();
  const nestedOverlayContainer = useNestedOverlayContainer();
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (!disabled) setOpen(isOpen);
  };

  // Ensure value is always array if multiple
  const selectedValues = React.useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    return typeof value === "string" && value ? [value] : [];
  }, [value, multiple]);

  const selectedOptions = React.useMemo(() => {
    return options.filter((opt) => selectedValues.includes(opt.value));
  }, [options, selectedValues]);

  const displayText = React.useMemo(() => {
    if (selectedOptions.length === 0) return placeholder;

    if (!multiple) return selectedOptions[0]?.label || placeholder;

    if (selectedOptions.length <= maxSelectedDisplay) {
      return selectedOptions.map((opt) => opt.label).join(", ");
    }

    return `${selectedOptions
      .slice(0, maxSelectedDisplay)
      .map((opt) => opt.label)
      .join(", ")} +${selectedOptions.length - maxSelectedDisplay}`;
  }, [selectedOptions, placeholder, multiple, maxSelectedDisplay]);

  const handleSelect = (selectedValue: string) => {
    if (disabled) return;

    if (!multiple) {
      const newValue = selectedValue === value ? "" : selectedValue;
      onChange(newValue);
      setOpen(false);
    } else {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(selectedValue)
        ? currentValues.filter((v) => v !== selectedValue)
        : [...currentValues, selectedValue];
      onChange(newValues);
    }
  };

  const handleRemoveTag = (valueToRemove: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (multiple && Array.isArray(value)) {
      const newValues = value.filter((v) => v !== valueToRemove);
      onChange(newValues);
    }
  };

  const isSelected = (optionValue: string) =>
    selectedValues.includes(optionValue);

  const preventNestedDismiss = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (
      target.closest('[role="combobox"]') ||
      target.closest("[data-radix-popper-content-wrapper]") ||
      target.closest("[cmdk-input-wrapper]") ||
      target.closest("[cmdk-list]") ||
      nestedOverlayContainer?.contains(target)
    ) {
      event.preventDefault();
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full min-w-[200px] border justify-between h-auto min-h-[44px] px-4 py-3 text-sm font-medium rounded-full bg-white transition-all duration-200 ease-in-out",
            open
              ? "border-blue-500 ring-2 ring-blue-500/20 shadow-lg"
              : "hover:border-blue-300 hover:bg-blue-50/50",
            disabled
              ? "opacity-60 cursor-not-allowed bg-gray-100 border-gray-200"
              : "",
            className,
          )}
        >
          <div className="flex items-center justify-between w-full gap-2">
            <div className={`flex-1 min-w-0 overflow-hidden ${textAlign}`}>
              {multiple && selectedOptions.length > 0 ? (
                <div className="flex flex-wrap gap-1 justify-start">
                  {selectedOptions
                    .slice(0, maxSelectedDisplay)
                    .map((option) => (
                      <span
                        key={option.value}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-md max-w-[200px]"
                      >
                        <span className="truncate">{option.label}</span>
                        {!disabled && (
                          <button
                            type="button"
                            onClick={(e) => handleRemoveTag(option.value, e)}
                            className="hover:bg-blue-200 rounded-full p-0.5 flex-shrink-0"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  {selectedOptions.length > maxSelectedDisplay && (
                    <span className="text-gray-500 text-xs font-medium px-2 py-1 flex-shrink-0">
                      +{selectedOptions.length - maxSelectedDisplay}
                    </span>
                  )}
                </div>
              ) : (
                <span
                  className={cn(
                    "block truncate",
                    selectedOptions.length > 0
                      ? "text-gray-900"
                      : "text-gray-500",
                  )}
                  title={displayText}
                >
                  {displayText}
                </span>
              )}
            </div>
            <ChevronLeft
              className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                isRtl ? "rotate-0" : "rotate-180",
                open ? " text-blue-500" : "text-gray-400",
                open && isRtl && "-rotate-90",
                open && !isRtl && "rotate-270",
                disabled ? "text-gray-300" : "",
              )}
            />
          </div>
        </Button>
      </PopoverTrigger>

      {!disabled && (
        <PopoverContent
          container={nestedOverlayContainer ?? undefined}
          className={cn(
            "w-[var(--radix-popover-trigger-width)] p-0 border-2 border-gray-200 rounded-xl shadow-2xl bg-white/95 backdrop-blur-md animate-in fade-in-0 zoom-in-95 slide-in-from-top-2",
            nestedOverlayContainer && "z-[70]",
            popoverClassName,
          )}
          align="start"
          onOpenAutoFocus={(event) => event.preventDefault()}
          onCloseAutoFocus={(event) => event.preventDefault()}
          onFocusOutside={preventNestedDismiss}
          onPointerDownOutside={preventNestedDismiss}
          onInteractOutside={preventNestedDismiss}
        >
          <Command className="rounded-xl">
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList className="max-h-64 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <CommandEmpty className="py-8 text-center text-sm text-gray-500 font-medium">
                לא נמצאו תוצאות
              </CommandEmpty>
              <CommandGroup className="p-2">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={`${option.label} ${option.value}`}
                    onSelect={() => handleSelect(option.value)}
                    className="relative px-4 py-3 text-sm font-medium cursor-pointer rounded-lg mb-1 last:mb-0 transition-all duration-150 ease-in-out"
                  >
                    <div className="flex items-center justify-between w-full gap-3 min-w-0">
                      <Check
                        className={cn(
                          "h-4 w-4 flex-shrink-0 transition-all duration-200",
                          isSelected(option.value)
                            ? "opacity-100 text-blue-600 scale-100"
                            : "opacity-0 scale-75",
                        )}
                      />
                      <span
                        className={`flex-1 min-w-0 break-words ${textAlign}`}
                        title={option.label}
                      >
                        {option.label}
                      </span>
                    </div>
                    {isSelected(option.value) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-blue-600/10 rounded-lg -z-10" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      )}
    </Popover>
  );
}
