// Busca de alimentos na Open Food Facts (https://world.openfoodfacts.org) —
// base de dados aberta, gratuita, sem necessidade de API key. Usada só como
// fallback quando o alimento não está na lista local (src/data/foods.ts).
export interface OnlineFoodResult {
  id: string;
  nome: string;
  marca?: string;
  calorias: number;
  proteina: number;
  carbo: number;
  gordura: number;
  gramas: number; // sempre 100 — os dados da OFF vêm por 100g
  unidade?: undefined;
  origem: "online";
}

interface OffProduct {
  code?: string;
  product_name?: string;
  product_name_pt?: string;
  brands?: string;
  nutriments?: Record<string, number>;
}

interface OffSearchResponse {
  products?: OffProduct[];
}

/** Busca alimentos por nome na Open Food Facts. Lança erro em falha de rede
 * ou resposta não-OK — quem chama decide como mostrar isso ao usuário. */
export async function searchFoodOnline(
  query: string,
  signal?: AbortSignal,
): Promise<OnlineFoodResult[]> {
  const params = new URLSearchParams({
    search_terms: query,
    search_simple: "1",
    action: "process",
    json: "1",
    page_size: "20",
    lc: "pt",
    fields: "code,product_name,product_name_pt,brands,nutriments",
  });

  const res = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?${params}`, { signal });
  if (!res.ok) throw new Error(`Open Food Facts respondeu ${res.status}`);

  const data = (await res.json()) as OffSearchResponse;
  const products = data.products ?? [];

  const results: OnlineFoodResult[] = [];
  for (const p of products) {
    const nome = p.product_name_pt || p.product_name;
    const n = p.nutriments ?? {};
    const calorias = n["energy-kcal_100g"];
    // Descarta produtos sem nome ou sem dado calórico — comuns na OFF
    // (cadastro incompleto pela comunidade) e inúteis pro nosso cálculo.
    if (!nome || calorias == null) continue;

    results.push({
      id: p.code ?? crypto.randomUUID(),
      nome,
      marca: p.brands?.split(",")[0]?.trim(),
      calorias: Math.round(calorias),
      proteina: +(n.proteins_100g ?? 0).toFixed(1),
      carbo: +(n.carbohydrates_100g ?? 0).toFixed(1),
      gordura: +(n.fat_100g ?? 0).toFixed(1),
      gramas: 100,
      origem: "online",
    });
  }

  return results.slice(0, 15);
}
