import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search, Check, Zap, Apple, Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { FOODS, type Food } from "@/data/foods";
import { NumberField } from "@/components/NumberField";
import { SurfaceCard } from "@/components/SurfaceCard";
import { searchFoodOnline, type OnlineFoodResult } from "@/lib/openFoodFacts";
import {
  STORAGE_KEYS,
  storage,
  getMealTypes,
  DEFAULT_MEAL_TYPES,
  type Meal,
  type MealType,
  type MealTypeDef,
} from "@/storage/storage";
import { calcMealFromFood } from "@/utils/nutrition";

type SearchableFood = Food | OnlineFoodResult;

const searchSchema = z.object({
  type: z.string().optional(),
});

export const Route = createFileRoute("/add")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Adicionar refeição" },
      {
        name: "description",
        content: "Pesquise alimentos ou registre calorias extras manualmente.",
      },
    ],
  }),
  component: AddMeal,
});

function defaultMealType(types: MealTypeDef[]): MealType {
  if (types.length === 0) return "";
  const h = new Date().getHours();
  // Escolhe a seção com o horário mais próximo da hora atual — funciona
  // com qualquer conjunto de seções, incluindo as que o usuário criou.
  let closest = types[0];
  let closestDiff = Infinity;
  for (const t of types) {
    const diff = Math.min(Math.abs(t.hour - h), 24 - Math.abs(t.hour - h));
    if (diff < closestDiff) {
      closest = t;
      closestDiff = diff;
    }
  }
  return closest.id;
}

function AddMeal() {
  const { type } = Route.useSearch();
  const [mealTypes, setMealTypes] = useState<MealTypeDef[]>(DEFAULT_MEAL_TYPES);
  const [mealType, setMealType] = useState<MealType>(type ?? "");
  const [mode, setMode] = useState<"search" | "custom">("search");

  useEffect(() => {
    const types = getMealTypes();
    setMealTypes(types);
    if (!type) setMealType(defaultMealType(types));
  }, [type]);

  // Search state
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<SearchableFood | null>(null);
  const [gramas, setGramas] = useState(100);
  const [unidades, setUnidades] = useState(1);
  const previewRef = useRef<HTMLDivElement>(null);

  // O card de quantidade/preview fica fixo logo abaixo da busca — ao
  // selecionar um item mais embaixo na lista, ele "abre" fora da área
  // visível. Rola até ele pra ficar óbvio onde o toque foi parar.
  useEffect(() => {
    if (selected) previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selected]);

  // Busca online (Open Food Facts) — só entra em cena quando a lista local
  // não tem o alimento; nunca dispara sozinha, só quando o usuário pede.
  const [onlineResults, setOnlineResults] = useState<OnlineFoodResult[]>([]);
  const [searchingOnline, setSearchingOnline] = useState(false);
  const [onlineError, setOnlineError] = useState(false);

  useEffect(() => {
    setOnlineResults([]);
    setOnlineError(false);
  }, [q]);

  async function handleSearchOnline() {
    const query = q.trim();
    if (!query) return;
    setSearchingOnline(true);
    setOnlineError(false);
    try {
      const found = await searchFoodOnline(query);
      setOnlineResults(found);
      if (found.length === 0) toast("Nenhum resultado encontrado na internet");
    } catch (err) {
      console.error("[add] falha ao buscar alimento online:", err);
      setOnlineError(true);
      toast.error("Não conseguimos buscar na internet agora.");
    } finally {
      setSearchingOnline(false);
    }
  }

  // Custom state
  const [customNome, setCustomNome] = useState("");
  const [customCalorias, setCustomCalorias] = useState(0);
  const [customProteina, setCustomProteina] = useState(0);
  const [customCarbo, setCustomCarbo] = useState(0);
  const [customGordura, setCustomGordura] = useState(0);
  const [customGramas, setCustomGramas] = useState(100);

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return FOODS;
    return FOODS.filter((f) => f.nome.toLowerCase().includes(n));
  }, [q]);

  // Alimentos por unidade (ex: ovo) convertem unidades -> gramas equivalentes
  // aqui; o resto do cálculo (calcMealFromFood) nunca precisa saber disso.
  const gramasEquivalentes = selected?.unidade ? unidades * selected.unidade.gramas : gramas;
  const preview = selected ? calcMealFromFood(selected, gramasEquivalentes || 0) : null;

  function addFromSearch() {
    if (!selected || !preview || gramasEquivalentes <= 0) return;
    const meals = storage.get<Meal[]>(STORAGE_KEYS.meals, []);
    const meal: Meal = {
      id: crypto.randomUUID(),
      ...("origem" in selected ? { custom: true as const } : { foodId: selected.id }),
      nome:
        "origem" in selected && selected.marca
          ? `${selected.nome} (${selected.marca})`
          : selected.nome,
      gramas: gramasEquivalentes,
      ...preview,
      mealType,
      date: new Date().toISOString(),
      ...(selected.unidade && { quantidadeUnidades: unidades, unidadeNome: selected.unidade.nome }),
    };
    storage.set(STORAGE_KEYS.meals, [...meals, meal]);
    toast.success(`${meal.nome} adicionado`);
    // Fica na tela pra permitir adicionar vários alimentos seguidos, sem
    // voltar pra home e perder a seção de refeição escolhida.
    setSelected(null);
    setQ("");
    setGramas(100);
    setUnidades(1);
  }

  function addCustom() {
    if (!customNome.trim() || customCalorias <= 0) return;
    const meals = storage.get<Meal[]>(STORAGE_KEYS.meals, []);
    const meal: Meal = {
      id: crypto.randomUUID(),
      nome: customNome.trim(),
      gramas: customGramas || 100,
      calorias: Math.round(customCalorias),
      proteina: Math.max(0, customProteina),
      carbo: Math.max(0, customCarbo),
      gordura: Math.max(0, customGordura),
      mealType,
      date: new Date().toISOString(),
      custom: true,
    };
    storage.set(STORAGE_KEYS.meals, [...meals, meal]);
    toast.success(`${meal.nome} adicionado`);
    setCustomNome("");
    setCustomCalorias(0);
    setCustomProteina(0);
    setCustomCarbo(0);
    setCustomGordura(0);
    setCustomGramas(100);
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <header className="flex items-center gap-3">
        <Link
          to="/"
          className="rounded-full border border-border bg-card/60 p-2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-display text-2xl font-bold">Adicionar alimento</h1>
      </header>

      <div>
        <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Refeição</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {mealTypes.map((t) => {
            const active = t.id === mealType;
            return (
              <button
                key={t.id}
                onClick={() => setMealType(t.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-glow"
                    : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode switch */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("search")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
            mode === "search"
              ? "border-primary bg-primary/10 text-primary shadow-glow"
              : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Apple className="h-4 w-4" />
          Buscar alimento
        </button>
        <button
          onClick={() => setMode("custom")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
            mode === "custom"
              ? "border-primary bg-primary/10 text-primary shadow-glow"
              : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="h-4 w-4" />
          Calorias extras
        </button>
      </div>

      {mode === "search" ? (
        <>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Pesquisar alimento…"
              className="h-12 w-full rounded-2xl border border-border bg-card/60 pl-11 pr-4 text-sm outline-none ring-primary/40 backdrop-blur transition focus:ring-2"
            />
          </div>

          {selected && preview && (
            <div ref={previewRef}>
              <SurfaceCard className="space-y-4 border-primary/40">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-display text-lg font-semibold">{selected.nome}</h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    trocar
                  </button>
                </div>

                {selected.unidade ? (
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Quantidade ({selected.unidade.nome}
                      {unidades === 1 ? "" : "s"})
                    </span>
                    <NumberField
                      min={0}
                      step={1}
                      value={unidades}
                      onChange={setUnidades}
                      className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-xl font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
                    />
                    <span className="mt-1 block text-[11px] text-muted-foreground">
                      ≈ {gramasEquivalentes}g ({selected.unidade.gramas}g por{" "}
                      {selected.unidade.nome})
                    </span>
                  </label>
                ) : (
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Quantidade (g)
                    </span>
                    <NumberField
                      min={0}
                      value={gramas}
                      onChange={setGramas}
                      className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-xl font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
                    />
                  </label>
                )}

                <div className="grid grid-cols-4 gap-2">
                  <Stat label="kcal" value={preview.calorias} accent />
                  <Stat label="Prot" value={preview.proteina} suffix="g" />
                  <Stat label="Carb" value={preview.carbo} suffix="g" />
                  <Stat label="Gord" value={preview.gordura} suffix="g" />
                </div>

                <button
                  onClick={addFromSearch}
                  className="shadow-glow flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
                >
                  <Check className="h-5 w-5" /> Adicionar à{" "}
                  {mealTypes.find((t) => t.id === mealType)?.label}
                </button>
              </SurfaceCard>
            </div>
          )}

          <ul className="space-y-2">
            {results.map((f) => (
              <li key={f.id}>
                <button
                  onClick={() => {
                    setSelected(f);
                    setGramas(100);
                    setUnidades(1);
                  }}
                  className="w-full text-left"
                >
                  <SurfaceCard
                    className={`flex items-center justify-between p-4 transition-colors ${
                      selected?.id === f.id ? "border-primary/60" : "hover:border-border"
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{f.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {f.calorias} kcal · P{f.proteina} · C{f.carbo} · G{f.gordura} / 100g
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {f.unidade ? `1 ${f.unidade.nome} (${f.unidade.gramas}g)` : "100g"}
                    </span>
                  </SurfaceCard>
                </button>
              </li>
            ))}
          </ul>

          {results.length === 0 && q.trim() && (
            <div className="space-y-3">
              <p className="py-2 text-center text-sm text-muted-foreground">
                Nenhum alimento encontrado na lista.
              </p>
              <button
                onClick={handleSearchOnline}
                disabled={searchingOnline}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:opacity-60"
              >
                {searchingOnline ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
                {searchingOnline ? "Buscando…" : `Buscar "${q.trim()}" na internet`}
              </button>

              {onlineError && (
                <p className="text-center text-xs text-muted-foreground">
                  Não conseguimos buscar agora — verifique sua conexão.
                </p>
              )}

              {onlineResults.length > 0 && (
                <ul className="space-y-2">
                  {onlineResults.map((r) => (
                    <li key={r.id}>
                      <button
                        onClick={() => {
                          setSelected(r);
                          setGramas(100);
                          setUnidades(1);
                        }}
                        className="w-full text-left"
                      >
                        <SurfaceCard
                          className={`flex items-center justify-between p-4 transition-colors ${
                            selected?.id === r.id ? "border-primary/60" : "hover:border-border"
                          }`}
                        >
                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 truncate font-semibold">
                              <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              {r.nome}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {r.marca ? `${r.marca} · ` : ""}
                              {r.calorias} kcal · P{r.proteina} · C{r.carbo} · G{r.gordura} / 100g
                            </p>
                          </div>
                          <span className="shrink-0 text-xs text-muted-foreground">100g</span>
                        </SurfaceCard>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      ) : (
        <SurfaceCard className="space-y-4 border-primary/40">
          <h2 className="font-display text-lg font-semibold">Calorias extras</h2>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Nome (opcional)
            </span>
            <input
              value={customNome}
              onChange={(e) => setCustomNome(e.target.value)}
              placeholder="Ex: Porção de batata frita do restaurante"
              className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm outline-none ring-primary/40 focus:ring-2"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Calorias
              </span>
              <NumberField
                min={0}
                value={customCalorias}
                onChange={setCustomCalorias}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Gramas</span>
              <NumberField
                min={0}
                value={customGramas}
                onChange={setCustomGramas}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Proteína (g)
              </span>
              <NumberField
                min={0}
                value={customProteina}
                onChange={setCustomProteina}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Carbo (g)
              </span>
              <NumberField
                min={0}
                value={customCarbo}
                onChange={setCustomCarbo}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Gordura (g)
              </span>
              <NumberField
                min={0}
                value={customGordura}
                onChange={setCustomGordura}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
          </div>

          <button
            onClick={addCustom}
            disabled={!customNome.trim() || customCalorias <= 0}
            className="shadow-glow flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
          >
            <Check className="h-5 w-5" /> Adicionar à{" "}
            {mealTypes.find((t) => t.id === mealType)?.label}
          </button>
        </SurfaceCard>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  suffix = "",
  accent = false,
}: {
  label: string;
  value: number;
  suffix?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-2 text-center">
      <p className={`font-display text-lg font-bold tabular-nums ${accent ? "text-primary" : ""}`}>
        {value}
        {suffix}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
