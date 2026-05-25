import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useOrganization } from "@/features/organization/hooks/useOrganization";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

function WhatsAppSettings() {
  const { t } = useTranslation();
  const { organization, updateOrganization, refetchOrganization } =
    useOrganization();
  const [phone, setPhone] = useState(
    organization?.twilioWhatsAppNumber ?? "",
  );
  const [enabled, setEnabled] = useState(organization?.whatsappEnabled ?? false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPhone(organization?.twilioWhatsAppNumber ?? "");
    setEnabled(organization?.whatsappEnabled ?? false);
  }, [organization?.twilioWhatsAppNumber, organization?.whatsappEnabled]);

  const handleSave = async () => {
    if (!organization?.id) return;
    setIsSubmitting(true);
    try {
      await updateOrganization({
        organizationId: organization.id,
        name: organization.name,
        twilioWhatsAppNumber: phone.replace(/\D/g, "") || null,
        whatsappEnabled: enabled,
      });
      await refetchOrganization();
      toast.success(t("whatsappSettings.saveSuccess", "נשמר בהצלחה"));
    } catch (err) {
      console.error(err);
      toast.error(t("whatsappSettings.saveError", "שגיאה בשמירה"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h2 className="font-semibold">
          {t("whatsappSettings.title", "WhatsApp (Twilio)")}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t(
            "whatsappSettings.hint",
            "מספר וואטסאפ של המלון ב-Twilio (ספרות בלבד, כולל קידומת מדינה). לאחר הגדרה, יופיע קישור וואטסאפ לכל חדר בטבלת המיקומים.",
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="whatsapp-enabled"
          checked={enabled}
          onCheckedChange={(v) => setEnabled(v === true)}
        />
        <Label htmlFor="whatsapp-enabled">
          {t("whatsappSettings.enabled", "הפעל שירות וואטסאפ לאורחים")}
        </Label>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="twilio-phone">
          {t("whatsappSettings.phoneLabel", "מספר Twilio WhatsApp (E.164)")}
        </Label>
        <Input
          id="twilio-phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="972501234567"
          dir="ltr"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {t(
          "whatsappSettings.webhookNote",
          "Webhook ב-Twilio: POST {API_URL}/webhooks/twilio/whatsapp",
        )}
      </p>

      <Button onClick={handleSave} disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("save")}
      </Button>
    </div>
  );
}

export default WhatsAppSettings;
