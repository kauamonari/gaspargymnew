import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { D as DEFAULT_PROFILE, s as storage, S as STORAGE_KEYS, g as getProfile, c as SurfaceCard } from "./storage-CZEK3EWH.mjs";
import { D as Dumbbell, C as CalendarDays, d as TrendingUp, e as TrendingDown, M as Minus, P as Plus, T as Trash2 } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, L as LineChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Line } from "../_libs/recharts.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
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
function ProgressPage() {
  const [entries, setEntries] = reactExports.useState([]);
  const [profile, setProfile] = reactExports.useState(DEFAULT_PROFILE);
  const [newWeight, setNewWeight] = reactExports.useState("");
  reactExports.useEffect(() => {
    setEntries(storage.get(STORAGE_KEYS.weights, []));
    setProfile(getProfile());
  }, []);
  function persist(next) {
    storage.set(STORAGE_KEYS.weights, next);
    setEntries(next);
  }
  function add() {
    const w = parseFloat(newWeight);
    if (!w || w <= 0) return;
    persist([...entries, {
      id: crypto.randomUUID(),
      weight: w,
      date: (/* @__PURE__ */ new Date()).toISOString()
    }]);
    const nextProfile = {
      ...profile,
      peso: w
    };
    storage.set(STORAGE_KEYS.profile, nextProfile);
    setProfile(nextProfile);
    setNewWeight("");
  }
  function remove(id) {
    persist(entries.filter((e) => e.id !== id));
  }
  const sorted = [...entries].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const chartData = sorted.map((e) => ({
    date: new Date(e.date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit"
    }),
    peso: e.weight
  }));
  const first = sorted[0]?.weight;
  const last = sorted[sorted.length - 1]?.weight;
  const diff = first !== void 0 && last !== void 0 ? +(last - first).toFixed(1) : 0;
  const trend = diff > 0 ? "up" : diff < 0 ? "down" : "flat";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-slide-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Acompanhamento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Evolução" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/workout", className: "flex items-center gap-1.5 rounded-full border border-workout/30 bg-workout/10 px-3 py-1.5 text-xs font-medium text-workout transition-colors hover:bg-workout/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-3.5 w-3.5" }),
          " Treino"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/days", className: "flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "h-3.5 w-3.5" }),
          " Dias"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Peso atual" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          entries.length,
          " registros"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-5xl font-bold tabular-nums", children: [
          last !== void 0 ? last.toFixed(1) : "—",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-base font-medium text-muted-foreground", children: "kg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold ${trend === "up" ? "bg-[color-mix(in_oklab,var(--protein)_25%,transparent)] text-[color:var(--protein)]" : trend === "down" ? "bg-[color-mix(in_oklab,var(--primary)_25%,transparent)] text-primary" : "bg-muted text-muted-foreground"}`, children: [
          trend === "up" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-4 w-4" }) : trend === "down" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums", children: [
            diff > 0 ? "+" : "",
            diff,
            " kg"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 font-display text-lg font-semibold", children: "Gráfico" }),
      chartData.length < 2 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-10 text-center text-sm text-muted-foreground", children: "Registre pelo menos 2 medições para ver o gráfico." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-52 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, { data: chartData, margin: {
        top: 8,
        right: 8,
        bottom: 0,
        left: -20
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("defs", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("linearGradient", { id: "lineG", x1: "0", y1: "0", x2: "1", y2: "0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "0%", stopColor: "var(--color-primary)", stopOpacity: 0.6 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("stop", { offset: "100%", stopColor: "var(--color-primary)" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { stroke: "var(--color-border)", strokeDasharray: "3 3", vertical: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "date", stroke: "var(--color-muted-foreground)", fontSize: 11, tickLine: false, axisLine: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { stroke: "var(--color-muted-foreground)", fontSize: 11, tickLine: false, axisLine: false, domain: ["dataMin - 1", "dataMax + 1"] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, { contentStyle: {
          background: "var(--color-card)",
          border: "1px solid var(--color-border)",
          borderRadius: 12,
          fontSize: 12
        }, labelStyle: {
          color: "var(--color-muted-foreground)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Line, { type: "monotone", dataKey: "peso", stroke: "url(#lineG)", strokeWidth: 2.5, dot: {
          r: 3.5,
          fill: "var(--color-primary)"
        }, activeDot: {
          r: 5
        } })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Registrar peso" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.1", value: newWeight, onChange: (e) => setNewWeight(e.target.value), placeholder: "ex: 72.5", className: "h-12 flex-1 rounded-xl border border-border bg-background/60 px-4 text-base outline-none ring-primary/40 focus:ring-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: add, className: "shadow-glow flex h-12 items-center gap-2 rounded-xl bg-primary px-5 font-semibold text-primary-foreground active:scale-[0.98]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
          " Salvar"
        ] })
      ] })
    ] }),
    sorted.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Histórico" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: [...sorted].reverse().map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex items-center justify-between p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-bold tabular-nums", children: [
            e.weight.toFixed(1),
            " kg"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(e.date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric"
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove(e.id), className: "rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }) })
      ] }) }, e.id)) })
    ] })
  ] });
}
export {
  ProgressPage as component
};
