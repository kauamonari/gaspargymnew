import { BarChart3, TrendingDown, TrendingUp } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { DayVolume } from "@/utils/dashboard";

interface Props {
  thisWeek: number;
  lastWeek: number;
  days: DayVolume[];
}

export function WeeklyVolumeCard({ thisWeek, lastWeek, days }: Props) {
  const hasData = thisWeek > 0 || lastWeek > 0;
  const pctChange = lastWeek > 0 ? Math.round(((thisWeek - lastWeek) / lastWeek) * 100) : null;
  const max = Math.max(...days.map((d) => d.volume), 1);

  return (
    <SurfaceCard className="flex h-full flex-col justify-between space-y-4">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          <BarChart3 className="h-3.5 w-3.5" /> Volume semanal
        </p>

        {hasData ? (
          <div className="mt-2 flex items-baseline gap-2">
            <p className="font-display text-2xl font-bold tabular-nums">
              {thisWeek.toLocaleString("pt-BR")}{" "}
              <span className="text-sm font-medium text-muted-foreground">kg</span>
            </p>
            {pctChange !== null && pctChange !== 0 && (
              <span
                className={`flex items-center gap-0.5 text-xs font-semibold ${
                  pctChange > 0 ? "text-success" : "text-warning"
                }`}
              >
                {pctChange > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(pctChange)}% vs. semana passada
              </span>
            )}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Complete um treino para acompanhar seu volume.
          </p>
        )}
      </div>

      {hasData && (
        <div className="flex h-16 items-end justify-between gap-1.5">
          {days.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
              <div className="flex h-11 w-full items-end">
                <div
                  className={`w-full rounded-sm transition-[height] duration-500 ${
                    d.isToday ? "bg-primary" : "bg-muted"
                  }`}
                  style={{ height: `${d.volume > 0 ? Math.max((d.volume / max) * 100, 8) : 3}%` }}
                />
              </div>
              <span
                className={`text-[9px] font-medium ${d.isToday ? "text-primary" : "text-muted-foreground"}`}
              >
                {d.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </SurfaceCard>
  );
}
