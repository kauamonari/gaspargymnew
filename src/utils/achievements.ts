import type {
  BodyMeasurementEntry,
  Meal,
  Profile,
  WeightEntry,
  WorkoutSet,
} from "@/storage/storage";
import { bestStreakEver, buildSessions, lifetimePRCount } from "@/utils/dashboard";

export interface Achievement {
  id: string;
  emoji: string;
  label: string;
  description: string;
  unlocked: boolean;
}

export interface AchievementInput {
  sets: WorkoutSet[];
  meals: Meal[];
  weights: WeightEntry[];
  measurements: BodyMeasurementEntry[];
  photoCount: number;
  profile: Profile;
}

/** Todas as conquistas são calculadas a partir dos dados reais já
 * existentes (treinos, dieta, evolução) — nada fica "destravado" numa
 * tabela separada, então nunca dessincroniza do histórico de verdade. */
export function computeAchievements({
  sets,
  meals,
  weights,
  measurements,
  photoCount,
  profile,
}: AchievementInput): Achievement[] {
  const sessionCount = buildSessions(sets).length;
  const prCount = lifetimePRCount(sets);
  const streak = bestStreakEver(meals, sets);
  const perfilCompleto = !!(profile.nome && profile.nivel && profile.diasTreinoSemana);

  return [
    {
      id: "primeiro-treino",
      emoji: "🏋️",
      label: "Primeiro treino",
      description: "Registre seu primeiro treino",
      unlocked: sessionCount >= 1,
    },
    {
      id: "10-treinos",
      emoji: "🔥",
      label: "10 treinos",
      description: "Complete 10 treinos",
      unlocked: sessionCount >= 10,
    },
    {
      id: "50-treinos",
      emoji: "💯",
      label: "50 treinos",
      description: "Complete 50 treinos",
      unlocked: sessionCount >= 50,
    },
    {
      id: "100-treinos",
      emoji: "🏆",
      label: "100 treinos",
      description: "Complete 100 treinos",
      unlocked: sessionCount >= 100,
    },
    {
      id: "sequencia-7",
      emoji: "📅",
      label: "Sequência de 7 dias",
      description: "Treine ou registre a dieta 7 dias seguidos",
      unlocked: streak >= 7,
    },
    {
      id: "sequencia-30",
      emoji: "🗓️",
      label: "Sequência de 30 dias",
      description: "Mantenha 30 dias seguidos de atividade",
      unlocked: streak >= 30,
    },
    {
      id: "primeiro-pr",
      emoji: "🥇",
      label: "Primeiro PR",
      description: "Bata seu primeiro recorde de carga",
      unlocked: prCount >= 1,
    },
    {
      id: "5-prs",
      emoji: "🏅",
      label: "5 PRs",
      description: "Bata 5 recordes de carga",
      unlocked: prCount >= 5,
    },
    {
      id: "25-prs",
      emoji: "🎖️",
      label: "25 PRs",
      description: "Bata 25 recordes de carga",
      unlocked: prCount >= 25,
    },
    {
      id: "primeira-refeicao",
      emoji: "🍽️",
      label: "Primeira refeição",
      description: "Registre sua primeira refeição",
      unlocked: meals.length >= 1,
    },
    {
      id: "primeiro-peso",
      emoji: "⚖️",
      label: "Primeiro peso",
      description: "Registre seu primeiro peso",
      unlocked: weights.length >= 1,
    },
    {
      id: "meta-definida",
      emoji: "🎯",
      label: "Meta definida",
      description: "Defina uma meta de peso",
      unlocked: !!profile.pesoMeta,
    },
    {
      id: "primeira-medida",
      emoji: "📏",
      label: "Primeira medida",
      description: "Registre sua primeira medida corporal",
      unlocked: measurements.length >= 1,
    },
    {
      id: "primeira-foto",
      emoji: "📸",
      label: "Primeira foto",
      description: "Adicione sua primeira foto de evolução",
      unlocked: photoCount >= 1,
    },
    {
      id: "perfil-completo",
      emoji: "✅",
      label: "Perfil completo",
      description: "Complete nome, nível e dias de treino no Perfil",
      unlocked: perfilCompleto,
    },
  ];
}
