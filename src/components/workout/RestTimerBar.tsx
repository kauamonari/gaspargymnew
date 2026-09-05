import { Pause, Play, RotateCcw, X } from "lucide-react";
import type { RestTimer } from "@/hooks/useRestTimer";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function RestTimerBar({ timer }: { timer: RestTimer }) {
  if (!timer.active) return null;

  const progress =
    timer.totalSeconds > 0
      ? ((timer.totalSeconds - timer.secondsLeft) / timer.totalSeconds) * 100
      : 0;

  return (
    <div className="fixed inset-x-0 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-40 flex justify-center px-5">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-workout/50 bg-card/95 shadow-glow-workout backdrop-blur-xl md:max-w-2xl">
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-workout">
              Descanso
            </p>
            <p className="font-display text-xl font-bold tabular-nums leading-tight">
              {formatTime(timer.secondsLeft)}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={timer.reset}
              aria-label="Reiniciar descanso"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={timer.paused ? timer.resume : timer.pause}
              aria-label={timer.paused ? "Retomar descanso" : "Pausar descanso"}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-workout/15 text-workout transition-colors hover:bg-workout/25"
            >
              {timer.paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
            <button
              onClick={timer.skip}
              aria-label="Pular descanso"
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-workout/15">
          <div
            className="h-full bg-workout transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
