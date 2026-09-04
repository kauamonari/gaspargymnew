export type MuscleGroup =
  "peito" | "costas" | "pernas" | "ombro" | "biceps" | "triceps" | "abdomen" | "cardio";

export const MUSCLE_GROUPS: { id: MuscleGroup; label: string; emoji: string }[] = [
  { id: "peito", label: "Peito", emoji: "🏋️" },
  { id: "costas", label: "Costas", emoji: "🔙" },
  { id: "pernas", label: "Pernas", emoji: "🦵" },
  { id: "ombro", label: "Ombro", emoji: "🤸" },
  { id: "biceps", label: "Bíceps", emoji: "💪" },
  { id: "triceps", label: "Tríceps", emoji: "💪" },
  { id: "abdomen", label: "Abdômen", emoji: "🔥" },
  { id: "cardio", label: "Cardio", emoji: "🏃" },
];

export interface Exercise {
  id: number;
  nome: string;
  grupo: MuscleGroup;
}

export const EXERCISES: Exercise[] = [
  // Peito
  { id: 1, nome: "Supino reto (barra)", grupo: "peito" },
  { id: 2, nome: "Supino inclinado (halteres)", grupo: "peito" },
  { id: 3, nome: "Supino declinado", grupo: "peito" },
  { id: 4, nome: "Crucifixo (halteres)", grupo: "peito" },
  { id: 5, nome: "Crossover", grupo: "peito" },
  { id: 6, nome: "Peck deck", grupo: "peito" },
  { id: 7, nome: "Flexão de braço", grupo: "peito" },

  // Costas
  { id: 8, nome: "Puxada frontal (pulley)", grupo: "costas" },
  { id: 9, nome: "Remada curvada (barra)", grupo: "costas" },
  { id: 10, nome: "Remada cavalinho", grupo: "costas" },
  { id: 11, nome: "Remada baixa (cabo)", grupo: "costas" },
  { id: 12, nome: "Barra fixa", grupo: "costas" },
  { id: 13, nome: "Levantamento terra", grupo: "costas" },
  { id: 14, nome: "Pulldown", grupo: "costas" },

  // Pernas
  { id: 15, nome: "Agachamento livre", grupo: "pernas" },
  { id: 16, nome: "Leg press", grupo: "pernas" },
  { id: 17, nome: "Cadeira extensora", grupo: "pernas" },
  { id: 18, nome: "Cadeira flexora", grupo: "pernas" },
  { id: 19, nome: "Stiff", grupo: "pernas" },
  { id: 20, nome: "Afundo (passada)", grupo: "pernas" },
  { id: 21, nome: "Cadeira adutora", grupo: "pernas" },
  { id: 22, nome: "Cadeira abdutora", grupo: "pernas" },
  { id: 23, nome: "Panturrilha em pé", grupo: "pernas" },
  { id: 24, nome: "Hack machine", grupo: "pernas" },

  // Ombro
  { id: 25, nome: "Desenvolvimento (halteres)", grupo: "ombro" },
  { id: 26, nome: "Desenvolvimento militar (barra)", grupo: "ombro" },
  { id: 27, nome: "Elevação lateral", grupo: "ombro" },
  { id: 28, nome: "Elevação frontal", grupo: "ombro" },
  { id: 29, nome: "Remada alta", grupo: "ombro" },
  { id: 30, nome: "Crucifixo inverso", grupo: "ombro" },

  // Bíceps
  { id: 31, nome: "Rosca direta (barra)", grupo: "biceps" },
  { id: 32, nome: "Rosca alternada (halteres)", grupo: "biceps" },
  { id: 33, nome: "Rosca scott", grupo: "biceps" },
  { id: 34, nome: "Rosca martelo", grupo: "biceps" },
  { id: 35, nome: "Rosca concentrada", grupo: "biceps" },

  // Tríceps
  { id: 36, nome: "Tríceps pulley (corda)", grupo: "triceps" },
  { id: 37, nome: "Tríceps testa", grupo: "triceps" },
  { id: 38, nome: "Tríceps francês", grupo: "triceps" },
  { id: 39, nome: "Mergulho no banco", grupo: "triceps" },
  { id: 40, nome: "Supino fechado", grupo: "triceps" },

  // Abdômen
  { id: 41, nome: "Abdominal supra", grupo: "abdomen" },
  { id: 42, nome: "Abdominal infra", grupo: "abdomen" },
  { id: 43, nome: "Prancha", grupo: "abdomen" },
  { id: 44, nome: "Elevação de pernas", grupo: "abdomen" },
  { id: 45, nome: "Abdominal na polia", grupo: "abdomen" },

  // Cardio
  { id: 46, nome: "Esteira", grupo: "cardio" },
  { id: 47, nome: "Bicicleta ergométrica", grupo: "cardio" },
  { id: 48, nome: "Elíptico", grupo: "cardio" },
  { id: 49, nome: "Pular corda", grupo: "cardio" },
  { id: 50, nome: "HIIT", grupo: "cardio" },
];
