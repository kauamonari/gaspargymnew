// Web equivalent of AsyncStorage using localStorage.
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
}

export interface WeightEntry {
  id: string;
  weight: number;
  date: string; // ISO
}

export type Goal = "bulking" | "cutting" | "manutencao";

export type ActivityLevel = "sedentario" | "leve" | "moderado" | "intenso" | "atleta";

export const ACTIVITY_LEVELS: { id: ActivityLevel; label: string; desc: string; factor: number }[] =
  [
    { id: "sedentario", label: "Sedentário", desc: "Pouco ou nenhum exercício", factor: 1.2 },
    { id: "leve", label: "Leve", desc: "1 a 3x por semana", factor: 1.375 },
    { id: "moderado", label: "Moderado", desc: "3 a 5x por semana", factor: 1.55 },
    { id: "intenso", label: "Intenso", desc: "6 a 7x por semana", factor: 1.725 },
    { id: "atleta", label: "Atleta", desc: "Treino pesado + trabalho físico", factor: 1.9 },
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
