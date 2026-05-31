import { memo, useContext, useRef, useState } from "react";
import { Plus, Send, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { OrganizationsContext } from "@/features/organization/context/organization-context";
import { deleteImage, getImage, uploadImage } from "@/lib/supabase";
import { FilePreview } from "@/components/common/FilePreview";
import { cn } from "@/lib/utils";

interface RoomChatInputProps {
  locationId: number;
  value: string;
  onChange: (value: string) => void;
  onSend: (
    event: React.FormEvent | React.KeyboardEvent,
    attachments?: any[],
  ) => void;
}

export const RoomChatInput = memo<RoomChatInputProps>(
  ({ locationId, value, onChange, onSend }) => {
    const { t } = useTranslation();
    const { organization } = useContext(OrganizationsContext);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [attachments, setAttachments] = useState<any[]>([]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || !organization) return;

      const newAttachments: any[] = [];

      for (const file of Array.from(files)) {
        const path = `${organization.id}/locations/${locationId}/chat/${Date.now()}-${file.name}`;
        const uploadedPath = await uploadImage(file, path);
        if (!uploadedPath) continue;

        newAttachments.push({
          fileUrl: getImage(uploadedPath),
          fileType: file.type,
          fileName: file.name,
        });
      }

      setAttachments((prev) => [...prev, ...newAttachments]);
    };

    const onRemoveFile = async (index: number) => {
      await deleteImage(attachments[index].fileUrl);
      setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSend = (event: React.FormEvent | React.KeyboardEvent) => {
      onSend(event, attachments);
      setAttachments([]);
    };

    const canSend = value.trim().length > 0 || attachments.length > 0;

    return (
      <div className="px-6 py-4 bg-white border-t border-[#E8ECF1] shrink-0">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((file, index) => (
              <FilePreview
                key={index}
                fileName={file.fileName}
                onRemove={() =>
                  onRemoveFile(index).catch((err) => console.error(err))
                }
                loading={false}
              />
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-[#F1F5F9] rounded-2xl border border-[#E2E8F0] px-3 py-2 focus-within:border-[#2F80ED] focus-within:ring-1 focus-within:ring-[#2F80ED]/30 transition-all">
            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="w-5 h-5" />
            </button>

            <Input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileSelect}
            />

            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) handleSend(e);
                }
              }}
              placeholder={t("chat_message_placeholder")}
              className="flex-1 resize-none bg-transparent border-none outline-none text-[14px] text-[#1E293B] placeholder:text-[#94A3B8] max-h-28 min-h-[36px] py-1.5 text-start"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${Math.min(target.scrollHeight, 112)}px`;
              }}
            />

            <button
              type="button"
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors shrink-0"
            >
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <Button
            type="button"
            disabled={!canSend}
            onClick={handleSend}
            className={cn(
              "h-11 w-11 rounded-full p-0 shrink-0 shadow-none",
              canSend
                ? "bg-[#2F80ED] hover:bg-[#2563EB] text-white"
                : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed",
            )}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  },
);

RoomChatInput.displayName = "RoomChatInput";
