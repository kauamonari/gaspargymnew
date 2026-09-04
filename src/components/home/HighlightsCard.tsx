import { SurfaceCard } from "@/components/SurfaceCard";

export interface Highlight {
  icon: string;
  value: string;
  label: string;
  cta?: string;
}

export function HighlightsCard({ highlights }: { highlights: Highlight[] }) {
  if (highlights.length === 0) {
    return (
      <SurfaceCard className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Destaques</p>
        <p className="text-sm text-muted-foreground">
          Continue registrando refeições e treinos pra desbloquear seus destaques aqui.
        </p>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Destaques</p>
      <div className={`grid gap-3 ${highlights.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {highlights.map((h, i) => (
          <div key={i} className="space-y-0.5">
            <p className="text-xl leading-none">{h.icon}</p>
            <p className="font-display text-lg font-bold tabular-nums leading-tight">{h.value}</p>
            <p className="text-[11px] leading-tight text-muted-foreground">{h.label}</p>
            {h.cta && <p className="text-[11px] font-semibold text-primary">{h.cta}</p>}
          </div>
        ))}
      </div>
    </SurfaceCard>
  );
}
