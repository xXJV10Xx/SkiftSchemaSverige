import React, { useMemo } from "react";
import { generateMonthShifts, ShiftData } from "@/lib/shifts";

const WEEKDAYS_SV = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"] as const;

function mondayIndex(jsDay: number) {
  return (jsDay + 6) % 7;
}

export type MonthCalendarProps = {
  year: number;
  month: number;
  lagNum: 1 | 2 | 3 | 4 | 5;
  favorites?: Set<string>;
  onToggleFavorite?: (dateStr: string, lagNum: 1 | 2 | 3 | 4 | 5) => void;
};

export function MonthCalendar({ year, month, lagNum, favorites, onToggleFavorite }: MonthCalendarProps) {
  const days = useMemo(() => generateMonthShifts(year, month, lagNum), [year, month, lagNum]);

  const firstDay = useMemo(() => new Date(year, month - 1, 1), [year, month]);
  const leadingBlanks = mondayIndex(firstDay.getDay());

  const monthLabel = useMemo(() => {
    const dt = new Date(year, month - 1, 1);
    return dt.toLocaleDateString("sv-SE", { year: "numeric", month: "long" });
  }, [year, month]);

  return (
    <section className="w-full">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-slate-100">
          {monthLabel} · Lag {lagNum}
        </h2>
        <div className="text-xs text-slate-400">{days.length} dagar</div>
      </div>

      <div className="-mx-3 overflow-x-auto px-3">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-7 gap-2 pb-2">
            {WEEKDAYS_SV.map((d) => (
              <div key={d} className="px-1 text-center text-[11px] font-medium text-slate-400">
                {d}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} className="h-16 rounded-xl border border-slate-800/60 bg-slate-950/40" />
            ))}

            {days.map((d) => (
              <DayCell
                key={d.dateStr}
                day={d}
                isFavorite={favorites?.has(d.dateStr) ?? false}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DayCell({
  day,
  isFavorite,
  onToggleFavorite,
}: {
  day: ShiftData;
  isFavorite: boolean;
  onToggleFavorite?: (dateStr: string, lagNum: 1 | 2 | 3 | 4 | 5) => void;
}) {
  const dayNumber = Number(day.dateStr.slice(8, 10));

  const bg = day.special?.color.bg ?? "#0b1220";
  const fg = day.special?.color.text ?? "#e2e8f0";
  const title =
    day.special?.tooltip ??
    new Date(`${day.dateStr}T00:00:00`).toLocaleDateString("sv-SE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div
      className="relative h-16 rounded-xl border border-slate-800/70 bg-slate-950/40 px-2 py-2"
      title={title}
      style={day.special ? { backgroundColor: bg, color: fg, borderColor: "rgba(15, 23, 42, 0.3)" } : undefined}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs font-semibold tabular-nums">{dayNumber}</div>
        <button
          type="button"
          aria-label={isFavorite ? "Ta bort favorit" : "Markera som favorit"}
          className={`rounded-md px-1.5 py-0.5 text-[11px] transition ${
            isFavorite ? "bg-emerald-400/20 text-emerald-200" : "bg-slate-900/40 text-slate-300 hover:bg-slate-900/70"
          }`}
          onClick={() => onToggleFavorite?.(day.dateStr, day.lag as 1 | 2 | 3 | 4 | 5)}
        >
          {isFavorite ? "★" : "☆"}
        </button>
      </div>

      <div className="mt-1 flex items-end justify-between">
        <div className="text-lg font-bold leading-none tracking-wide">{day.shift ?? "-"}</div>
        {day.special ? (
          <div className="text-[10px] font-semibold uppercase opacity-90">
            {day.special.state === 1 ? "Röd" : "Grön"}
          </div>
        ) : (
          <div className="text-[10px] text-slate-400">{day.dateStr.slice(5)}</div>
        )}
      </div>
    </div>
  );
}
