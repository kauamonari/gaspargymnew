import { useState } from "react";
import { ArrowLeft, ArrowRight, Dumbbell, PartyPopper } from "lucide-react";
import {
  DEFAULT_PROFILE,
  EXPERIENCE_LEVELS,
  STORAGE_KEYS,
  storage,
  type ExperienceLevel,
  type Goal,
  type Profile,
  type WeightEntry,
} from "@/storage/storage";

const GOAL_OPTIONS: { id: Goal; label: string; emoji: string }[] = [
  { id: "bulking", label: "Ganhar massa", emoji: "💪" },
  { id: "cutting", label: "Perder peso", emoji: "🔥" },
  { id: "manutencao", label: "Manter peso", emoji: "⚖️" },
  { id: "performance", label: "Melhorar performance", emoji: "⚡" },
];

const DIAS_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

interface Draft {
  nome: string;
  idade: string;
  altura: string;
  peso: string;
  sexo: "M" | "F";
  objetivo: Goal | null;
  nivel: ExperienceLevel | null;
  diasTreinoSemana: number | null;
}

const EMPTY_DRAFT: Draft = {
  nome: "",
  idade: "",
  altura: "",
  peso: "",
  sexo: "M",
  objetivo: null,
  nivel: null,
  diasTreinoSemana: null,
};

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);

  const totalSteps = 6; // welcome, nome, dados, objetivo, nivel, dias (+ final fora da contagem de progresso)

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function next() {
    setStep((s) => s + 1);
  }

  function back() {
    setStep((s) => Math.max(0, s - 1));
  }

  function finish() {
    const idade = parseInt(draft.idade, 10) || DEFAULT_PROFILE.idade;
    const altura = parseFloat(draft.altura) || DEFAULT_PROFILE.altura;
    const peso = parseFloat(draft.peso) || DEFAULT_PROFILE.peso;

    const profile: Profile = {
      ...DEFAULT_PROFILE,
      nome: draft.nome.trim() || undefined,
      idade,
      altura,
      peso,
      sexo: draft.sexo,
      objetivo: draft.objetivo ?? DEFAULT_PROFILE.objetivo,
      nivel: draft.nivel ?? undefined,
      diasTreinoSemana: draft.diasTreinoSemana ?? undefined,
      onboardingCompleto: true,
    };
    storage.set(STORAGE_KEYS.profile, profile);

    // Já nasce com o primeiro registro de peso, pra Evolução Corporal e o
    // dashboard terem dado desde o dia 1 (mesmo padrão do Perfil existente).
    const weights = storage.get<WeightEntry[]>(STORAGE_KEYS.weights, []);
    if (weights.length === 0) {
      storage.set(STORAGE_KEYS.weights, [
        { id: crypto.randomUUID(), weight: peso, date: new Date().toISOString() },
      ]);
    }

    next();
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        {step > 0 && step < totalSteps && (
          <div className="mb-8 flex items-center gap-1.5">
            {Array.from({ length: totalSteps - 1 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i < step ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}

        {step === 0 && <WelcomeStep onNext={next} />}

        {step === 1 && (
          <NomeStep
            value={draft.nome}
            onChange={(v) => update("nome", v)}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 2 && (
          <DadosStep
            idade={draft.idade}
            altura={draft.altura}
            peso={draft.peso}
            sexo={draft.sexo}
            onChange={update}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 3 && (
          <ObjetivoStep
            value={draft.objetivo}
            onChange={(v) => update("objetivo", v)}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 4 && (
          <NivelStep
            value={draft.nivel}
            onChange={(v) => update("nivel", v)}
            onNext={next}
            onBack={back}
          />
        )}

        {step === 5 && (
          <DiasStep
            value={draft.diasTreinoSemana}
            onChange={(v) => update("diasTreinoSemana", v)}
            onNext={finish}
            onBack={back}
          />
        )}

        {step === 6 && <FinalStep nome={draft.nome} onComplete={onComplete} />}
      </div>
    </div>
  );
}

function StepFooter({
  onNext,
  onBack,
  nextLabel = "Continuar",
  nextDisabled,
}: {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
}) {
  return (
    <div className="mt-8 flex items-center gap-2">
      {onBack && (
        <button
          onClick={onBack}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
      )}
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="shadow-glow flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-40"
      >
        {nextLabel} <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-full bg-primary/15 p-5 text-primary">
        <Dumbbell className="h-8 w-8" />
      </div>
      <h1 className="font-display text-2xl font-bold">Bem-vindo ao GasparGym 💪</h1>
      <p className="text-sm text-muted-foreground">
        Vamos preparar seu app em menos de 1 minuto — algumas perguntas rápidas pra calcular suas
        metas certinho.
      </p>
      <button
        onClick={onNext}
        className="shadow-glow mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        Vamos começar <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function NomeStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Como podemos te chamar?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Seu nome aparece na saudação do app.</p>
      <input
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ex: Kauã"
        className="mt-5 h-12 w-full rounded-xl border border-border bg-card px-4 text-base outline-none ring-primary/40 focus:ring-2"
      />
      <StepFooter onNext={onNext} onBack={onBack} nextDisabled={!value.trim()} />
    </div>
  );
}

function DadosStep({
  idade,
  altura,
  peso,
  sexo,
  onChange,
  onNext,
  onBack,
}: {
  idade: string;
  altura: string;
  peso: string;
  sexo: "M" | "F";
  onChange: <K extends keyof Draft>(key: K, value: Draft[K]) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const valid = +idade > 0 && +altura > 0 && +peso > 0;
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Seus dados</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Usamos isso pra calcular suas metas de calorias e macros.
      </p>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <NumberField label="Idade" value={idade} onChange={(v) => onChange("idade", v)} />
        <NumberField label="Altura (cm)" value={altura} onChange={(v) => onChange("altura", v)} />
        <NumberField label="Peso (kg)" value={peso} onChange={(v) => onChange("peso", v)} />
      </div>
      <div className="mt-4">
        <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Sexo</p>
        <div className="grid grid-cols-2 gap-2">
          {(["M", "F"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onChange("sexo", s)}
              className={`h-11 rounded-xl border text-sm font-semibold transition ${
                sexo === s
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-background/40 text-muted-foreground"
              }`}
            >
              {s === "M" ? "Masculino" : "Feminino"}
            </button>
          ))}
        </div>
      </div>
      <StepFooter onNext={onNext} onBack={onBack} nextDisabled={!valid} />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-12 w-full rounded-xl border border-border bg-card px-2 text-center font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
      />
    </label>
  );
}

function ObjetivoStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: Goal | null;
  onChange: (v: Goal) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Qual é o seu objetivo?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Isso ajusta suas metas diárias.</p>
      <div className="mt-5 grid grid-cols-2 gap-2.5">
        {GOAL_OPTIONS.map((g) => (
          <button
            key={g.id}
            onClick={() => onChange(g.id)}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition ${
              value === g.id
                ? "border-primary bg-primary/15"
                : "border-border bg-background/40 hover:border-border"
            }`}
          >
            <span className="text-2xl">{g.emoji}</span>
            <span className="text-sm font-semibold">{g.label}</span>
          </button>
        ))}
      </div>
      <StepFooter onNext={onNext} onBack={onBack} nextDisabled={!value} />
    </div>
  );
}

function NivelStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: ExperienceLevel | null;
  onChange: (v: ExperienceLevel) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Qual é o seu nível?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Ajuda a calibrar sugestões e acompanhar sua evolução.
      </p>
      <div className="mt-5 space-y-2">
        {EXPERIENCE_LEVELS.map((n) => (
          <button
            key={n.id}
            onClick={() => onChange(n.id)}
            className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
              value === n.id
                ? "border-primary bg-primary/15"
                : "border-border bg-background/40 hover:border-border"
            }`}
          >
            <div>
              <p className="text-sm font-semibold">{n.label}</p>
              <p className="text-[11px] text-muted-foreground">{n.desc}</p>
            </div>
          </button>
        ))}
      </div>
      <StepFooter onNext={onNext} onBack={onBack} nextDisabled={!value} />
    </div>
  );
}

function DiasStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: number | null;
  onChange: (v: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <h2 className="font-display text-xl font-bold">Quantos dias por semana?</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Quantos dias você pretende treinar por semana.
      </p>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {DIAS_OPTIONS.map((d) => (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`flex h-14 items-center justify-center rounded-xl border font-display text-lg font-bold transition ${
              value === d
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-background/40 text-muted-foreground"
            }`}
          >
            {d}
          </button>
        ))}
      </div>
      <StepFooter onNext={onNext} onBack={onBack} nextLabel="Concluir" nextDisabled={!value} />
    </div>
  );
}

function FinalStep({ nome, onComplete }: { nome: string; onComplete: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-full bg-success/15 p-5 text-success">
        <PartyPopper className="h-8 w-8" />
      </div>
      <h1 className="font-display text-2xl font-bold">Seu GasparGym está pronto.</h1>
      <p className="text-sm text-muted-foreground">
        {nome.trim() ? `Bora treinar, ${nome.trim()}!` : "Bora treinar!"} Seu dashboard já está
        configurado com suas metas.
      </p>
      <button
        onClick={onComplete}
        className="shadow-glow mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
      >
        Ir para o Dashboard <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
