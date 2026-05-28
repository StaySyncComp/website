import { CHART_BODY_HEIGHT_PX } from "@/features/home-dashboard/constants";
import { computeYTicks } from "@/features/home-dashboard/utils/chartUtils";

export interface BarChartProps {
  data: { label: string; open: number; completed: number }[];
  hasRealData: boolean;
}

export function BarChart({ data, hasRealData }: BarChartProps) {
  const chartBodyHeight = CHART_BODY_HEIGHT_PX;
  const maxValue = Math.max(
    0,
    ...data.flatMap((d) => [d.open, d.completed]),
  );
  const ticks = computeYTicks(maxValue);
  const max = Math.max(ticks[ticks.length - 1] ?? 1, 1);
  const heightFor = (value: number) =>
    Math.max(2, (value / max) * chartBodyHeight);

  const sampleOpen = data.map((_, i) => 6 + ((i * 5) % 12));
  const sampleCompleted = data.map((_, i) => 3 + ((i * 3) % 8));

  return (
    <div className="flex gap-4" dir="ltr">
      <div
        className="flex flex-col-reverse justify-between text-[11px] text-[#9AA5BD]"
        style={{ height: chartBodyHeight + 24 }}
      >
        {ticks.map((t) => (
          <span key={t} className="leading-none">
            {t}
          </span>
        ))}
      </div>

      <div className="relative flex-1">
        <div
          className="absolute left-0 right-0 top-0 flex flex-col-reverse justify-between"
          style={{ height: chartBodyHeight + 8 }}
        >
          {ticks.map((t) => (
            <div key={t} className="h-px w-full bg-[#EDF1F8]" />
          ))}
        </div>

        <div
          className="relative z-10 flex items-end justify-around"
          style={{ height: chartBodyHeight + 8 }}
        >
          {data.map((item, idx) => {
            const openValue = hasRealData ? item.open : sampleOpen[idx] ?? 0;
            const completedValue = hasRealData
              ? item.completed
              : sampleCompleted[idx] ?? 0;
            return (
              <div
                key={`${item.label}-${idx}`}
                className="flex flex-1 flex-col items-center"
              >
                <div className="flex items-end gap-[3px]">
                  <div
                    className="w-[11px] rounded-t-[3px] bg-[#5FBEB9]"
                    style={{ height: `${heightFor(openValue)}px` }}
                  />
                  <div
                    className="w-[11px] rounded-t-[3px] bg-[#F0A0A0]"
                    style={{ height: `${heightFor(completedValue)}px` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-around">
          {data.map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="flex-1 truncate px-0.5 text-center text-[11px] text-[#9AA5BD]"
              title={item.label}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
