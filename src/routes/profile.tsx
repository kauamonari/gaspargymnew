import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Save, User as UserIcon } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import {
  ACTIVITY_LEVELS,
  DEFAULT_PROFILE,
  STORAGE_KEYS,
  getProfile,
  storage,
  type ActivityLevel,
  type Goal,
  type Profile,
  type WeightEntry,
} from "@/storage/storage";
import { calcBMR, calcMacroGoals } from "@/utils/nutrition";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Perfil" },
      {
        name: "description",
        content: "Configure seus dados e objetivo para calcular calorias diárias.",
      },
    ],
  }),
  component: ProfilePage,
});

const goals: { id: Goal; label: string; desc: string }[] = [
  { id: "cutting", label: "Cutting", desc: "Perder gordura" },
  { id: "manutencao", label: "Manutenção", desc: "Manter peso" },
  { id: "bulking", label: "Bulking", desc: "Ganhar massa" },
];

function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function save() {
    storage.set(STORAGE_KEYS.profile, profile);

    // Mantém o histórico de Evolução em dia: se o peso foi alterado aqui,
    // registra também como uma medição, pra não ficar desconexo.
    const weights = storage.get<WeightEntry[]>(STORAGE_KEYS.weights, []);
    const last = [...weights].sort((a, b) => +new Date(b.date) - +new Date(a.date))[0];
    if (!last || last.weight !== profile.peso) {
      storage.set(STORAGE_KEYS.weights, [
        ...weights,
        { id: crypto.randomUUID(), weight: profile.peso, date: new Date().toISOString() },
      ]);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const macros = calcMacroGoals(profile);
  const bmr = Math.round(calcBMR(profile));
  const alturaM = profile.altura / 100;
  const imc = alturaM > 0 ? profile.peso / (alturaM * alturaM) : 0;
  const imcInfo = classifyImc(imc);
  const pesoDiff = profile.pesoMeta ? +(profile.pesoMeta - profile.peso).toFixed(1) : null;

  return (
    <div className="space-y-6 animate-slide-up">
      <header className="flex items-center gap-3">
        <div className="rounded-full bg-primary/20 p-3 text-primary">
          <UserIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seu perfil</p>
          <h1 className="font-display text-2xl font-bold">Configurações</h1>
        </div>
      </header>

      <SurfaceCard className="space-y-4">
        <h2 className="font-display text-lg font-semibold">Dados</h2>

        <label className="block">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Nome (pra saudação na Home)
          </span>
          <input
            value={profile.nome ?? ""}
            onChange={(e) => update("nome", e.target.value)}
            placeholder="ex: Kauã"
            className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-3 text-sm font-medium outline-none ring-primary/40 focus:ring-2"
          />
        </label>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Peso (kg)" value={profile.peso} onChange={(v) => update("peso", v)} />
          <Field label="Altura (cm)" value={profile.altura} onChange={(v) => update("altura", v)} />
          <Field label="Idade" value={profile.idade} onChange={(v) => update("idade", v)} />
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Sexo</p>
          <div className="grid grid-cols-2 gap-2">
            {(["M", "F"] as const).map((s) => (
              <button
                key={s}
                onClick={() => update("sexo", s)}
                className={`h-11 rounded-xl border text-sm font-semibold transition ${
                  profile.sexo === s
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border bg-background/40 text-muted-foreground"
                }`}
              >
                {s === "M" ? "Masculino" : "Feminino"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
            Peso meta (kg) — opcional
          </p>
          <input
            type="number"
            value={profile.pesoMeta ?? ""}
            placeholder="ex: 80"
            onChange={(e) =>
              update("pesoMeta", e.target.value === "" ? undefined : +e.target.value || undefined)
            }
            className="h-12 w-full rounded-xl border border-border bg-background/60 px-3 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
          />
          {pesoDiff !== null && pesoDiff !== 0 && (
            <p className="mt-1.5 text-xs text-muted-foreground">
              Faltam <span className="font-semibold text-foreground">{Math.abs(pesoDiff)}kg</span>{" "}
              pra {pesoDiff > 0 ? "ganhar" : "perder"} até a meta.
            </p>
          )}
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Nível de atividade</h2>
        <div className="grid grid-cols-1 gap-2">
          {ACTIVITY_LEVELS.map((a) => (
            <button
              key={a.id}
              onClick={() => update("nivelAtividade", a.id as ActivityLevel)}
              className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                profile.nivelAtividade === a.id
                  ? "border-primary bg-primary/15"
                  : "border-border bg-background/40 hover:border-border"
              }`}
            >
              <div>
                <p className="text-sm font-semibold">{a.label}</p>
                <p className="text-[11px] text-muted-foreground">{a.desc}</p>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">×{a.factor}</span>
            </button>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Objetivo</h2>
        <div className="grid grid-cols-3 gap-2">
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => update("objetivo", g.id)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition ${
                profile.objetivo === g.id
                  ? "border-primary bg-primary/15"
                  : "border-border bg-background/40 hover:border-border"
              }`}
            >
              <span className="text-sm font-semibold">{g.label}</span>
              <span className="text-[10px] text-muted-foreground">{g.desc}</span>
            </button>
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard className="space-y-4 border-primary/30">
        <h2 className="font-display text-lg font-semibold">Metas calculadas</h2>
        <div className="text-center">
          <p className="font-display text-5xl font-bold tabular-nums text-primary">
            {macros.calorias}
          </p>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">kcal por dia</p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <Mini label="Proteína" value={macros.proteina} color="protein" />
          <Mini label="Carbo" value={macros.carbo} color="carbs" />
          <Mini label="Gordura" value={macros.gordura} color="fat" />
        </div>
        <div className="grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-center">
          <div>
            <p className="font-display text-lg font-bold tabular-nums">{bmr}</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Taxa metabólica basal
            </p>
          </div>
          <div>
            <p
              className="font-display text-lg font-bold tabular-nums"
              style={{ color: imcInfo.color }}
            >
              {imc.toFixed(1)}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              IMC · {imcInfo.label}
            </p>
          </div>
        </div>
      </SurfaceCard>

      <button
        onClick={save}
        className="shadow-glow sticky bottom-24 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        <Save className="h-5 w-5" />
        {saved ? "Salvo!" : "Salvar perfil"}
      </button>
    </div>
  );
}

function classifyImc(imc: number): { label: string; color: string } {
  if (imc <= 0) return { label: "—", color: "var(--color-muted-foreground)" };
  if (imc < 18.5) return { label: "Abaixo do peso", color: "var(--color-carbs)" };
  if (imc < 25) return { label: "Peso normal", color: "var(--color-primary)" };
  if (imc < 30) return { label: "Sobrepeso", color: "var(--color-carbs)" };
  return { label: "Obesidade", color: "var(--color-destructive)" };
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(+e.target.value || 0)}
        className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-3 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
      />
    </label>
  );
}

function Mini({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "protein" | "carbs" | "fat";
}) {
  const colorMap = {
    protein: "var(--color-protein)",
    carbs: "var(--color-carbs)",
    fat: "var(--color-fat)",
  };
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <p className="font-display text-xl font-bold tabular-nums" style={{ color: colorMap[color] }}>
        {value}g
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
