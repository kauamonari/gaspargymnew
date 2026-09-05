// Web equivalent of AsyncStorage using localStorage.
import { pushIfLoggedIn } from "@/lib/cloudSync";

const isBrowser = typeof window !== "undefined";

export const storage = {
  get<T>(key: string, fallback: T): T {
    if (!isBrowser) return fallback;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T) {
    if (!isBrowser) return;
    window.localStorage.setItem(key, JSON.stringify(value));
    // Se o usuário estiver logado, agenda o envio desse estado pra nuvem —
    // é um no-op silencioso se não houver sessão ou Supabase configurado.
    pushIfLoggedIn();
  },
  remove(key: string) {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  },
};

export const STORAGE_KEYS = {
  meals: "fitdiet:meals",
  weights: "fitdiet:weights",
  profile: "fitdiet:profile",
  workoutSets: "fitdiet:workoutSets",
  workoutBlocks: "fitdiet:workoutBlocks",
  mealTypes: "fitdiet:mealTypes",
  customExercises: "fitdiet:customExercises",
  exerciseRestSeconds: "fitdiet:exerciseRestSeconds",
  bodyMeasurements: "fitdiet:bodyMeasurements",
  trackedMeasurements: "fitdiet:trackedMeasurements",
  settings: "fitdiet:settings",
} as const;

// Antes era uma união fixa de literais — agora é string pra permitir o
// usuário criar/remover seções de refeição livremente.
export type MealType = string;

export interface MealTypeDef {
  id: MealType;
  label: string;
  emoji: string;
  hour: number;
}

export const DEFAULT_MEAL_TYPES: MealTypeDef[] = [
  { id: "cafe_manha", label: "Café da manhã", emoji: "☕", hour: 8 },
  { id: "almoco", label: "Almoço", emoji: "🍽️", hour: 12 },
  { id: "cafe_tarde", label: "Café da tarde", emoji: "🥐", hour: 16 },
  { id: "janta", label: "Janta", emoji: "🍲", hour: 20 },
  { id: "ceia", label: "Ceia", emoji: "🌙", hour: 22 },
];

/** Lê as seções de refeição configuradas pelo usuário (ou os padrões, se
 * ele nunca mexeu nisso). */
export function getMealTypes(): MealTypeDef[] {
  return storage.get<MealTypeDef[]>(STORAGE_KEYS.mealTypes, DEFAULT_MEAL_TYPES);
}

export function saveMealTypes(types: MealTypeDef[]) {
  storage.set(STORAGE_KEYS.mealTypes, types);
}

export interface Meal {
  id: string;
  foodId?: number;
  nome: string;
  gramas: number;
  calorias: number;
  proteina: number;
  carbo: number;
  gordura: number;
  mealType: MealType;
  date: string; // ISO
  custom?: boolean;
  /** Presentes quando o alimento foi registrado por unidade (ex: "2 ovos")
   * em vez de gramas — `gramas` acima continua sendo o equivalente em
   * gramas, usado nos cálculos; esses dois campos são só pra exibição. */
  quantidadeUnidades?: number;
  unidadeNome?: string;
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string; // ISO
}

export type Goal = "bulking" | "cutting" | "manutencao" | "performance";

export type ActivityLevel = "sedentario" | "leve" | "moderado" | "intenso" | "atleta";

export const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; desc: string; factor: number }[] =
  [
    { id: "sedentario", label: "Sedentário", desc: "Pouco ou nenhum exercício", factor: 1.2 },
    { id: "leve", label: "Leve", desc: "1 a 3x por semana", factor: 1.375 },
    { id: "moderado", label: "Moderado", desc: "3 a 5x por semana", factor: 1.55 },
    { id: "intenso", label: "Intenso", desc: "6 a 7x por semana", factor: 1.725 },
    { id: "atleta", label: "Atleta", desc: "Treino pesado + trabalho físico", factor: 1.9 },
  ];

/** Nível de experiência com treino — coletado no onboarding, hoje é
 * informativo (mostrado no Perfil); não afeta cálculos. */
export type ExperienceLevel = "iniciante" | "intermediario" | "avancado";

export const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string; desc: string }[] = [
  { id: "iniciante", label: "Iniciante", desc: "Começando agora ou primeiro ano de treino" },
  { id: "intermediario", label: "Intermediário", desc: "Já treina com consistência há um tempo" },
  { id: "avancado", label: "Avançado", desc: "Treina há anos e conhece bem seu corpo" },
];

export interface Profile {
  nome?: string;
  peso: number;
  altura: number;
  idade: number;
  sexo: "M" | "F";
  objetivo: Goal;
  nivelAtividade: ActivityLevel;
  pesoMeta?: number;
  /** Nível de experiência com treino, coletado no onboarding. */
  nivel?: ExperienceLevel;
  /** Quantos dias por semana o usuário pretende treinar — usado pra
   * comparar treinos planejados x realizados (dashboard/resumo semanal). */
  diasTreinoSemana?: number;
  /** Marca que o usuário já passou pelo fluxo de primeira viagem, pra não
   * ser interrompido de novo. Usuários que já tinham perfil preenchido antes
   * dessa flag existir são tratados como "já onboarded" automaticamente. */
  onboardingCompleto?: boolean;
}

export const DEFAULT_PROFILE: Profile = {
  peso: 75,
  altura: 175,
  idade: 25,
  sexo: "M",
  objetivo: "manutencao",
  nivelAtividade: "moderado",
};

/** Lê o perfil do storage mesclando com os padrões, pra perfis salvos antes
 * de um novo campo existir (ex: nivelAtividade) não quebrarem o app. */
export function getProfile(): Profile {
  return { ...DEFAULT_PROFILE, ...storage.get<Partial<Profile>>(STORAGE_KEYS.profile, {}) };
}

/** Fase da série dentro do exercício — permite separar a carga de aquecimento
 * e de reconhecimento da carga de trabalho real ao calcular médias/recordes. */
export type SetType = "aquecimento" | "reconhecimento" | "trabalho";

export const SET_TYPES: { id: SetType; label: string; shortLabel: string }[] = [
  { id: "aquecimento", label: "Aquecimento", shortLabel: "Aquec." },
  { id: "reconhecimento", label: "Reconhecimento de carga", shortLabel: "Reconh." },
  { id: "trabalho", label: "Carga de trabalho", shortLabel: "Trabalho" },
];

export interface WorkoutSet {
  id: string;
  exerciseId?: number;
  exerciseName: string;
  carga: number; // kg
  reps: number;
  date: string; // ISO
  blockId?: string;
  blockLabel?: string;
  custom?: boolean;
  /** Ausente em séries antigas — tratar como "trabalho" (comportamento anterior). */
  tipo?: SetType;
}

export interface WorkoutBlock {
  id: string;
  label: string;
  exerciseIds: number[];
}

export const DEFAULT_WORKOUT_BLOCKS: WorkoutBlock[] = [
  { id: "treino-a", label: "Treino A", exerciseIds: [] },
  { id: "treino-b", label: "Treino B", exerciseIds: [] },
  { id: "treino-c", label: "Treino C", exerciseIds: [] },
];

/** Exercício criado pelo próprio usuário, fora da lista pré-definida do app. */
export interface CustomExercise {
  id: number;
  nome: string;
  grupo: string;
}

export function getCustomExercises(): CustomExercise[] {
  return storage.get<CustomExercise[]>(STORAGE_KEYS.customExercises, []);
}

export function saveCustomExercises(items: CustomExercise[]) {
  storage.set(STORAGE_KEYS.customExercises, items);
}

/** Tempo de descanso padrão (segundos) quando o exercício não tem configuração própria. */
export const DEFAULT_REST_SECONDS = 90;

/** Tempo de descanso configurado por exercício (chave = id do exercício, como string). */
export function getExerciseRestSeconds(): Record<string, number> {
  return storage.get<Record<string, number>>(STORAGE_KEYS.exerciseRestSeconds, {});
}

export function saveExerciseRestSeconds(map: Record<string, number>) {
  storage.set(STORAGE_KEYS.exerciseRestSeconds, map);
}

/** Preferências gerais do app (Configurações), separadas do Profile porque
 * não são "dados da pessoa" e sim ajustes de comportamento do app. */
export interface AppSettings {
  /** Tempo de descanso padrão pra exercícios sem configuração própria —
   * substitui a constante fixa DEFAULT_REST_SECONDS quando o usuário muda. */
  restSecondsPadrao: number;
  /** Unidade de exibição pra peso corporal (Evolução Corporal, Perfil). O
   * valor guardado internamente é sempre em kg — isso só afeta exibição. */
  unidadePeso: "kg" | "lb";
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
  restSecondsPadrao: DEFAULT_REST_SECONDS,
  unidadePeso: "kg",
};

export function getAppSettings(): AppSettings {
  return {
    ...DEFAULT_APP_SETTINGS,
    ...storage.get<Partial<AppSettings>>(STORAGE_KEYS.settings, {}),
  };
}

export function saveAppSettings(settings: AppSettings) {
  storage.set(STORAGE_KEYS.settings, settings);
}

/** Medidas corporais que o usuário pode escolher acompanhar em Evolução Corporal. */
export type MeasurementKey = "braco" | "peito" | "cintura" | "abdomen" | "coxa" | "panturrilha";

export const MEASUREMENT_LABELS: Record<MeasurementKey, string> = {
  braco: "Braço",
  peito: "Peito",
  cintura: "Cintura",
  abdomen: "Abdômen",
  coxa: "Coxa",
  panturrilha: "Panturrilha",
};

export const ALL_MEASUREMENT_KEYS: MeasurementKey[] = [
  "braco",
  "peito",
  "cintura",
  "abdomen",
  "coxa",
  "panturrilha",
];

/** Um "checkup" de medidas num dia — guarda só as medidas que o usuário
 * escolheu preencher naquele registro (nem todas precisam vir juntas). */
export interface BodyMeasurementEntry {
  id: string;
  date: string; // ISO
  values: Partial<Record<MeasurementKey, number>>; // cm
}

export function getBodyMeasurements(): BodyMeasurementEntry[] {
  return storage.get<BodyMeasurementEntry[]>(STORAGE_KEYS.bodyMeasurements, []);
}

export function saveBodyMeasurements(entries: BodyMeasurementEntry[]) {
  storage.set(STORAGE_KEYS.bodyMeasurements, entries);
}

/** Quais medidas o usuário decidiu acompanhar — todas por padrão, ele pode
 * desligar as que não usa. */
export function getTrackedMeasurements(): MeasurementKey[] {
  return storage.get<MeasurementKey[]>(STORAGE_KEYS.trackedMeasurements, ALL_MEASUREMENT_KEYS);
}

export function saveTrackedMeasurements(keys: MeasurementKey[]) {
  storage.set(STORAGE_KEYS.trackedMeasurements, keys);
}
