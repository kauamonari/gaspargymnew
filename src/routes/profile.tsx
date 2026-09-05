import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Flame,
  KeyRound,
  Lock,
  LogOut,
  Ruler,
  Save,
  Scale,
  ShieldAlert,
  Trash2,
  Trophy,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NumberField } from "@/components/NumberField";
import { SurfaceCard } from "@/components/SurfaceCard";
import { supabase } from "@/lib/supabase";
import {
  clearLocalData,
  flushPendingPush,
  getSyncStatus,
  onSyncStatusChange,
  setCurrentUser,
  type SyncStatus,
} from "@/lib/cloudSync";
import { clearAllBodyPhotos } from "@/storage/bodyPhotos";
import {
  ACTIVITY_LEVELS,
  DEFAULT_APP_SETTINGS,
  DEFAULT_PROFILE,
  EXPERIENCE_LEVELS,
  getAppSettings,
  getProfile,
  saveAppSettings,
  STORAGE_KEYS,
  storage,
  type ActivityLevel,
  type AppSettings,
  type ExperienceLevel,
  type Goal,
  type Meal,
  type Profile,
  type WeightEntry,
  type WorkoutSet,
} from "@/storage/storage";
import {
  bestEvolutionExercise,
  bestStreakEver,
  buildSessions,
  lifetimePRCount,
  sessionsThisCalendarMonth,
} from "@/utils/dashboard";
import { calcBMR, calcMacroGoals } from "@/utils/nutrition";
import { displayWeightToKg, kgToDisplayWeight } from "@/utils/units";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Perfil" },
      {
        name: "description",
        content: "Configure seus dados, objetivo e preferências do app.",
      },
    ],
  }),
  component: ProfilePage,
});

const goals: { id: Goal; label: string; desc: string }[] = [
  { id: "cutting", label: "Cutting", desc: "Perder gordura" },
  { id: "manutencao", label: "Manutenção", desc: "Manter peso" },
  { id: "bulking", label: "Bulking", desc: "Ganhar massa" },
  { id: "performance", label: "Performance", desc: "Melhorar desempenho" },
];

function getInitials(nome?: string): string {
  if (!nome?.trim()) return "?";
  const parts = nome.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [appSettings, setAppSettingsState] = useState<AppSettings>(DEFAULT_APP_SETTINGS);
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(getSyncStatus());

  useEffect(() => {
    return onSyncStatusChange(setSyncStatus);
  }, []);

  useEffect(() => {
    setProfile(getProfile());
    setAppSettingsState(getAppSettings());
    setSets(storage.get<WorkoutSet[]>(STORAGE_KEYS.workoutSets, []));
    setMeals(storage.get<Meal[]>(STORAGE_KEYS.meals, []));
  }, []);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function updateSettings<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    const next = { ...appSettings, [key]: value };
    saveAppSettings(next);
    setAppSettingsState(next);
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
    toast.success("✓ Perfil salvo");
    setTimeout(() => setSaved(false), 2000);
  }

  const unit = appSettings.unidadePeso;
  const macros = calcMacroGoals(profile);
  const bmr = Math.round(calcBMR(profile));
  const alturaM = profile.altura / 100;
  const imc = alturaM > 0 ? profile.peso / (alturaM * alturaM) : 0;
  const imcInfo = classifyImc(imc);
  const pesoDiff = profile.pesoMeta ? +(profile.pesoMeta - profile.peso).toFixed(1) : null;

  const totalTreinos = useMemo(() => buildSessions(sets).length, [sets]);
  const treinosMes = useMemo(() => sessionsThisCalendarMonth(sets), [sets]);
  const prsTotais = useMemo(() => lifetimePRCount(sets), [sets]);
  const melhorSequencia = useMemo(() => bestStreakEver(meals, sets), [meals, sets]);
  const melhorEvolucao = useMemo(() => bestEvolutionExercise(sets), [sets]);

  async function handleSignOut() {
    if (!supabase) return;
    setSigningOut(true);
    // Manda qualquer alteração pendente pra nuvem ANTES de limpar os dados
    // locais e encerrar a sessão — senão a última alteração pode nunca
    // chegar a ser salva.
    await flushPendingPush();
    await supabase.auth.signOut();
    setCurrentUser(null);
    clearLocalData();
    window.location.href = "/";
  }

  async function handleDeleteAccount() {
    if (!supabase) return;
    setDeleting(true);
    try {
      await flushPendingPush();
      const { data } = await supabase.auth.getUser();
      const userId = data.user?.id;
      if (userId) {
        const { error } = await supabase.from("user_state").delete().eq("user_id", userId);
        if (error) throw error;
      }
      await clearAllBodyPhotos();
      await supabase.auth.signOut();
      setCurrentUser(null);
      clearLocalData();
      window.location.href = "/";
    } catch (err) {
      console.error("[profile] falha ao excluir conta:", err);
      toast.error("Não foi possível excluir seus dados agora. Tente novamente.");
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <header className="flex items-center gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/20 font-display text-lg font-bold text-primary">
          {getInitials(profile.nome)}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Seu perfil</p>
          <h1 className="font-display text-2xl font-bold">{profile.nome || "Sem nome"}</h1>
        </div>
      </header>

      <Tabs defaultValue="perfil">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="mt-4 space-y-6">
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
              <Field
                label={`Peso (${unit})`}
                value={kgToDisplayWeight(profile.peso, unit)}
                onChange={(v) => update("peso", displayWeightToKg(v, unit))}
              />
              <Field
                label="Altura (cm)"
                value={profile.altura}
                onChange={(v) => update("altura", v)}
              />
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
                Peso meta ({unit}) — opcional
              </p>
              <input
                type="number"
                value={profile.pesoMeta ? kgToDisplayWeight(profile.pesoMeta, unit) : ""}
                placeholder="ex: 80"
                onChange={(e) =>
                  update(
                    "pesoMeta",
                    e.target.value === ""
                      ? undefined
                      : displayWeightToKg(+e.target.value, unit) || undefined,
                  )
                }
                className="h-12 w-full rounded-xl border border-border bg-background/60 px-3 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
              {pesoDiff !== null && pesoDiff !== 0 && (
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Faltam{" "}
                  <span className="font-semibold text-foreground">
                    {kgToDisplayWeight(Math.abs(pesoDiff), unit)}
                    {unit}
                  </span>{" "}
                  pra {pesoDiff > 0 ? "ganhar" : "perder"} até a meta.
                </p>
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="space-y-3">
            <h2 className="font-display text-lg font-semibold">Nível de experiência</h2>
            <div className="grid grid-cols-1 gap-2">
              {EXPERIENCE_LEVELS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => update("nivel", n.id as ExperienceLevel)}
                  className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                    profile.nivel === n.id
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
          </SurfaceCard>

          <SurfaceCard className="space-y-3">
            <h2 className="font-display text-lg font-semibold">Dias de treino por semana</h2>
            <div className="grid grid-cols-7 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => update("diasTreinoSemana", d)}
                  className={`flex h-11 items-center justify-center rounded-xl border font-display text-sm font-bold transition ${
                    profile.diasTreinoSemana === d
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-background/40 text-muted-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
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
            <div className="grid grid-cols-2 gap-2">
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
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                kcal por dia
              </p>
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

          <SurfaceCard className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
                <Trophy className="h-4 w-4 text-primary" /> Estatísticas
              </h2>
              <Link
                to="/achievements"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Ver conquistas →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatTile label="Total de treinos" value={totalTreinos} />
              <StatTile label="Treinos este mês" value={treinosMes} />
              <StatTile label="PRs" value={prsTotais} />
              <StatTile
                label="Melhor sequência"
                value={melhorSequencia}
                suffix={melhorSequencia === 1 ? " dia" : " dias"}
              />
            </div>
            {melhorEvolucao && (
              <div className="border-t border-border/60 pt-3">
                <p className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Exercício com maior evolução
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{melhorEvolucao.exerciseName}</span>
                  <span className="flex items-center gap-1 text-sm font-semibold tabular-nums text-primary">
                    <Flame className="h-3.5 w-3.5" /> {melhorEvolucao.from}kg → {melhorEvolucao.to}
                    kg
                  </span>
                </div>
              </div>
            )}
          </SurfaceCard>

          <button
            onClick={save}
            className="shadow-glow sticky bottom-24 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            <Save className="h-5 w-5" />
            {saved ? "Salvo!" : "Salvar perfil"}
          </button>
        </TabsContent>

        <TabsContent value="config" className="mt-4 space-y-6">
          <SurfaceCard className="space-y-4">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
              <UserIcon className="h-4 w-4 text-primary" /> Conta
            </h2>

            {supabase ? (
              <>
                <SyncStatusBadge status={syncStatus} />
                <PasswordChangeForm />
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-60"
                >
                  <LogOut className="h-4 w-4" />{" "}
                  {signingOut ? "Salvando antes de sair…" : "Sair da conta"}
                </button>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Login por nuvem não está configurado neste app — seus dados ficam só neste aparelho.
              </p>
            )}
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
              <Ruler className="h-4 w-4 text-primary" /> Treino
            </h2>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Tempo padrão de descanso (segundos)
              </span>
              <NumberField
                min={0}
                step={5}
                value={appSettings.restSecondsPadrao}
                onChange={(v) => updateSettings("restSecondsPadrao", v)}
                className="mt-1 h-12 w-full rounded-xl border border-border bg-background/60 px-3 font-display text-lg font-bold tabular-nums outline-none ring-primary/40 focus:ring-2"
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                Usado em exercícios sem tempo de descanso configurado individualmente.
              </p>
            </label>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                Unidade de peso
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["kg", "lb"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => updateSettings("unidadePeso", u)}
                    className={`h-11 rounded-xl border text-sm font-semibold uppercase transition ${
                      appSettings.unidadePeso === u
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-background/40 text-muted-foreground"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                Afeta a exibição do peso corporal (Perfil e Evolução Corporal).
              </p>
            </div>
          </SurfaceCard>

          <SurfaceCard className="space-y-4">
            <h2 className="flex items-center gap-1.5 font-display text-lg font-semibold">
              <Lock className="h-4 w-4 text-primary" /> Privacidade
            </h2>

            <button
              onClick={() => downloadMyData()}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:border-primary/40"
            >
              <Download className="h-4 w-4" /> Baixar meus dados
            </button>

            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">
                <Scale className="mr-1 inline h-3 w-3" /> Fotos de evolução corporal ficam salvas só
                neste aparelho, nunca são enviadas pra nuvem.
              </p>
              <ClearPhotosButton />
            </div>

            {supabase && (
              <div className="space-y-1.5 border-t border-border/60 pt-4">
                <p className="flex items-center gap-1.5 text-xs font-semibold text-destructive">
                  <ShieldAlert className="h-3.5 w-3.5" /> Zona de risco
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      disabled={deleting}
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-destructive/40 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" /> {deleting ? "Excluindo…" : "Excluir conta"}
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir sua conta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Isso apaga permanentemente seus dados salvos na nuvem (treinos, dieta,
                        evolução) e neste aparelho, incluindo suas fotos de evolução. Seu login
                        continua existindo — se quiser removê-lo por completo, entre em contato com
                        o suporte. Essa ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir tudo
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </SurfaceCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function downloadMyData() {
  const data: Record<string, unknown> = {};
  for (const key of Object.values(STORAGE_KEYS)) {
    data[key] = storage.get(key, null);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gaspargym-dados-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Download iniciado");
}

function ClearPhotosButton() {
  const [clearing, setClearing] = useState(false);

  async function handleClear() {
    setClearing(true);
    try {
      await clearAllBodyPhotos();
      toast.success("Fotos apagadas deste aparelho");
    } catch (err) {
      console.error("[profile] falha ao apagar fotos:", err);
      toast.error("Não foi possível apagar as fotos.");
    } finally {
      setClearing(false);
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          disabled={clearing}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium text-foreground transition-colors hover:border-destructive/40 hover:text-destructive disabled:opacity-60"
        >
          <Trash2 className="h-4 w-4" /> {clearing ? "Apagando…" : "Apagar todas as fotos"}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apagar todas as fotos?</AlertDialogTitle>
          <AlertDialogDescription>
            Isso remove permanentemente todas as fotos de evolução corporal salvas neste aparelho.
            Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClear}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Apagar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function PasswordChangeForm() {
  const [newPassword, setNewPassword] = useState("");
  const [changing, setChanging] = useState(false);

  async function handleChange() {
    if (!supabase || newPassword.length < 6) return;
    setChanging(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast.error("Não foi possível alterar a senha.");
    } else {
      toast.success("Senha atualizada");
      setNewPassword("");
    }
    setChanging(false);
  }

  return (
    <div className="space-y-2 border-t border-border/60 pt-3">
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        <KeyRound className="h-3.5 w-3.5" /> Alterar senha
      </p>
      <div className="flex gap-2">
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Nova senha (mín. 6 caracteres)"
          minLength={6}
          className="h-11 flex-1 rounded-xl border border-border bg-background/60 px-3 text-sm outline-none ring-primary/40 focus:ring-2"
        />
        <button
          onClick={handleChange}
          disabled={changing || newPassword.length < 6}
          className="rounded-xl border border-primary/40 bg-primary/10 px-4 text-sm font-semibold text-primary disabled:opacity-40"
        >
          {changing ? "..." : "Atualizar"}
        </button>
      </div>
    </div>
  );
}

function SyncStatusBadge({ status }: { status: SyncStatus }) {
  if (status === "idle") return null;

  const config = {
    pending: { label: "Salvando na nuvem…", color: "var(--color-muted-foreground)" },
    synced: { label: "Salvo na nuvem", color: "var(--color-success)" },
    error: {
      label: "Não foi possível salvar na nuvem — confira se rodou o schema.sql no Supabase",
      color: "var(--color-destructive)",
    },
  }[status];

  return (
    <p className="flex items-center gap-1.5 text-xs" style={{ color: config.color }}>
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </p>
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
      <NumberField
        value={value}
        onChange={onChange}
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

function StatTile({ label, value, suffix }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3 text-center">
      <p className="font-display text-xl font-bold tabular-nums">
        {value}
        {suffix ?? ""}
      </p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
