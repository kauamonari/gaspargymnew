import { useEffect, useMemo, useState } from "react";
import { Check, Pencil, Timer, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { NumberField } from "@/components/NumberField";
import { SurfaceCard } from "@/components/SurfaceCard";
import type { RestTimer } from "@/hooks/useRestTimer";
import type { Exercise } from "@/data/exercises";
import { SET_TYPES, type SetType, type WorkoutSet } from "@/storage/storage";
import { type CargaSuggestion, previousSession, suggestedCargaByType } from "@/utils/loadEvolution";
import { localDateKey } from "@/utils/date";

interface ExercisePanelProps {
  exercise: Exercise;
  allSets: WorkoutSet[];
  todaySets: WorkoutSet[];
  restSeconds: number;
  timer: RestTimer;
  onLogSet: (carga: number, reps: number, tipo: SetType) => void;
  onUpdateSet: (id: string, patch: { carga: number; reps: number; tipo: SetType }) => void;
  onRemoveSet: (id: string) => void;
  onChangeRestSeconds: (seconds: number) => void;
  onClose: () => void;
}

function tipoBadgeClass(tipo: SetType) {
  if (tipo === "aquecimento") return "bg-muted text-muted-foreground";
  if (tipo === "reconhecimento") return "bg-warning/15 text-warning";
  return "bg-workout/15 text-workout";
}

function TipoSelector({
  value,
  onChange,
  suggestions,
}: {
  value: SetType;
  onChange: (tipo: SetType) => void;
  suggestions: Record<SetType, CargaSuggestion>;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {SET_TYPES.map((t) => {
        const active = t.id === value;
        const s = suggestions[t.id];
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 text-center transition-colors ${
              active
                ? "border-workout bg-workout/10 text-workout"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="text-[11px] font-semibold leading-tight">{t.shortLabel}</span>
            <span className="text-[10px] tabular-nums leading-tight opacity-80">
              {s.value == null
                ? "sem histórico"
                : s.estimated
                  ? `≈ ${s.value}kg`
                  : `méd. ${s.value}kg`}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ExercisePanel({
  exercise,
  allSets,
  todaySets,
  restSeconds,
  timer,
  onLogSet,
  onUpdateSet,
  onRemoveSet,
  onChangeRestSeconds,
  onClose,
}: ExercisePanelProps) {
  const todayKey = useMemo(() => localDateKey(new Date()), []);
  const prevSession = useMemo(
    () => previousSession(allSets, exercise.nome, todayKey),
    [allSets, exercise.nome, todayKey],
  );
  const suggestions = useMemo(
    () => suggestedCargaByType(allSets, exercise.nome, todayKey),
    [allSets, exercise.nome, todayKey],
  );

  const [tipo, setTipo] = useState<SetType>("trabalho");

  function defaultFor(index: number, forTipo: SetType) {
    const suggested = suggestions[forTipo].value;
    if (index > 0 && todaySets[index - 1]) {
      return { carga: suggested ?? todaySets[index - 1].carga, reps: todaySets[index - 1].reps };
    }
    if (prevSession && prevSession.sets.length > 0) {
      const s = prevSession.sets[Math.min(index, prevSession.sets.length - 1)];
      return { carga: suggested ?? s.carga, reps: s.reps };
    }
    return { carga: suggested ?? 20, reps: 10 };
  }

  const [carga, setCarga] = useState(() => defaultFor(todaySets.length, "trabalho").carga);
  const [reps, setReps] = useState(() => defaultFor(todaySets.length, "trabalho").reps);

  useEffect(() => {
    const d = defaultFor(todaySets.length, tipo);
    setCarga(d.carga);
    setReps(d.reps);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todaySets.length]);

  function handleSelectTipo(next: SetType) {
    setTipo(next);
    const d = defaultFor(todaySets.length, next);
    setCarga(d.carga);
  }

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCarga, setEditCarga] = useState(0);
  const [editReps, setEditReps] = useState(0);
  const [editTipo, setEditTipo] = useState<SetType>("trabalho");

  function startEdit(set: WorkoutSet) {
    setEditingId(set.id);
    setEditCarga(set.carga);
    setEditReps(set.reps);
    setEditTipo(set.tipo ?? "trabalho");
  }

  function saveEdit() {
    if (!editingId) return;
    if (editCarga <= 0 || editReps <= 0) return;
    onUpdateSet(editingId, { carga: editCarga, reps: editReps, tipo: editTipo });
    setEditingId(null);
  }

  function handleLog() {
    if (carga <= 0 || reps <= 0) return;
    onLogSet(carga, reps, tipo);
    toast.success(`Série registrada — ${carga}kg × ${reps} reps`);
    if (restSeconds > 0) timer.start(restSeconds);
  }

  const targetCount = prevSession
    ? Math.max(prevSession.sets.length, todaySets.length)
    : todaySets.length;
  const ghostCount = Math.max(0, targetCount - todaySets.length);

  return (
    <SurfaceCard className="space-y-4 border-workout/40">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-lg font-semibold">{exercise.nome}</h2>
        <button
          onClick={onClose}
          className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
        >
          fechar
        </button>
      </div>

      {/* Treino anterior */}
      <div className="rounded-xl bg-background/60 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
          Treino anterior
        </p>
        {prevSession ? (
          <ul className="space-y-1.5">
            {prevSession.sets.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm tabular-nums">
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${tipoBadgeClass(s.tipo ?? "trabalho")}`}
                >
                  {SET_TYPES.find((t) => t.id === (s.tipo ?? "trabalho"))?.shortLabel}
                </span>
                <span className="text-muted-foreground">
                  {s.carga} kg <span className="text-muted-foreground/60">×</span> {s.reps} reps
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Nenhum treino anterior registrado.</p>
        )}
      </div>

      {/* Configuração de descanso */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Timer className="h-3.5 w-3.5" /> Descanso entre séries
        </span>
        <div className="flex items-center gap-1">
          <NumberField
            min={0}
            step={15}
            value={restSeconds}
            onChange={onChangeRestSeconds}
            className="h-8 w-16 rounded-lg border border-border bg-background px-2 text-right text-sm font-semibold tabular-nums outline-none ring-workout/40 focus:ring-2"
          />
          <span>s</span>
        </div>
      </div>

      {/* Séries de hoje */}
      <div className="space-y-1.5">
        {todaySets.map((s, i) =>
          editingId === s.id ? (
            <div key={s.id} className="space-y-2 rounded-xl bg-background px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">
                  Série {i + 1}
                </span>
                <NumberField
                  min={0}
                  step="0.5"
                  value={editCarga}
                  onChange={setEditCarga}
                  className="h-9 w-20 rounded-lg border border-border bg-card px-2 text-sm font-semibold tabular-nums outline-none ring-workout/40 focus:ring-2"
                />
                <span className="text-xs text-muted-foreground">kg ×</span>
                <NumberField
                  min={0}
                  value={editReps}
                  onChange={setEditReps}
                  className="h-9 w-16 rounded-lg border border-border bg-card px-2 text-sm font-semibold tabular-nums outline-none ring-workout/40 focus:ring-2"
                />
                <span className="text-xs text-muted-foreground">reps</span>
                <div className="ml-auto flex items-center gap-1">
                  <button
                    onClick={saveEdit}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-workout/15 text-workout"
                    aria-label="Salvar"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-accent"
                    aria-label="Cancelar"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5">
                {SET_TYPES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setEditTipo(t.id)}
                    className={`rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                      editTipo === t.id
                        ? "border-workout bg-workout/10 text-workout"
                        : "border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.shortLabel}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-xl bg-background px-3 py-2"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="shrink-0 text-xs font-medium text-muted-foreground">
                  Série {i + 1}
                </span>
                <span
                  className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${tipoBadgeClass(s.tipo ?? "trabalho")}`}
                >
                  {SET_TYPES.find((t) => t.id === (s.tipo ?? "trabalho"))?.shortLabel}
                </span>
                <p className="truncate text-sm font-semibold tabular-nums">
                  {s.carga}kg <span className="text-muted-foreground">×</span> {s.reps} reps
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => startEdit(s)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Editar série"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => onRemoveSet(s.id)}
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remover série"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ),
        )}

        {Array.from({ length: ghostCount }).map((_, gi) => {
          const seriesNum = todaySets.length + gi + 1;
          const ref = prevSession?.sets[todaySets.length + gi];
          return (
            <button
              key={`ghost-${gi}`}
              onClick={() => {
                if (ref) {
                  setCarga(ref.carga);
                  setReps(ref.reps);
                  setTipo(ref.tipo ?? "trabalho");
                }
              }}
              className="flex w-full items-center justify-between rounded-xl border border-dashed border-border/70 px-3 py-2 text-left transition-colors hover:border-workout/40"
            >
              <span className="w-14 shrink-0 text-xs font-medium text-muted-foreground">
                Série {seriesNum}
              </span>
              <p className="flex-1 text-sm text-muted-foreground">
                {ref ? `${ref.carga}kg × ${ref.reps} reps (sugestão)` : "—"}
              </p>
              <span className="text-muted-foreground">○</span>
            </button>
          );
        })}
      </div>

      {/* Próxima série */}
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            Fase da série · média de carga
          </p>
          <TipoSelector value={tipo} onChange={handleSelectTipo} suggestions={suggestions} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Carga (kg)
            </span>
            <NumberField
              min={0}
              step="0.5"
              value={carga}
              onChange={setCarga}
              className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 font-display text-xl font-bold tabular-nums outline-none ring-workout/40 focus:ring-2"
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Repetições
            </span>
            <NumberField
              min={0}
              value={reps}
              onChange={setReps}
              className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 font-display text-xl font-bold tabular-nums outline-none ring-workout/40 focus:ring-2"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleLog}
        className="shadow-glow-workout flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-workout font-semibold text-workout-foreground transition-transform active:scale-[0.98]"
      >
        <Check className="h-5 w-5" /> Concluir série
      </button>
    </SurfaceCard>
  );
}
