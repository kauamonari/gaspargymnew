import { Link } from "@tanstack/react-router";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { WeightSummary } from "@/utils/dashboard";

export function WeightCard({ summary, pesoMeta }: { summary: WeightSummary; pesoMeta?: number }) {
  const { latest, diff, series } = summary;

  if (!latest) {
    return (
      <SurfaceCard className="flex h-full flex-col justify-between space-y-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          <Scale className="h-3.5 w-3.5" /> Peso atual
        </p>
        <p className="text-sm text-muted-foreground">Nenhum peso registrado ainda.</p>
        <Link to="/progress" className="text-sm font-semibold text-primary hover:underline">
          Registrar peso →
        </Link>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
        <Scale className="h-3.5 w-3.5" /> Peso atual
      </p>

      <div className="flex items-end justify-between">
        <p className="font-display text-3xl font-bold tabular-nums">
          {latest.weight}
          <span className="ml-1 text-base font-medium text-muted-foreground">kg</span>
        </p>
        {diff !== null && diff !== 0 && (
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
              diff > 0 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"
            }`}
          >
            {diff > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(diff)} kg
          </span>
        )}
      </div>

      {pesoMeta && <p className="text-xs text-muted-foreground">Meta: {pesoMeta} kg</p>}

      {series.length >= 2 && (
        <div className="h-12 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <Line
                type="monotone"
                dataKey="peso"
                stroke="var(--color-primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </SurfaceCard>
  );
}
