import { Link } from "@tanstack/react-router";
import { Flame, Settings } from "lucide-react";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

export function HomeHeader({ nome, streak }: { nome?: string; streak: number }) {
  return (
    <header className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-extrabold tracking-tight">
          GASPAR<span className="text-primary">GYM</span>
        </p>
        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Configurações"
        >
          <Settings className="h-4 w-4" />
        </Link>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold leading-tight">
            {greeting()}
            {nome ? `, ${nome}` : ""} 👋
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Pronto para o treino de hoje?</p>
        </div>

        {streak > 0 && (
          <div className="flex shrink-0 flex-col items-center rounded-2xl border border-border bg-card px-3 py-2">
            <div className="flex items-center gap-1 text-warning">
              <Flame className="h-4 w-4 fill-warning" />
              <span className="font-display text-lg font-bold tabular-nums text-foreground">
                {streak}
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
              {streak === 1 ? "dia" : "dias"} seguidos
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
