import { memo, useState } from "react";
import { FileText, Lightbulb, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { RoomColumnLayout } from "./RoomColumnLayout";
import {
  CreateRoomNoteInput,
  RoomNote,
  UpdateRoomNoteInput,
} from "@/features/cleaning/types/roomModal";
import { CreateNoteDialog } from "./CreateNoteDialog";
import { EditNotesDialog } from "./EditNotesDialog";
import { formatTimeOnly } from "@/features/cleaning/utils/drawerHelpers";

const noteStyles = {
  blue: "bg-[#EFF6FF] text-[#1E3A8A]",
  yellow: "bg-[#FFFBEB] text-[#92400E]",
  green: "bg-[#ECFDF5] text-[#065F46]",
};

interface RoomNotesColumnProps {
  showDivider?: boolean;
  notes: RoomNote[];
  isLoading?: boolean;
  onCreateNote: (input: CreateRoomNoteInput) => Promise<void>;
  onUpdateNote: (noteId: number, input: UpdateRoomNoteInput) => Promise<void>;
  onDeleteNote: (noteId: number) => Promise<void>;
}

const formatExpiryLabel = (
  expiresAt: string,
  t: (key: string, opts?: Record<string, unknown>) => string,
) => {
  const date = new Date(expiresAt);
  return t("note_expires_on", {
    date: date.toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  });
};

export const RoomNotesColumn = memo<RoomNotesColumnProps>(
  ({
    showDivider = true,
    notes,
    isLoading,
    onCreateNote,
    onUpdateNote,
    onDeleteNote,
  }) => {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    return (
      <>
        <RoomColumnLayout
          showDivider={showDivider}
          icon={<FileText className="w-[18px] h-[18px] text-[#64748B]" />}
          title={t("room_notes")}
          footer={
            <div className="flex items-center justify-between gap-3">
              <Button
                onClick={() => setCreateOpen(true)}
                className="h-10 px-4 rounded-xl bg-[#2F80ED] hover:bg-[#2563EB] text-white font-semibold text-sm gap-1.5 shadow-none"
              >
                <Plus className="w-4 h-4" />
                {t("create_note")}
              </Button>
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#1E293B] font-medium transition-colors whitespace-nowrap"
              >
                <Pencil className="w-3.5 h-3.5" />
                {t("edit_notes")}
              </button>
            </div>
          }
        >
          <div className="space-y-2.5 pb-2">
            {isLoading ? (
              <p className="text-sm text-[#94A3B8] text-center py-4">...</p>
            ) : notes.length === 0 ? (
              <p className="text-[13px] text-[#94A3B8] text-center py-4">
                {t("no_notes")}
              </p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className={`rounded-xl p-3.5 text-[13px] leading-relaxed text-start ${noteStyles[note.color]}`}
                >
                  <p>{note.content}</p>
                  {note.type === "ai" ? (
                    <div className="flex items-center gap-1.5 mt-2.5 font-semibold text-[#2F80ED]">
                      <Lightbulb className="w-3.5 h-3.5" />
                      {t("smart_assistant")}
                    </div>
                  ) : (
                    <div className="text-[11px] mt-2 opacity-75 text-end space-y-0.5">
                      <p>
                        {formatTimeOnly(note.createdAt)} |{" "}
                        {note.createdBy?.name || t("front_desk")}
                      </p>
                      {note.expiresAt && (
                        <p>{formatExpiryLabel(note.expiresAt, t)}</p>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </RoomColumnLayout>

        <CreateNoteDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={onCreateNote}
        />
        <EditNotesDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          notes={notes}
          onSave={onUpdateNote}
          onDelete={onDeleteNote}
        />
      </>
    );
  },
);

RoomNotesColumn.displayName = "RoomNotesColumn";
