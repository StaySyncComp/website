import { useEffect, useState } from "react";
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
  NoteExpiryOption,
  RoomNote,
  RoomNoteColor,
  UpdateRoomNoteInput,
  expiryOptionToDays,
} from "@/features/cleaning/types/roomModal";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface EditNotesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notes: RoomNote[];
  onSave: (noteId: number, input: UpdateRoomNoteInput) => Promise<void>;
  onDelete: (noteId: number) => Promise<void>;
}

const colorOptions: { value: RoomNoteColor; className: string }[] = [
  { value: "yellow", className: "bg-[#FFFBEB] border-[#FDE68A]" },
  { value: "green", className: "bg-[#ECFDF5] border-[#A7F3D0]" },
  { value: "blue", className: "bg-[#EFF6FF] border-[#BFDBFE]" },
];

const expiryOptions: { value: NoteExpiryOption; labelKey: string }[] = [
  { value: "never", labelKey: "note_expiry_never" },
  { value: "1d", labelKey: "note_expiry_1d" },
  { value: "1w", labelKey: "note_expiry_1w" },
  { value: "1m", labelKey: "note_expiry_1m" },
];

const inferExpiryOption = (note: RoomNote | undefined): NoteExpiryOption => {
  if (!note?.expiresAt) return "never";
  const diffDays = Math.ceil(
    (new Date(note.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  if (diffDays <= 1) return "1d";
  if (diffDays <= 7) return "1w";
  if (diffDays <= 30) return "1m";
  return "1w";
};

export function EditNotesDialog({
  open,
  onOpenChange,
  notes,
  onSave,
  onDelete,
}: EditNotesDialogProps) {
  const { t } = useTranslation();
  const staffNotes = notes.filter((n) => n.type === "staff");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [color, setColor] = useState<RoomNoteColor>("yellow");
  const [expiry, setExpiry] = useState<NoteExpiryOption>("never");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedNote = staffNotes.find((n) => n.id === selectedId);

  useEffect(() => {
    if (selectedNote) {
      setContent(selectedNote.content);
      setColor(selectedNote.color);
      setExpiry(inferExpiryOption(selectedNote));
    }
  }, [selectedNote]);

  useEffect(() => {
    if (open && staffNotes.length > 0 && !selectedId) {
      setSelectedId(staffNotes[0].id);
    }
    if (!open) setSelectedId(null);
  }, [open, staffNotes, selectedId]);

  const handleSave = async () => {
    if (!selectedId || !content.trim()) return;
    setIsSubmitting(true);
    try {
      const days = expiryOptionToDays(expiry);
      await onSave(selectedId, {
        content: content.trim(),
        color,
        ...(days === null
          ? { clearExpiry: true }
          : { expiresInDays: days, clearExpiry: false }),
      });
      toast.success(t("note_updated"));
    } catch {
      toast.error(t("note_update_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsSubmitting(true);
    try {
      await onDelete(selectedId);
      setSelectedId(null);
      toast.success(t("note_deleted"));
      if (staffNotes.length <= 1) onOpenChange(false);
    } catch {
      toast.error(t("note_delete_failed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("edit_notes")}</DialogTitle>
        </DialogHeader>

        {staffNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t("no_notes_to_edit")}
          </p>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {staffNotes.map((note) => (
                <button
                  key={note.id}
                  type="button"
                  onClick={() => setSelectedId(note.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border",
                    selectedId === note.id
                      ? "border-[#2F80ED] bg-[#EFF6FF] text-[#2F80ED]"
                      : "border-[#E2E8F0] bg-white text-[#64748B]",
                  )}
                >
                  {note.content.slice(0, 24)}
                  {note.content.length > 24 ? "..." : ""}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <Label>{t("note_content")}</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
        )}

        <DialogFooter className="gap-2">
          {selectedId && (
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              <Trash2 className="w-4 h-4 me-1" />
              {t("delete")}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          {staffNotes.length > 0 && (
            <Button
              onClick={handleSave}
              disabled={!content.trim() || isSubmitting}
            >
              {t("save")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
