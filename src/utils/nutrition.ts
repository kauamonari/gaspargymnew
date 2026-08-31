import type { Food } from "@/data/foods";
import type { Profile, Meal } from "@/storage/storage";
import { ACTIVITY_LEVELS } from "@/storage/storage";
import { isSameLocalDay } from "@/utils/date";

export function calcMealFromFood(food: Food, gramas: number) {
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
  const adjust = p.objetivo === "bulking" ? 1.15 : p.objetivo === "cutting" ? 0.8 : 1;
  return Math.round(tdee * adjust);
}

export function calcMacroGoals(p: Profile) {
  const cals = calcDailyCalories(p);
  const proteina = Math.round(p.peso * (p.objetivo === "cutting" ? 2.2 : 1.8));
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
