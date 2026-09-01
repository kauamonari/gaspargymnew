import { Activity } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { DaySets } from "@/utils/dashboard";

interface Props {
  sessions: number;
  setCount: number;
  days: DaySets[];
}

export function WeeklyActivityCard({ sessions, setCount, days }: Props) {
  const hasData = sessions > 0;
  const max = Math.max(...days.map((d) => d.setCount), 1);

  return (
    <SurfaceCard className="flex h-full flex-col justify-between space-y-4">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          <Activity className="h-3.5 w-3.5" /> Atividade da semana
        </p>

        {hasData ? (
          <div className="mt-2 flex items-baseline gap-3">
            <p className="font-display text-2xl font-bold tabular-nums">
              {sessions}{" "}
              <span className="text-sm font-medium text-muted-foreground">
                {sessions === 1 ? "treino" : "treinos"}
              </span>
            </p>
            <p className="font-display text-2xl font-bold tabular-nums">
              {setCount}{" "}
              <span className="text-sm font-medium text-muted-foreground">
                {setCount === 1 ? "série" : "séries"}
              </span>
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Complete um treino para acompanhar sua atividade.
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
                  style={{
                    height: `${d.setCount > 0 ? Math.max((d.setCount / max) * 100, 8) : 3}%`,
                  }}
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
