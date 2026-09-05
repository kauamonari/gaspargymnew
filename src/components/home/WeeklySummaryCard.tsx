import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";

export function WeeklySummaryCard({
  sessions,
  prs,
  loadGrowthPct,
  diasTreinoSemana,
}: {
  sessions: number;
  prs: number;
  loadGrowthPct: number | null;
  diasTreinoSemana?: number;
}) {
  if (sessions === 0 && prs === 0) return null;

  const parts: string[] = [];
  parts.push(`${sessions} ${sessions === 1 ? "treino" : "treinos"}`);
  if (prs > 0) parts.push(`${prs} ${prs === 1 ? "PR" : "PRs"}`);
  if (loadGrowthPct !== null) {
    parts.push(`${loadGrowthPct > 0 ? "+" : ""}${loadGrowthPct}% evolução`);
  }

  return (
    <SurfaceCard className="space-y-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
        <CalendarCheck className="h-3.5 w-3.5" /> Resumo da semana
      </p>
      <p className="text-sm">{parts.join(" · ")}</p>
      {diasTreinoSemana && (
        <p className="text-xs text-muted-foreground">
          Você treinou{" "}
          <span className="font-semibold text-foreground">
            {sessions} de {diasTreinoSemana}
          </span>{" "}
          dias planejados.
        </p>
      )}
      <Link
        to="/days"
        className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
      >
        Ver análise completa <ArrowRight className="h-3 w-3" />
      </Link>
    </SurfaceCard>
  );
}
