import { Link } from "@tanstack/react-router";
import { CalendarClock, ChevronRight } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { WorkoutSession } from "@/utils/dashboard";
import { localDateKey } from "@/utils/date";

function relativeDay(isoDate: string): string {
  const key = localDateKey(isoDate);
  const today = localDateKey(new Date());
  const yesterday = localDateKey(new Date(Date.now() - 86400000));
  if (key === today) return "Hoje";
  if (key === yesterday) return "1 dia atrás";
  const diffDays = Math.round((+new Date(today) - +new Date(key)) / 86400000);
  return `${diffDays} dias atrás`;
}

export function LastWorkoutCard({ session }: { session: WorkoutSession | null }) {
  if (!session) {
    return (
      <SurfaceCard className="flex h-full flex-col justify-between space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          <CalendarClock className="h-3.5 w-3.5" /> Último treino
        </p>
        <p className="text-sm text-muted-foreground">Nenhum treino realizado ainda.</p>
      </SurfaceCard>
    );
  }

  return (
    <Link to="/days" className="block h-full">
      <SurfaceCard className="flex h-full flex-col justify-between space-y-3 transition-colors hover:border-primary/40">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
            <CalendarClock className="h-3.5 w-3.5" /> Último treino
          </p>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>

        <div>
          <h3 className="font-display text-lg font-bold leading-tight">{session.blockLabel}</h3>
          <p className="text-xs text-muted-foreground">{relativeDay(session.isoDate)}</p>
        </div>

        <div className="flex items-center gap-4 border-t border-border pt-3 text-sm">
          <div>
            <p className="font-display font-bold tabular-nums">{session.exerciseNames.length}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">exercícios</p>
          </div>
          <div>
            <p className="font-display font-bold tabular-nums">{session.setCount}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">séries</p>
          </div>
        </div>
      </SurfaceCard>
    </Link>
  );
}
