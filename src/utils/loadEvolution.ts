import type { WorkoutSet } from "@/storage/storage";
import { localDateKey } from "@/utils/date";

export interface SetEntry {
  carga: number;
  reps: number;
}

export interface ExerciseSession {
  dateKey: string;
  isoDate: string;
  sets: SetEntry[];
  /** Maior carga da sessão (empate desfeito pela maior repetição nessa carga). */
  bestCarga: number;
  bestCargaReps: number;
}

/** Agrupa as séries de UM exercício em sessões (uma por dia), preservando
 * cada série individual — nunca reduzimos isso a "volume". */
export function exerciseSessions(sets: WorkoutSet[], exerciseName: string): ExerciseSession[] {
  const filtered = sets.filter((s) => s.exerciseName === exerciseName);
  const map = new Map<string, ExerciseSession>();

  for (const s of filtered) {
    const dateKey = localDateKey(s.date);
    if (!map.has(dateKey)) {
      map.set(dateKey, { dateKey, isoDate: s.date, sets: [], bestCarga: 0, bestCargaReps: 0 });
    }
    const session = map.get(dateKey)!;
    session.sets.push({ carga: s.carga, reps: s.reps });
    if (
      s.carga > session.bestCarga ||
      (s.carga === session.bestCarga && s.reps > session.bestCargaReps)
    ) {
      session.bestCarga = s.carga;
      session.bestCargaReps = s.reps;
    }
    if (s.date > session.isoDate) session.isoDate = s.date;
  }

  return Array.from(map.values()).sort((a, b) =>
    a.dateKey < b.dateKey ? -1 : a.dateKey > b.dateKey ? 1 : 0,
  );
}

export type LoadChange =
  | { kind: "increase"; deltaKg: number }
  | { kind: "decrease"; deltaKg: number }
  | { kind: "same-more-reps"; deltaReps: number }
  | { kind: "same" };

/** Compara a carga de uma sessão com a anterior. A redução não é tratada como
 * "ruim" — só informamos a mudança, sem julgamento. */
export function compareLoad(
  current: { bestCarga: number; bestCargaReps: number },
  previous: { bestCarga: number; bestCargaReps: number } | undefined,
): LoadChange | null {
  if (!previous) return null;
  if (current.bestCarga > previous.bestCarga) {
    return { kind: "increase", deltaKg: +(current.bestCarga - previous.bestCarga).toFixed(1) };
  }
  if (current.bestCarga < previous.bestCarga) {
    return { kind: "decrease", deltaKg: +(previous.bestCarga - current.bestCarga).toFixed(1) };
  }
  if (current.bestCargaReps > previous.bestCargaReps) {
    return { kind: "same-more-reps", deltaReps: current.bestCargaReps - previous.bestCargaReps };
  }
  return { kind: "same" };
}

export interface ExerciseWeek {
  weekKey: string;
  label: string;
  bestCarga: number;
  bestCargaReps: number;
  sessions: ExerciseSession[];
}

/** Segunda-feira da semana de uma data — usada como chave de agrupamento semanal. */
function mondayKey(iso: string): string {
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);
  const day = (d.getDay() + 6) % 7; // 0 = segunda
  d.setDate(d.getDate() - day);
  return localDateKey(d);
}

/** Agrupa sessões por semana (segunda a domingo), rotulando em ordem
 * cronológica: Semana 1, Semana 2… */
export function exerciseWeeks(sessions: ExerciseSession[]): ExerciseWeek[] {
  const map = new Map<string, ExerciseWeek>();
  for (const s of sessions) {
    const key = mondayKey(s.isoDate);
    if (!map.has(key))
      map.set(key, { weekKey: key, label: "", bestCarga: 0, bestCargaReps: 0, sessions: [] });
    const w = map.get(key)!;
    w.sessions.push(s);
    if (
      s.bestCarga > w.bestCarga ||
      (s.bestCarga === w.bestCarga && s.bestCargaReps > w.bestCargaReps)
    ) {
      w.bestCarga = s.bestCarga;
      w.bestCargaReps = s.bestCargaReps;
    }
  }
  const weeks = Array.from(map.values()).sort((a, b) => (a.weekKey < b.weekKey ? -1 : 1));
  weeks.forEach((w, i) => (w.label = `Semana ${i + 1}`));
  return weeks;
}

/** Sessões dentro do mês corrente (para a visão mensal). */
export function sessionsThisMonth(sessions: ExerciseSession[]): ExerciseSession[] {
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return sessions.filter((s) => s.dateKey.startsWith(monthKey));
}

/** A melhor série já registrada pro exercício (maior carga; empate pela maior repetição). */
export function bestSetEver(sets: WorkoutSet[], exerciseName: string): SetEntry | null {
  const filtered = sets.filter((s) => s.exerciseName === exerciseName);
  if (filtered.length === 0) return null;
  return filtered.reduce<SetEntry>(
    (best, s) =>
      s.carga > best.carga || (s.carga === best.carga && s.reps > best.reps) ? s : best,
    { carga: 0, reps: 0 },
  );
}

export interface ExerciseRecord {
  exerciseName: string;
  carga: number;
  reps: number;
  lastDate: string;
}

/** Recorde (melhor série) de cada exercício com histórico — pra seção "Seus recordes". */
export function allExerciseRecords(sets: WorkoutSet[]): ExerciseRecord[] {
  const byExercise = new Map<string, { carga: number; reps: number; lastDate: string }>();
  for (const s of sets) {
    const entry = byExercise.get(s.exerciseName);
    if (!entry) {
      byExercise.set(s.exerciseName, { carga: s.carga, reps: s.reps, lastDate: s.date });
      continue;
    }
    if (s.carga > entry.carga || (s.carga === entry.carga && s.reps > entry.reps)) {
      entry.carga = s.carga;
      entry.reps = s.reps;
    }
    if (s.date > entry.lastDate) entry.lastDate = s.date;
  }
  return Array.from(byExercise.entries())
    .map(([exerciseName, r]) => ({ exerciseName, ...r }))
    .sort((a, b) => (a.lastDate < b.lastDate ? 1 : -1));
}
