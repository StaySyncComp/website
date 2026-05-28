import { useTranslation } from "react-i18next";

export function DemoWatermark() {
  const { t } = useTranslation();

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 top-14 z-20 flex items-center justify-center rounded-b-2xl bg-white/50">
      <div className="rounded-xl border border-[#E7ECF6] bg-white px-4 py-3 text-center shadow-sm">
        <div className="text-[18px] font-extrabold tracking-[0.24em] text-[#B7C0D4]">
          {t("home_dashboard.demo_watermark_title")}
        </div>
        <div className="mt-1 text-[12px] font-medium text-[#7D89A5]">
          {t("home_dashboard.demo_watermark_subtitle")}
        </div>
      </div>
    </div>
  );
}
