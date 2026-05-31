import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { CheckInGuestPayload } from "@/features/cleaning/types/roomModal";

interface CheckInGuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    payload: Omit<CheckInGuestPayload, "organizationId">,
  ) => Promise<void>;
}

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

export function CheckInGuestDialog({
  open,
  onOpenChange,
  onSubmit,
}: CheckInGuestDialogProps) {
  const { t } = useTranslation();
  const today = new Date();
  const defaultCheckout = new Date();
  defaultCheckout.setDate(defaultCheckout.getDate() + 3);

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [checkIn, setCheckIn] = useState(toDateInput(today));
  const [checkOut, setCheckOut] = useState(toDateInput(defaultCheckout));
  const [adults, setAdults] = useState("2");
  const [children, setChildren] = useState("0");
  const [preferences, setPreferences] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!guestName.trim()) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        guestName: guestName.trim(),
        guestPhone: guestPhone.trim() || undefined,
        guestEmail: guestEmail.trim() || undefined,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        adults: Number(adults) || 1,
        children: Number(children) || 0,
        preferences: preferences
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
      });
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("check_in_guest")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label>{t("guest_name")}</Label>
            <Input
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder={t("guest_name_placeholder")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t("check_in")}</Label>
              <Input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("check_out")}</Label>
              <Input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>{t("adults")}</Label>
              <Input
                type="number"
                min={1}
                value={adults}
                onChange={(e) => setAdults(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("children")}</Label>
              <Input
                type="number"
                min={0}
                value={children}
                onChange={(e) => setChildren(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{t("phone_label")}</Label>
            <Input
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("email_label")}</Label>
            <Input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>{t("preferences_comma_separated")}</Label>
            <Input
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder={t("preferences_placeholder")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!guestName.trim() || isSubmitting}
          >
            {t("check_in_guest")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
