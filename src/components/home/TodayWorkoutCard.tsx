import { Link } from "@tanstack/react-router";
import { ArrowRight, Dumbbell } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { WorkoutBlock } from "@/storage/storage";

interface Props {
  block: WorkoutBlock | null;
  exerciseCount: number;
  estimatedSets: number | null;
  groupsLabel: string | null;
  estimatedMinutes: number;
}

export function TodayWorkoutCard({
  block,
  exerciseCount,
  estimatedSets,
  groupsLabel,
  estimatedMinutes,
}: Props) {
  return (
    <SurfaceCard className="flex h-full flex-col justify-between space-y-4">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          <Dumbbell className="h-3.5 w-3.5" /> Treino de hoje
        </p>

        {block ? (
          <>
            <h3 className="mt-2 font-display text-xl font-bold uppercase leading-tight">
              {groupsLabel ?? block.label}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {exerciseCount} {exerciseCount === 1 ? "exercício" : "exercícios"}
              {estimatedSets !== null && (
                <>
                  {" "}
                  · {estimatedSets} {estimatedSets === 1 ? "série" : "séries"}
                </>
              )}
              {estimatedMinutes > 0 && <> · ~{estimatedMinutes} min</>}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">Nenhum treino programado para hoje.</p>
        )}
      </div>

      <Link
        to="/workout"
        className="shadow-glow flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-bold uppercase tracking-wider text-primary-foreground transition-transform active:scale-[0.98]"
      >
        {block ? "Começar treino" : "Criar treino"} <ArrowRight className="h-4 w-4" />
      </Link>
    </SurfaceCard>
  );
}
