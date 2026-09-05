import type { WorkoutSet } from "@/storage/storage";
import { isSameLocalDay, localDateKey } from "@/utils/date";
import { bestSetBefore } from "@/utils/loadEvolution";

export function isSameDay(a: string, b: string) {
  return isSameLocalDay(a, b);
}

export function setVolume(set: WorkoutSet) {
  return set.carga * set.reps;
}

export function totalVolume(sets: WorkoutSet[]) {
  return sets.reduce((acc, s) => acc + setVolume(s), 0);
}

/** Agrupa séries por nome de exercício, mantendo a ordem de inserção. */
export function groupByExercise(sets: WorkoutSet[]) {
  const map = new Map<string, WorkoutSet[]>();
  for (const s of sets) {
    if (!map.has(s.exerciseName)) map.set(s.exerciseName, []);
    map.get(s.exerciseName)!.push(s);
  }
  return map;
}

/** Maior carga levantada num conjunto de séries (para exibir "recorde" rápido). */
export function maxCarga(sets: WorkoutSet[]) {
  return sets.reduce((max, s) => Math.max(max, s.carga), 0);
}

/**
 * Evolução por dia de um exercício específico: pega a maior carga registrada
 * em cada dia (proxy simples de progressão de força).
 */
export function exerciseEvolution(sets: WorkoutSet[], exerciseName: string) {
  const filtered = sets
    .filter((s) => s.exerciseName === exerciseName)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const byDay = new Map<string, number>();
  for (const s of filtered) {
    const key = localDateKey(s.date);
    byDay.set(key, Math.max(byDay.get(key) ?? 0, s.carga));
  }

  return Array.from(byDay.entries()).map(([date, carga]) => ({ date, carga }));
}

/** Lista de exercícios já registrados alguma vez (para o seletor de evolução). */
export function distinctExerciseNames(sets: WorkoutSet[]) {
  return Array.from(new Set(sets.map((s) => s.exerciseName))).sort();
}

/** Nomes de blocos de treino (Treino A/B/C…) já usados nas séries registradas,
 * na ordem em que apareceram pela primeira vez — evita uma barra única e
 * gigante acumulando todos os exercícios de todos os treinos. */
export function distinctBlockLabels(sets: WorkoutSet[]) {
  const seen: string[] = [];
  for (const s of sets) {
    const label = s.blockLabel ?? "Outros";
    if (!seen.includes(label)) seen.push(label);
  }
  return seen;
}

/** Nomes de exercícios distintos registrados dentro de um bloco de treino específico. */
export function distinctExerciseNamesInBlock(sets: WorkoutSet[], blockLabel: string) {
  const inBlock = sets.filter((s) => (s.blockLabel ?? "Outros") === blockLabel);
  return distinctExerciseNames(inBlock);
}

export interface WorkoutSummary {
  durationMinutes: number;
  exercisesCount: number;
  seriesCount: number;
  prs: { exerciseName: string; deltaKg: number }[];
}

/**
 * Resumo do treino do dia pra um bloco específico. `allSets` deve conter o
 * histórico completo (não só hoje) — é o que permite comparar com a carga
 * anterior e detectar recordes (PRs).
 */
export function buildWorkoutSummary(
  allSets: WorkoutSet[],
  blockId: string,
  now: Date = new Date(),
): WorkoutSummary {
  const todayKey = localDateKey(now);
  const todayForBlock = allSets.filter(
    (s) => s.blockId === blockId && localDateKey(s.date) === todayKey,
  );

  const byExercise = groupByExercise(todayForBlock);
  const prs: { exerciseName: string; deltaKg: number }[] = [];
  for (const [exerciseName, items] of byExercise) {
    const todayMax = maxCarga(items);
    const previousBest = bestSetBefore(allSets, exerciseName, todayKey);
    if (previousBest && todayMax > previousBest.carga) {
      prs.push({ exerciseName, deltaKg: +(todayMax - previousBest.carga).toFixed(1) });
    }
  }

  const firstSetTime = todayForBlock.reduce((min, s) => Math.min(min, +new Date(s.date)), +now);
  const durationMinutes =
    todayForBlock.length > 0 ? Math.max(1, Math.round((+now - firstSetTime) / 60000)) : 0;

  return {
    durationMinutes,
    exercisesCount: byExercise.size,
    seriesCount: todayForBlock.length,
    prs,
  };
}
