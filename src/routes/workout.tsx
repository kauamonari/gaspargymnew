import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Dumbbell, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadEvolutionSection } from "@/components/workout/LoadEvolution";
import { EXERCISES, MUSCLE_GROUPS, type Exercise, type MuscleGroup } from "@/data/exercises";
import {
  DEFAULT_WORKOUT_BLOCKS,
  getCustomExercises,
  saveCustomExercises,
  STORAGE_KEYS,
  storage,
  type CustomExercise,
  type WorkoutBlock,
  type WorkoutSet,
} from "@/storage/storage";
import { groupByExercise, isSameDay, maxCarga } from "@/utils/workout";

export const Route = createFileRoute("/workout")({
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Treino" },
      {
        name: "description",
        content: "Organize seus treinos em blocos e acompanhe a evolução de carga.",
      },
    ],
  }),
  component: WorkoutPage,
});

function WorkoutPage() {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [blocks, setBlocks] = useState<WorkoutBlock[]>([]);
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([]);

  useEffect(() => {
    setSets(storage.get<WorkoutSet[]>(STORAGE_KEYS.workoutSets, []));
    setBlocks(storage.get<WorkoutBlock[]>(STORAGE_KEYS.workoutBlocks, DEFAULT_WORKOUT_BLOCKS));
    setCustomExercises(getCustomExercises());
  }, []);

  function persistSets(next: WorkoutSet[]) {
    storage.set(STORAGE_KEYS.workoutSets, next);
    setSets(next);
  }

  function persistBlocks(next: WorkoutBlock[]) {
    storage.set(STORAGE_KEYS.workoutBlocks, next);
    setBlocks(next);
  }

  function persistCustomExercises(next: CustomExercise[]) {
    saveCustomExercises(next);
    setCustomExercises(next);
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <header className="flex items-center gap-3">
        <div className="rounded-full bg-workout/15 p-3 text-workout">
          <Dumbbell className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Musculação</p>
          <h1 className="font-display text-2xl font-bold">Treino</h1>
        </div>
      </header>

      <Tabs defaultValue="registrar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registrar">Registrar</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
        </TabsList>

        <TabsContent value="registrar" className="mt-4 space-y-6">
          <RegisterTab
            sets={sets}
            blocks={blocks}
            customExercises={customExercises}
            onPersistSets={persistSets}
            onPersistBlocks={persistBlocks}
            onPersistCustomExercises={persistCustomExercises}
          />
        </TabsContent>

        <TabsContent value="evolucao" className="mt-4 space-y-6">
          <LoadEvolutionSection sets={sets} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RegisterTab({
  sets,
  blocks,
  customExercises,
  onPersistSets,
  onPersistBlocks,
  onPersistCustomExercises,
}: {
  sets: WorkoutSet[];
  blocks: WorkoutBlock[];
  customExercises: CustomExercise[];
  onPersistSets: (next: WorkoutSet[]) => void;
  onPersistBlocks: (next: WorkoutBlock[]) => void;
  onPersistCustomExercises: (next: CustomExercise[]) => void;
}) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(blocks[0]?.id ?? null);
  const [managing, setManaging] = useState(false);
  const [extraMode, setExtraMode] = useState(false);
  const [addingCustom, setAddingCustom] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");

  const [selected, setSelected] = useState<Exercise | null>(null);
  const [carga, setCarga] = useState(20);
  const [reps, setReps] = useState(10);

  const [group, setGroup] = useState<MuscleGroup>("peito");
  const [q, setQ] = useState("");

  // Pool de exercícios = os pré-definidos do app + os que o usuário criou.
  const allExercises = useMemo<Exercise[]>(
    () => [...EXERCISES, ...customExercises.map((c) => ({ ...c, grupo: c.grupo as MuscleGroup }))],
    [customExercises],
  );

  useEffect(() => {
    if (!activeBlockId && blocks.length > 0) setActiveBlockId(blocks[0].id);
  }, [blocks, activeBlockId]);

  const activeBlock = blocks.find((b) => b.id === activeBlockId) ?? null;

  const today = new Date().toISOString();
  const todaySets = sets.filter((s) => isSameDay(s.date, today));
  const todayForBlock = activeBlock ? todaySets.filter((s) => s.blockId === activeBlock.id) : [];

  const blockExercises = useMemo(() => {
    if (!activeBlock) return [];
    return activeBlock.exerciseIds
      .map((id) => allExercises.find((e) => e.id === id))
      .filter((e): e is Exercise => !!e);
  }, [activeBlock, allExercises]);

  const pickerResults = useMemo(() => {
    const n = q.trim().toLowerCase();
    const pool = allExercises.filter((e) => e.grupo === group);
    if (!n) return pool;
    return pool.filter((e) => e.nome.toLowerCase().includes(n));
  }, [q, group, allExercises]);

  function addCustomExercise() {
    const nome = newExerciseName.trim();
    if (!nome) return;
    const id = Date.now();
    const exercise: CustomExercise = { id, nome, grupo: group };
    onPersistCustomExercises([...customExercises, exercise]);
    // Já inclui no treino atual, já que foi criado a partir dele.
    if (activeBlock) {
      onPersistBlocks(
        blocks.map((b) =>
          b.id === activeBlock.id ? { ...b, exerciseIds: [...b.exerciseIds, id] } : b,
        ),
      );
    }
    setNewExerciseName("");
    setAddingCustom(false);
  }

  function addBlock() {
    const letters = "ABCDEFGH";
    const nextLetter = letters[blocks.length] ?? String(blocks.length + 1);
    const id = crypto.randomUUID();
    const block: WorkoutBlock = { id, label: `Treino ${nextLetter}`, exerciseIds: [] };
    onPersistBlocks([...blocks, block]);
    setActiveBlockId(id);
    setManaging(true);
  }

  function renameBlock(id: string, label: string) {
    onPersistBlocks(blocks.map((b) => (b.id === id ? { ...b, label } : b)));
  }

  function deleteBlock(id: string) {
    const next = blocks.filter((b) => b.id !== id);
    onPersistBlocks(next);
    if (activeBlockId === id) setActiveBlockId(next[0]?.id ?? null);
  }

  function toggleExerciseInBlock(exerciseId: number) {
    if (!activeBlock) return;
    const has = activeBlock.exerciseIds.includes(exerciseId);
    const nextIds = has
      ? activeBlock.exerciseIds.filter((id) => id !== exerciseId)
      : [...activeBlock.exerciseIds, exerciseId];
    onPersistBlocks(
      blocks.map((b) => (b.id === activeBlock.id ? { ...b, exerciseIds: nextIds } : b)),
    );
  }

  function logSet(exercise: Exercise) {
    if (carga <= 0 || reps <= 0 || !activeBlock) return;
    const set: WorkoutSet = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      exerciseName: exercise.nome,
      carga,
      reps,
      date: new Date().toISOString(),
      blockId: activeBlock.id,
      blockLabel: activeBlock.label,
    };
    onPersistSets([...sets, set]);
    setSelected(null);
    setExtraMode(false);
    setQ("");
  }

  function removeSet(id: string) {
    onPersistSets(sets.filter((s) => s.id !== id));
  }

  const grouped = groupByExercise(todayForBlock);

  return (
    <>
      {/* Seletor de blocos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {blocks.map((b) => {
          const active = b.id === activeBlockId;
          return (
            <button
              key={b.id}
              onClick={() => {
                setActiveBlockId(b.id);
                setSelected(null);
                setExtraMode(false);
              }}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                active
                  ? "border-workout bg-workout text-workout-foreground shadow-glow-workout"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {b.label}
            </button>
          );
        })}
        <button
          onClick={addBlock}
          className="flex shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Plus className="h-4 w-4" /> Novo treino
        </button>
      </div>

      {!activeBlock ? (
        <SurfaceCard className="py-10 text-center text-sm text-muted-foreground">
          Crie um treino (ex: Treino A) pra começar a organizar seus exercícios.
        </SurfaceCard>
      ) : (
        <>
          <div className="flex items-center justify-between">
            {managing ? (
              <input
                value={activeBlock.label}
                onChange={(e) => renameBlock(activeBlock.id, e.target.value)}
                className="h-10 flex-1 rounded-lg border border-border bg-card px-3 font-display text-lg font-bold outline-none ring-workout/40 focus:ring-2"
              />
            ) : (
              <h2 className="font-display text-lg font-semibold">{activeBlock.label}</h2>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setManaging((v) => !v)}
                className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                  managing
                    ? "border-workout bg-workout/10 text-workout"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Gerenciar exercícios do treino"
              >
                {managing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              </button>
              {managing && (
                <button
                  onClick={() => deleteBlock(activeBlock.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10"
                  aria-label="Excluir treino"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {managing ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Selecione os exercícios que fazem parte do {activeBlock.label}.
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {MUSCLE_GROUPS.map((g) => {
                  const gActive = g.id === group;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setGroup(g.id)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        gActive
                          ? "border-workout bg-workout text-workout-foreground shadow-glow-workout"
                          : "border-border bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{g.emoji}</span>
                      {g.label}
                    </button>
                  );
                })}
              </div>
              <ul className="space-y-2">
                {allExercises
                  .filter((e) => e.grupo === group)
                  .map((e) => {
                    const included = activeBlock.exerciseIds.includes(e.id);
                    const isCustom = customExercises.some((c) => c.id === e.id);
                    return (
                      <li key={e.id}>
                        <button
                          onClick={() => toggleExerciseInBlock(e.id)}
                          className="w-full text-left"
                        >
                          <SurfaceCard
                            className={`flex items-center justify-between p-4 transition-colors ${
                              included ? "border-workout/60 bg-workout/5" : "hover:border-border"
                            }`}
                          >
                            <p className="font-semibold">
                              {e.nome}
                              {isCustom && (
                                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                  seu
                                </span>
                              )}
                            </p>
                            {included ? (
                              <Check className="h-4 w-4 text-workout" />
                            ) : (
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            )}
                          </SurfaceCard>
                        </button>
                      </li>
                    );
                  })}
              </ul>

              {addingCustom ? (
                <SurfaceCard className="space-y-3 border-dashed border-workout/40">
                  <p className="text-xs text-muted-foreground">
                    Novo exercício em{" "}
                    <span className="font-medium text-foreground">
                      {MUSCLE_GROUPS.find((g) => g.id === group)?.label}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <input
                      value={newExerciseName}
                      onChange={(e) => setNewExerciseName(e.target.value)}
                      placeholder="Nome do exercício"
                      autoFocus
                      className="h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none ring-workout/40 focus:ring-2"
                    />
                    <button
                      onClick={addCustomExercise}
                      disabled={!newExerciseName.trim()}
                      className="flex h-11 items-center gap-1 rounded-xl bg-workout px-4 text-sm font-semibold text-workout-foreground disabled:opacity-40"
                    >
                      <Check className="h-4 w-4" /> Criar
                    </button>
                  </div>
                </SurfaceCard>
              ) : (
                <button
                  onClick={() => setAddingCustom(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Plus className="h-4 w-4" /> Criar exercício personalizado
                </button>
              )}
            </div>
          ) : (
            <>
              {selected ? (
                <SurfaceCard className="space-y-4 border-workout/40">
                  <div className="flex items-baseline justify-between">
                    <h2 className="font-display text-lg font-semibold">{selected.nome}</h2>
                    <button
                      onClick={() => setSelected(null)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      cancelar
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Carga (kg)
                      </span>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={carga}
                        onChange={(e) => setCarga(Math.max(0, +e.target.value || 0))}
                        className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 font-display text-xl font-bold tabular-nums outline-none ring-workout/40 focus:ring-2"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground">
                        Repetições
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={reps}
                        onChange={(e) => setReps(Math.max(0, +e.target.value || 0))}
                        className="mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 font-display text-xl font-bold tabular-nums outline-none ring-workout/40 focus:ring-2"
                      />
                    </label>
                  </div>

                  <button
                    onClick={() => logSet(selected)}
                    className="shadow-glow-workout flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-workout font-semibold text-workout-foreground transition-transform active:scale-[0.98]"
                  >
                    <Check className="h-5 w-5" /> Adicionar série
                  </button>
                </SurfaceCard>
              ) : extraMode ? (
                <SurfaceCard className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">Exercício avulso</h3>
                    <button
                      onClick={() => {
                        setExtraMode(false);
                        setQ("");
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {MUSCLE_GROUPS.map((g) => {
                      const gActive = g.id === group;
                      return (
                        <button
                          key={g.id}
                          onClick={() => setGroup(g.id)}
                          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                            gActive
                              ? "border-workout bg-workout text-workout-foreground"
                              : "border-border bg-background text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {g.emoji} {g.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                      placeholder="Pesquisar exercício…"
                      className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none ring-workout/40 focus:ring-2"
                    />
                  </div>
                  <ul className="max-h-64 space-y-1.5 overflow-y-auto">
                    {pickerResults.map((e) => (
                      <li key={e.id}>
                        <button
                          onClick={() => setSelected(e)}
                          className="flex w-full items-center justify-between rounded-lg bg-background px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent"
                        >
                          {e.nome}
                        </button>
                      </li>
                    ))}
                  </ul>
                </SurfaceCard>
              ) : (
                <>
                  {blockExercises.length === 0 ? (
                    <SurfaceCard className="space-y-3 py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Esse treino ainda não tem exercícios. Toque no lápis pra adicionar.
                      </p>
                    </SurfaceCard>
                  ) : (
                    <ul className="space-y-2">
                      {blockExercises.map((e) => {
                        const doneToday = grouped.get(e.nome);
                        return (
                          <li key={e.id}>
                            <button onClick={() => setSelected(e)} className="w-full text-left">
                              <SurfaceCard className="flex items-center justify-between p-4 transition-colors hover:border-workout/40">
                                <p className="font-semibold">{e.nome}</p>
                                {doneToday ? (
                                  <span className="text-xs font-medium text-workout">
                                    {doneToday.length} {doneToday.length === 1 ? "série" : "séries"}{" "}
                                    · {maxCarga(doneToday)}kg
                                  </span>
                                ) : (
                                  <Plus className="h-4 w-4 text-muted-foreground" />
                                )}
                              </SurfaceCard>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  <button
                    onClick={() => setExtraMode(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Plus className="h-4 w-4" /> Exercício avulso (fora do treino)
                  </button>
                </>
              )}

              {grouped.size > 0 && (
                <section className="space-y-3">
                  <h2 className="font-display text-lg font-semibold">
                    Séries de hoje — {activeBlock.label}
                  </h2>
                  <div className="space-y-3">
                    {Array.from(grouped.entries()).map(([name, items]) => (
                      <SurfaceCard key={name} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-display font-semibold leading-tight">{name}</p>
                          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                            {items.length} {items.length === 1 ? "série" : "séries"} · máx{" "}
                            {maxCarga(items)}kg
                          </p>
                        </div>
                        <ul className="space-y-1.5 border-t border-border/60 pt-3">
                          {items.map((s) => (
                            <li
                              key={s.id}
                              className="flex items-center justify-between rounded-xl bg-background px-3 py-2"
                            >
                              <p className="text-sm font-medium tabular-nums">
                                {s.carga}kg <span className="text-muted-foreground">×</span>{" "}
                                {s.reps} reps
                              </p>
                              <button
                                onClick={() => removeSet(s.id)}
                                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                                aria-label="Remover"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </SurfaceCard>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
