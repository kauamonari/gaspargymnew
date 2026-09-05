export type WeightUnit = "kg" | "lb";

const KG_PER_LB = 0.453592;

/** Converte um peso corporal guardado em kg (formato canônico interno) para
 * a unidade escolhida pelo usuário, só para exibição. */
export function kgToDisplayWeight(kg: number, unit: WeightUnit): number {
  return unit === "lb" ? +(kg / KG_PER_LB).toFixed(1) : +kg.toFixed(1);
}

/** Converte um valor digitado pelo usuário (na unidade escolhida) de volta
 * para kg, que é o que sempre guardamos no storage. */
export function displayWeightToKg(value: number, unit: WeightUnit): number {
  return unit === "lb" ? +(value * KG_PER_LB).toFixed(2) : value;
}
