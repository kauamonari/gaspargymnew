import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as storage, S as STORAGE_KEYS, b as DEFAULT_WORKOUT_BLOCKS, f as getCustomExercises, e as cn, c as SurfaceCard, h as saveCustomExercises } from "./storage-CZEK3EWH.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { i as isSameDay, g as groupByExercise, m as maxCarga, d as distinctBlockLabels, a as distinctExerciseNamesInBlock, e as exerciseEvolution } from "./workout-PdgrLejk.mjs";
import { D as Dumbbell, P as Plus, a as Check, o as Pencil, T as Trash2, X, k as Search, d as TrendingUp } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, L as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Line } from "../_libs/recharts.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "./date-Cpa6Svv0.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const MUSCLE_GROUPS = [
  { id: "peito", label: "Peito", emoji: "🏋️" },
  { id: "costas", label: "Costas", emoji: "🔙" },
  { id: "pernas", label: "Pernas", emoji: "🦵" },
  { id: "ombro", label: "Ombro", emoji: "🤸" },
  { id: "biceps", label: "Bíceps", emoji: "💪" },
  { id: "triceps", label: "Tríceps", emoji: "💪" },
  { id: "abdomen", label: "Abdômen", emoji: "🔥" },
  { id: "cardio", label: "Cardio", emoji: "🏃" }
];
const EXERCISES = [
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
  { id: 50, nome: "HIIT", grupo: "cardio" }
];
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function WorkoutPage() {
  const [sets, setSets] = reactExports.useState([]);
  const [blocks, setBlocks] = reactExports.useState([]);
  const [customExercises, setCustomExercises] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setSets(storage.get(STORAGE_KEYS.workoutSets, []));
    setBlocks(storage.get(STORAGE_KEYS.workoutBlocks, DEFAULT_WORKOUT_BLOCKS));
    setCustomExercises(getCustomExercises());
  }, []);
  function persistSets(next) {
    storage.set(STORAGE_KEYS.workoutSets, next);
    setSets(next);
  }
  function persistBlocks(next) {
    storage.set(STORAGE_KEYS.workoutBlocks, next);
    setBlocks(next);
  }
  function persistCustomExercises(next) {
    saveCustomExercises(next);
    setCustomExercises(next);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-slide-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-full bg-workout/15 p-3 text-workout", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-5 w-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Musculação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-2xl font-bold", children: "Treino" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "registrar", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "registrar", children: "Registrar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "evolucao", children: "Evolução" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "registrar", className: "mt-4 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RegisterTab, { sets, blocks, customExercises, onPersistSets: persistSets, onPersistBlocks: persistBlocks, onPersistCustomExercises: persistCustomExercises }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "evolucao", className: "mt-4 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EvolutionTab, { sets }) })
    ] })
  ] });
}
function RegisterTab({
  sets,
  blocks,
  customExercises,
  onPersistSets,
  onPersistBlocks,
  onPersistCustomExercises
}) {
  const [activeBlockId, setActiveBlockId] = reactExports.useState(blocks[0]?.id ?? null);
  const [managing, setManaging] = reactExports.useState(false);
  const [extraMode, setExtraMode] = reactExports.useState(false);
  const [addingCustom, setAddingCustom] = reactExports.useState(false);
  const [newExerciseName, setNewExerciseName] = reactExports.useState("");
  const [selected, setSelected] = reactExports.useState(null);
  const [carga, setCarga] = reactExports.useState(20);
  const [reps, setReps] = reactExports.useState(10);
  const [group, setGroup] = reactExports.useState("peito");
  const [q, setQ] = reactExports.useState("");
  const allExercises = reactExports.useMemo(() => [...EXERCISES, ...customExercises.map((c) => ({
    ...c,
    grupo: c.grupo
  }))], [customExercises]);
  reactExports.useEffect(() => {
    if (!activeBlockId && blocks.length > 0) setActiveBlockId(blocks[0].id);
  }, [blocks, activeBlockId]);
  const activeBlock = blocks.find((b) => b.id === activeBlockId) ?? null;
  const today = (/* @__PURE__ */ new Date()).toISOString();
  const todaySets = sets.filter((s) => isSameDay(s.date, today));
  const todayForBlock = activeBlock ? todaySets.filter((s) => s.blockId === activeBlock.id) : [];
  const blockExercises = reactExports.useMemo(() => {
    if (!activeBlock) return [];
    return activeBlock.exerciseIds.map((id) => allExercises.find((e) => e.id === id)).filter((e) => !!e);
  }, [activeBlock, allExercises]);
  const pickerResults = reactExports.useMemo(() => {
    const n = q.trim().toLowerCase();
    const pool = allExercises.filter((e) => e.grupo === group);
    if (!n) return pool;
    return pool.filter((e) => e.nome.toLowerCase().includes(n));
  }, [q, group, allExercises]);
  function addCustomExercise() {
    const nome = newExerciseName.trim();
    if (!nome) return;
    const id = Date.now();
    const exercise = {
      id,
      nome,
      grupo: group
    };
    onPersistCustomExercises([...customExercises, exercise]);
    if (activeBlock) {
      onPersistBlocks(blocks.map((b) => b.id === activeBlock.id ? {
        ...b,
        exerciseIds: [...b.exerciseIds, id]
      } : b));
    }
    setNewExerciseName("");
    setAddingCustom(false);
  }
  function addBlock() {
    const letters = "ABCDEFGH";
    const nextLetter = letters[blocks.length] ?? String(blocks.length + 1);
    const id = crypto.randomUUID();
    const block = {
      id,
      label: `Treino ${nextLetter}`,
      exerciseIds: []
    };
    onPersistBlocks([...blocks, block]);
    setActiveBlockId(id);
    setManaging(true);
  }
  function renameBlock(id, label) {
    onPersistBlocks(blocks.map((b) => b.id === id ? {
      ...b,
      label
    } : b));
  }
  function deleteBlock(id) {
    const next = blocks.filter((b) => b.id !== id);
    onPersistBlocks(next);
    if (activeBlockId === id) setActiveBlockId(next[0]?.id ?? null);
  }
  function toggleExerciseInBlock(exerciseId) {
    if (!activeBlock) return;
    const has = activeBlock.exerciseIds.includes(exerciseId);
    const nextIds = has ? activeBlock.exerciseIds.filter((id) => id !== exerciseId) : [...activeBlock.exerciseIds, exerciseId];
    onPersistBlocks(blocks.map((b) => b.id === activeBlock.id ? {
      ...b,
      exerciseIds: nextIds
    } : b));
  }
  function logSet(exercise) {
    if (carga <= 0 || reps <= 0 || !activeBlock) return;
    const set = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      exerciseName: exercise.nome,
      carga,
      reps,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      blockId: activeBlock.id,
      blockLabel: activeBlock.label
    };
    onPersistSets([...sets, set]);
    setSelected(null);
    setExtraMode(false);
    setQ("");
  }
  function removeSet(id) {
    onPersistSets(sets.filter((s) => s.id !== id));
  }
  const grouped = groupByExercise(todayForBlock);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-1", children: [
      blocks.map((b) => {
        const active = b.id === activeBlockId;
        return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
          setActiveBlockId(b.id);
          setSelected(null);
          setExtraMode(false);
        }, className: `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${active ? "border-workout bg-workout text-workout-foreground shadow-glow-workout" : "border-border bg-card text-muted-foreground hover:text-foreground"}`, children: b.label }, b.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addBlock, className: "flex shrink-0 items-center gap-1 rounded-full border border-dashed border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
        " Novo treino"
      ] })
    ] }),
    !activeBlock ? /* @__PURE__ */ jsxRuntimeExports.jsx(SurfaceCard, { className: "py-10 text-center text-sm text-muted-foreground", children: "Crie um treino (ex: Treino A) pra começar a organizar seus exercícios." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        managing ? /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: activeBlock.label, onChange: (e) => renameBlock(activeBlock.id, e.target.value), className: "h-10 flex-1 rounded-lg border border-border bg-card px-3 font-display text-lg font-bold outline-none ring-workout/40 focus:ring-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: activeBlock.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setManaging((v) => !v), className: `flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${managing ? "border-workout bg-workout/10 text-workout" : "border-border text-muted-foreground hover:text-foreground"}`, "aria-label": "Gerenciar exercícios do treino", children: managing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-4 w-4" }) }),
          managing && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteBlock(activeBlock.id), className: "flex h-9 w-9 items-center justify-center rounded-full border border-destructive/30 text-destructive transition-colors hover:bg-destructive/10", "aria-label": "Excluir treino", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
        ] })
      ] }),
      managing ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Selecione os exercícios que fazem parte do ",
          activeBlock.label,
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: MUSCLE_GROUPS.map((g) => {
          const gActive = g.id === group;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setGroup(g.id), className: `flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${gActive ? "border-workout bg-workout text-workout-foreground shadow-glow-workout" : "border-border bg-card text-muted-foreground hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: g.emoji }),
            g.label
          ] }, g.id);
        }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: allExercises.filter((e) => e.grupo === group).map((e) => {
          const included = activeBlock.exerciseIds.includes(e.id);
          const isCustom = customExercises.some((c) => c.id === e.id);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => toggleExerciseInBlock(e.id), className: "w-full text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: `flex items-center justify-between p-4 transition-colors ${included ? "border-workout/60 bg-workout/5" : "hover:border-border"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-semibold", children: [
              e.nome,
              isCustom && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: "seu" })
            ] }),
            included ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-workout" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-muted-foreground" })
          ] }) }) }, e.id);
        }) }),
        addingCustom ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-3 border-dashed border-workout/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            "Novo exercício em",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: MUSCLE_GROUPS.find((g) => g.id === group)?.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: newExerciseName, onChange: (e) => setNewExerciseName(e.target.value), placeholder: "Nome do exercício", autoFocus: true, className: "h-11 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none ring-workout/40 focus:ring-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addCustomExercise, disabled: !newExerciseName.trim(), className: "flex h-11 items-center gap-1 rounded-xl bg-workout px-4 text-sm font-semibold text-workout-foreground disabled:opacity-40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
              " Criar"
            ] })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAddingCustom(true), className: "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Criar exercício personalizado"
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        selected ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-4 border-workout/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: selected.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelected(null), className: "text-xs text-muted-foreground hover:text-foreground", children: "cancelar" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Carga (kg)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 0, step: "0.5", value: carga, onChange: (e) => setCarga(Math.max(0, +e.target.value || 0)), className: "mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 font-display text-xl font-bold tabular-nums outline-none ring-workout/40 focus:ring-2" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Repetições" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: 1, value: reps, onChange: (e) => setReps(Math.max(0, +e.target.value || 0)), className: "mt-1 h-12 w-full rounded-xl border border-border bg-background px-4 font-display text-xl font-bold tabular-nums outline-none ring-workout/40 focus:ring-2" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => logSet(selected), className: "shadow-glow-workout flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-workout font-semibold text-workout-foreground transition-transform active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5" }),
            " Adicionar série"
          ] })
        ] }) : extraMode ? /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold", children: "Exercício avulso" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              setExtraMode(false);
              setQ("");
            }, className: "text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: MUSCLE_GROUPS.map((g) => {
            const gActive = g.id === group;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setGroup(g.id), className: `shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${gActive ? "border-workout bg-workout text-workout-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`, children: [
              g.emoji,
              " ",
              g.label
            ] }, g.id);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Pesquisar exercício…", className: "h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm outline-none ring-workout/40 focus:ring-2" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "max-h-64 space-y-1.5 overflow-y-auto", children: pickerResults.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelected(e), className: "flex w-full items-center justify-between rounded-lg bg-background px-3 py-2.5 text-left text-sm font-medium transition-colors hover:bg-accent", children: e.nome }) }, e.id)) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          blockExercises.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SurfaceCard, { className: "space-y-3 py-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Esse treino ainda não tem exercícios. Toque no lápis pra adicionar." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: blockExercises.map((e) => {
            const doneToday = grouped.get(e.nome);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSelected(e), className: "w-full text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex items-center justify-between p-4 transition-colors hover:border-workout/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: e.nome }),
              doneToday ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-workout", children: [
                doneToday.length,
                " ",
                doneToday.length === 1 ? "série" : "séries",
                " ",
                "· ",
                maxCarga(doneToday),
                "kg"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 text-muted-foreground" })
            ] }) }) }, e.id);
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setExtraMode(true), className: "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Exercício avulso (fora do treino)"
          ] })
        ] }),
        grouped.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-semibold", children: [
            "Séries de hoje — ",
            activeBlock.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: Array.from(grouped.entries()).map(([name, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold leading-tight", children: name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: [
                items.length,
                " ",
                items.length === 1 ? "série" : "séries",
                " · máx",
                " ",
                maxCarga(items),
                "kg"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 border-t border-border/60 pt-3", children: items.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-xl bg-background px-3 py-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium tabular-nums", children: [
                s.carga,
                "kg ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "×" }),
                " ",
                s.reps,
                " reps"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeSet(s.id), className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive", "aria-label": "Remover", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] }, s.id)) })
          ] }, name)) })
        ] })
      ] })
    ] })
  ] });
}
function EvolutionTab({
  sets
}) {
  const blockLabels = distinctBlockLabels(sets);
  const [blockLabel, setBlockLabel] = reactExports.useState(blockLabels[0] ?? null);
  reactExports.useEffect(() => {
    if ((!blockLabel || !blockLabels.includes(blockLabel)) && blockLabels.length > 0) {
      setBlockLabel(blockLabels[0]);
    }
  }, [blockLabels, blockLabel]);
  if (blockLabels.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SurfaceCard, { className: "py-10 text-center text-sm text-muted-foreground", children: 'Registre pelo menos um exercício na aba "Registrar" pra ver sua evolução aqui.' });
  }
  const names = blockLabel ? distinctExerciseNamesInBlock(sets, blockLabel) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: blockLabels.map((label) => {
      const active = label === blockLabel;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBlockLabel(label), className: `shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${active ? "border-workout bg-workout text-workout-foreground shadow-glow-workout" : "border-border bg-card text-muted-foreground hover:text-foreground"}`, children: label }, label);
    }) }),
    blockLabel && /* @__PURE__ */ jsxRuntimeExports.jsx(BlockEvolution, { sets, blockLabel, names }, blockLabel)
  ] });
}
function BlockEvolution({
  sets,
  blockLabel,
  names
}) {
  const [exerciseName, setExerciseName] = reactExports.useState(names[0] ?? null);
  reactExports.useEffect(() => {
    if ((!exerciseName || !names.includes(exerciseName)) && names.length > 0) {
      setExerciseName(names[0]);
    }
  }, [names, exerciseName]);
  const data = exerciseName ? exerciseEvolution(sets, exerciseName) : [];
  const first = data[0]?.carga;
  const last = data[data.length - 1]?.carga;
  const diff = first !== void 0 && last !== void 0 ? +(last - first).toFixed(1) : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: names.map((name) => {
      const active = name === exerciseName;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExerciseName(name), className: `shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${active ? "border-primary bg-primary/15 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`, children: name }, name);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-baseline justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
        "Carga máxima atual · ",
        blockLabel
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-5xl font-bold tabular-nums", children: [
          last !== void 0 ? last : "—",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-base font-medium text-muted-foreground", children: "kg" })
        ] }),
        data.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 rounded-full bg-workout/15 px-3 py-1.5 text-sm font-semibold text-workout", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
            diff > 0 ? "+" : "",
            diff,
            " kg"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-lg font-semibold", children: "Gráfico de carga" }),
      data.length < 2 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: "Registre esse exercício em pelo menos 2 dias diferentes pra ver o gráfico." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-52 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: data.map((d) => ({
        date: (/* @__PURE__ */ new Date(d.date + "T00:00:00")).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit"
        }),
        carga: d.carga
      })), margin: {
        top: 8,
        right: 8,
        bottom: 0,
        left: -20
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "loadG", x1: "0", y1: "0", x2: "1", y2: "0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--color-workout)", stopOpacity: 0.6 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--color-workout)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", stroke: "var(--color-muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11, tickLine: false, axisLine: false, domain: ["dataMin - 2", "dataMax + 2"] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          fontSize: 12
        }, labelStyle: {
          color: "var(--color-muted-foreground)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "carga", stroke: "url(#loadG)", strokeWidth: 2.5, dot: {
          r: 3.5,
          fill: "var(--color-workout)"
        }, activeDot: {
          r: 5
        } })
      ] }) }) })
    ] })
  ] });
}
export {
  WorkoutPage as component
};
