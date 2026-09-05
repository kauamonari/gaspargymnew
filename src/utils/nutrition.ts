import type { Food } from "@/data/foods";
import type { Profile, Meal } from "@/storage/storage";
import { ACTIVITY_LEVELS } from "@/storage/storage";
import { isSameLocalDay } from "@/utils/date";

type NutrientSource = Pick<Food, "calorias" | "proteina" | "carbo" | "gordura" | "gramas">;

/** Aceita qualquer fonte com esses 5 campos — tanto os alimentos locais
 * (Food) quanto resultados de busca online (OnlineFoodResult) satisfazem
 * isso estruturalmente, sem precisar de conversão. */
export function calcMealFromFood(food: NutrientSource, gramas: number) {
  const factor = gramas / food.gramas;
  return {
    calorias: Math.round(food.calorias * factor),
    proteina: +(food.proteina * factor).toFixed(1),
    carbo: +(food.carbo * factor).toFixed(1),
    gordura: +(food.gordura * factor).toFixed(1),
  };
}

// Mifflin-St Jeor
export function calcBMR(p: Profile) {
  const base = 10 * p.peso + 6.25 * p.altura - 5 * p.idade;
  return p.sexo === "M" ? base + 5 : base - 161;
}

export function calcDailyCalories(p: Profile) {
  const activityFactor = ACTIVITY_LEVELS.find((a) => a.id === p.nivelAtividade)?.factor ?? 1.55;
  const tdee = calcBMR(p) * activityFactor;
  // "performance" não é um objetivo de superávit/déficit — mantém calorias
  // de manutenção, só muda a proteína (ver calcMacroGoals).
  const adjust = p.objetivo === "bulking" ? 1.15 : p.objetivo === "cutting" ? 0.8 : 1;
  return Math.round(tdee * adjust);
}

export function calcMacroGoals(p: Profile) {
  const cals = calcDailyCalories(p);
  const proteinaPorKg = p.objetivo === "cutting" ? 2.2 : p.objetivo === "performance" ? 2.0 : 1.8;
  const proteina = Math.round(p.peso * proteinaPorKg);
  const gordura = Math.round((cals * 0.25) / 9);
  const carbo = Math.max(0, Math.round((cals - proteina * 4 - gordura * 9) / 4));
  return { calorias: cals, proteina, carbo, gordura };
}

export function sumMeals(meals: Meal[]) {
  return meals.reduce(
    (acc, m) => ({
      calorias: acc.calorias + m.calorias,
      proteina: +(acc.proteina + m.proteina).toFixed(1),
      carbo: +(acc.carbo + m.carbo).toFixed(1),
      gordura: +(acc.gordura + m.gordura).toFixed(1),
    }),
    { calorias: 0, proteina: 0, carbo: 0, gordura: 0 },
  );
}

export function isSameDay(a: string, b: string) {
  return isSameLocalDay(a, b);
}
