import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { WorkoutSummary } from "@/utils/workout";

export function WorkoutSummaryDialog({
  open,
  onOpenChange,
  blockLabel,
  summary,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockLabel: string;
  summary: WorkoutSummary;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Treino concluído 🎉</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{blockLabel}</p>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-xl bg-background/60 py-3">
              <p className="font-display text-2xl font-bold tabular-nums">
                {summary.durationMinutes}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">min</p>
            </div>
            <div className="rounded-xl bg-background/60 py-3">
              <p className="font-display text-2xl font-bold tabular-nums">
                {summary.exercisesCount}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                exercícios
              </p>
            </div>
            <div className="rounded-xl bg-background/60 py-3">
              <p className="font-display text-2xl font-bold tabular-nums">{summary.seriesCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">séries</p>
            </div>
          </div>

          {summary.prs.length > 0 ? (
            <div className="space-y-2 rounded-xl border border-workout/30 bg-workout/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-workout">
                Principais evoluções
              </p>
              <ul className="space-y-1">
                {summary.prs.map((pr) => (
                  <li
                    key={pr.exerciseName}
                    className="flex items-center justify-between text-sm font-medium"
                  >
                    <span>{pr.exerciseName}</span>
                    <span className="text-workout">+{pr.deltaKg} kg</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              Nenhum recorde novo hoje — mantenha a consistência.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
