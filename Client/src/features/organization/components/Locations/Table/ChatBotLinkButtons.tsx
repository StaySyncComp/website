import { useState } from "react";
import { ExternalLink, Copy, Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Location } from "@/types/api/locations";
import { API_BASE_URL } from "@/lib/api-client";
import { useOrganization } from "@/features/organization/hooks/useOrganization";
import { buildRoomCode } from "@/lib/whatsapp/roomCode";

interface Props {
  location: Location;
}

function digitsOnly(phone: string) {
  return phone.replace(/\D/g, "");
}

export default function ChatBotLinkButtons({ location }: Props) {
  const { organization } = useOrganization();
  const [copiedWeb, setCopiedWeb] = useState(false);
  const [copiedWa, setCopiedWa] = useState(false);

  const webUrl =
    API_BASE_URL +
    `/ai/guest?organizationId=${organization?.id}&locationId=${location.id}`;

  const whatsappUrl =
    organization?.whatsappEnabled && organization?.twilioWhatsAppNumber
      ? `https://wa.me/${digitsOnly(organization.twilioWhatsAppNumber)}?text=${encodeURIComponent(
          buildRoomCode(organization.id, location.id),
        )}`
      : null;

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!webUrl) {
    return <div className="text-sm text-gray-400">No URL provided</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          onClick={() => window.open(webUrl, "_blank")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-accent rounded hover:bg-accent/80"
        >
          <ExternalLink className="w-3 h-3" />
          {"אתר"}
        </Button>
        <Button
          onClick={() => copyToClipboard(webUrl, setCopiedWeb)}
          variant="ghost"
          className={`inline-flex bg-background text-muted-foreground items-center gap-1.5 px-3 py-1.5 text-xs ${
            copiedWeb && "text-green-700 bg-green-100"
          }`}
        >
          {copiedWeb ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copiedWeb ? "הועתק" : "העתק אתר"}
        </Button>
      </div>

      {whatsappUrl && (
        <div className="flex gap-2">
          <Button
            onClick={() => window.open(whatsappUrl, "_blank")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700"
          >
            <MessageCircle className="w-3 h-3" />
            WhatsApp
          </Button>
          <Button
            onClick={() => copyToClipboard(whatsappUrl, setCopiedWa)}
            variant="ghost"
            className={`inline-flex bg-background text-muted-foreground items-center gap-1.5 px-3 py-1.5 text-xs ${
              copiedWa && "text-green-700 bg-green-100"
            }`}
          >
            {copiedWa ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedWa ? "הועתק" : "העתק WA"}
          </Button>
        </div>
      )}
    </div>
  );
}
