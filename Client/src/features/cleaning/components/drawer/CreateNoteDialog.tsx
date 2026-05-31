import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import {
  CreateRoomNoteInput,
  NoteExpiryOption,
  RoomNoteColor,
  expiryOptionToDays,
} from "@/features/cleaning/types/roomModal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateRoomNoteInput) => Promise<void>;
}

const colorOptions: { value: RoomNoteColor; className: string }[] = [
  { value: "yellow", className: "bg-[#FFFBEB] border-[#FDE68A]" },
  { value: "green", className: "bg-[#ECFDF5] border-[#A7F3D0]" },
];

const expiryOptions: { value: NoteExpiryOption; labelKey: string }[] = [
  { value: "never", labelKey: "note_expiry_never" },
  { value: "1d", labelKey: "note_expiry_1d" },
  { value: "1w", labelKey: "note_expiry_1w" },
  { value: "1m", labelKey: "note_expiry_1m" },
];

export function CreateNoteDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateNoteDialogProps) {
  const { t } = useTranslation();
  const [content, setContent] = useState("");
  const [color, setColor] = useState<RoomNoteColor>("yellow");
  const [expiry, setExpiry] = useState<NoteExpiryOption>("never");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reset = () => {
    setContent("");
    setColor("yellow");
    setExpiry("never");
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        color,
        expiresInDays: expiryOptionToDays(expiry),
      });
      reset();
      onOpenChange(false);
      toast.success(t("note_created"));
    } catch {
      toast.error(t("note_create_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("create_note")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("note_content")}</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={t("note_content_placeholder")}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("note_color")}</Label>
            <div className="flex gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={cn(
                    "h-10 flex-1 rounded-lg border-2 transition-all",
                    option.className,
                    color === option.value &&
                      "ring-2 ring-[#2F80ED] ring-offset-1",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("note_expiry")}</Label>
            <div className="grid grid-cols-2 gap-2">
              {expiryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setExpiry(option.value)}
                  className={cn(
                    "h-10 rounded-lg border text-sm font-medium transition-all",
                    expiry === option.value
                      ? "border-[#2F80ED] bg-[#EFF6FF] text-[#2F80ED]"
                      : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]",
                  )}
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
          >
            {t("create_note")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
