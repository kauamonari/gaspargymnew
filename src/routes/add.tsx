import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Search, Check, Zap, Apple } from "lucide-react";
import { z } from "zod";
import { FOODS, type Food } from "@/data/foods";
import { SurfaceCard } from "@/components/SurfaceCard";
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
  const navigate = useNavigate();
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
  const [selected, setSelected] = useState<Food | null>(null);
  const [gramas, setGramas] = useState(100);

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

  const preview = selected ? calcMealFromFood(selected, gramas || 0) : null;

  function addFromSearch() {
    if (!selected || !preview || gramas <= 0) return;
    const meals = storage.get<Meal[]>(STORAGE_KEYS.meals, []);
    const meal: Meal = {
      id: crypto.randomUUID(),
      foodId: selected.id,
      nome: selected.nome,
      gramas,
      ...preview,
      mealType,
      date: new Date().toISOString(),
    };
    storage.set(STORAGE_KEYS.meals, [...meals, meal]);
    navigate({ to: "/" });
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
    navigate({ to: "/" });
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

              <label className="block">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Quantidade (g)
                </span>
                <input
                  type="number"
                  min={1}
                  value={gramas}
                  onChange={(e) => setGramas(Math.max(0, +e.target.value || 0))}
                  className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-xl font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
                />
              </label>

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
          )}

          <ul className="space-y-2">
            {results.map((f) => (
              <li key={f.id}>
                <button
                  onClick={() => {
                    setSelected(f);
                    setGramas(100);
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
                    <span className="text-xs text-muted-foreground">100g</span>
                  </SurfaceCard>
                </button>
              </li>
            ))}
            {results.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                Nenhum alimento encontrado.
              </p>
            )}
          </ul>
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
              <input
                type="number"
                min={0}
                value={customCalorias}
                onChange={(e) => setCustomCalorias(Math.max(0, +e.target.value || 0))}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Gramas</span>
              <input
                type="number"
                min={0}
                value={customGramas}
                onChange={(e) => setCustomGramas(Math.max(0, +e.target.value || 0))}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Proteína (g)
              </span>
              <input
                type="number"
                min={0}
                value={customProteina}
                onChange={(e) => setCustomProteina(+e.target.value || 0)}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Carbo (g)
              </span>
              <input
                type="number"
                min={0}
                value={customCarbo}
                onChange={(e) => setCustomCarbo(+e.target.value || 0)}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-4 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Gordura (g)
              </span>
              <input
                type="number"
                min={0}
                value={customGordura}
                onChange={(e) => setCustomGordura(+e.target.value || 0)}
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
