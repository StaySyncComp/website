import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { getInfoPagePublicUrl } from "@/features/organization/api/infoPage";

interface Props {
  organizationId: number;
  isPublished: boolean;
}

export default function InfoPageSharePanel({
  organizationId,
  isPublished,
}: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const publicUrl = getInfoPagePublicUrl(organizationId);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = publicUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="border border-border rounded-lg p-6 bg-surface space-y-4">
      <div>
        <h3 className="font-semibold text-lg">{t("info_page_share_title")}</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("info_page_share_description")}
        </p>
      </div>

      {!isPublished && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          {t("info_page_not_published_hint")}
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-sm font-medium text-muted-foreground">
            {t("info_page_public_url")}
          </label>
          <div className="flex gap-2 flex-wrap">
            <code className="flex-1 min-w-0 text-sm bg-background border rounded-md px-3 py-2 break-all">
              {publicUrl}
            </code>
            <Button type="button" variant="outline" size="sm" onClick={copyUrl}>
              {copied ? (
                <Check className="w-4 h-4 ml-1" />
              ) : (
                <Copy className="w-4 h-4 ml-1" />
              )}
              {copied ? t("copied") : t("copy")}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!isPublished}
              onClick={() => window.open(publicUrl, "_blank")}
            >
              <ExternalLink className="w-4 h-4 ml-1" />
              {t("info_page_view_live")}
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 shrink-0">
          <span className="text-sm font-medium text-muted-foreground">
            {t("info_page_qr_code")}
          </span>
          <div
            className={`p-3 bg-white rounded-lg border ${!isPublished ? "opacity-40" : ""}`}
          >
            <QRCodeSVG value={publicUrl} size={140} level="M" />
          </div>
        </div>
      </div>
    </div>
  );
}
