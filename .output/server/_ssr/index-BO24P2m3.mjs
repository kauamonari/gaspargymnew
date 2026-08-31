import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { D as DEFAULT_PROFILE, g as getProfile, s as storage, S as STORAGE_KEYS, a as getMealTypes, b as DEFAULT_WORKOUT_BLOCKS, c as SurfaceCard } from "./storage-CZEK3EWH.mjs";
import { l as localDateKey } from "./date-Cpa6Svv0.mjs";
import { i as isSameDay, s as sumMeals, c as calcMacroGoals } from "./nutrition-d1K4iIYk.mjs";
import { s as setVolume } from "./workout-PdgrLejk.mjs";
import { a as Check, S as Settings2, T as Trash2, P as Plus, b as Settings, F as Flame, c as Scale, d as TrendingUp, e as TrendingDown, D as Dumbbell, A as ArrowRight, f as CalendarClock, g as ChevronRight, h as ChartColumn, Z as Zap } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, L as LineChart, a as Line } from "../_libs/recharts.mjs";
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
function greeting() {
  const h = (/* @__PURE__ */ new Date()).getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}
function HomeHeader({ nome, streak }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-lg font-extrabold tracking-tight", children: [
        "GASPAR",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary", children: "GYM" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/profile",
          className: "flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground",
          "aria-label": "Configurações",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold leading-tight", children: [
          greeting(),
          nome ? `, ${nome}` : "",
          "! 👊"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-sm text-muted-foreground", children: "Foco hoje, resultado sempre." })
      ] }),
      streak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-center rounded-2xl border border-border bg-card px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-warning", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Flame, { className: "h-4 w-4 fill-warning" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold tabular-nums text-foreground", children: streak })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: [
          streak === 1 ? "dia" : "dias",
          " seguidos"
        ] })
      ] })
    ] })
  ] });
}
function pct(v, g) {
  if (g <= 0) return 0;
  return Math.min(Math.round(v / g * 100), 999);
}
function Bar({ value, goal, color }) {
  const p = Math.min(pct(value, goal), 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "animate-fill-bar h-full rounded-full",
      style: { width: `${p}%`, backgroundColor: color }
    }
  ) });
}
function DailySummaryCard({ calorias, proteina, carbo, gordura }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: "Resumo de hoje" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-3xl font-bold tabular-nums", children: [
          Math.round(calorias.value).toLocaleString("pt-BR"),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-sm font-medium text-muted-foreground", children: [
            "/ ",
            Math.round(calorias.goal).toLocaleString("pt-BR"),
            " kcal"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display text-sm font-bold tabular-nums text-primary", children: [
          pct(calorias.value, calorias.goal),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: calorias.value, goal: calorias.goal, color: "var(--color-primary)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-semibold", children: [
          "Proteína",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-normal text-muted-foreground", children: [
            Math.round(proteina.value),
            " / ",
            Math.round(proteina.goal),
            " g"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold tabular-nums text-info", children: [
          pct(proteina.value, proteina.goal),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { value: proteina.value, goal: proteina.goal, color: "var(--color-info)" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3 border-t border-border pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-carbs" }),
          " Carboidratos"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 font-display text-lg font-bold tabular-nums", children: [
          Math.round(carbo.value),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
            " ",
            "/ ",
            Math.round(carbo.goal),
            " g"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-fat" }),
          " Gorduras"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 font-display text-lg font-bold tabular-nums", children: [
          Math.round(gordura.value),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium text-muted-foreground", children: [
            " ",
            "/ ",
            Math.round(gordura.goal),
            " g"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function TodayWorkoutCard({ block, exerciseCount, estimatedSets }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex h-full flex-col justify-between space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-3.5 w-3.5" }),
        " Treino de hoje"
      ] }),
      block ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-display text-xl font-bold leading-tight", children: block.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [
          exerciseCount,
          " ",
          exerciseCount === 1 ? "exercício" : "exercícios",
          estimatedSets !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            " ",
            "· ",
            estimatedSets,
            " ",
            estimatedSets === 1 ? "série" : "séries"
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Nenhum treino programado para hoje." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/workout",
        className: "shadow-glow flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]",
        children: [
          block ? "Começar treino" : "Criar treino",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ]
      }
    )
  ] });
}
function WeightCard({ summary, pesoMeta }) {
  const { latest, diff, series } = summary;
  if (!latest) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex h-full flex-col justify-between space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-3.5 w-3.5" }),
        " Peso atual"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhum peso registrado ainda." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/progress", className: "text-sm font-semibold text-primary hover:underline", children: "Registrar peso →" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { className: "h-3.5 w-3.5" }),
      " Peso atual"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-3xl font-bold tabular-nums", children: [
        latest.weight,
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-base font-medium text-muted-foreground", children: "kg" })
      ] }),
      diff !== null && diff !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: `flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${diff > 0 ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`,
          children: [
            diff > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
            Math.abs(diff),
            " kg"
          ]
        }
      )
    ] }),
    pesoMeta && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Meta: ",
      pesoMeta,
      " kg"
    ] }),
    series.length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LineChart, { data: series, margin: { top: 2, right: 2, bottom: 2, left: 2 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Line,
      {
        type: "monotone",
        dataKey: "peso",
        stroke: "var(--color-primary)",
        strokeWidth: 2,
        dot: false
      }
    ) }) }) })
  ] });
}
function relativeDay(isoDate) {
  const key = localDateKey(isoDate);
  const today = localDateKey(/* @__PURE__ */ new Date());
  const yesterday = localDateKey(new Date(Date.now() - 864e5));
  if (key === today) return "Hoje";
  if (key === yesterday) return "1 dia atrás";
  const diffDays = Math.round((+new Date(today) - +new Date(key)) / 864e5);
  return `${diffDays} dias atrás`;
}
function LastWorkoutCard({ session }) {
  if (!session) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex h-full flex-col justify-between space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-3.5 w-3.5" }),
        " Último treino"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhum treino realizado ainda." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/days", className: "block h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex h-full flex-col justify-between space-y-3 transition-colors hover:border-primary/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-3.5 w-3.5" }),
        " Último treino"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-lg font-bold leading-tight", children: session.blockLabel }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: relativeDay(session.isoDate) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 border-t border-border pt-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold tabular-nums", children: session.setCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "séries" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold tabular-nums", children: session.volume.toLocaleString("pt-BR") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: "volume (kg)" })
      ] })
    ] })
  ] }) });
}
function WeeklyVolumeCard({ thisWeek, lastWeek, days }) {
  const hasData = thisWeek > 0 || lastWeek > 0;
  const pctChange = lastWeek > 0 ? Math.round((thisWeek - lastWeek) / lastWeek * 100) : null;
  const max = Math.max(...days.map((d) => d.volume), 1);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex h-full flex-col justify-between space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3.5 w-3.5" }),
        " Volume semanal"
      ] }),
      hasData ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-2xl font-bold tabular-nums", children: [
          thisWeek.toLocaleString("pt-BR"),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-muted-foreground", children: "kg" })
        ] }),
        pctChange !== null && pctChange !== 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `flex items-center gap-0.5 text-xs font-semibold ${pctChange > 0 ? "text-success" : "text-warning"}`,
            children: [
              pctChange > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
              Math.abs(pctChange),
              "% vs. semana passada"
            ]
          }
        )
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Complete um treino para acompanhar seu volume." })
    ] }),
    hasData && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 items-end justify-between gap-1.5", children: days.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-11 w-full items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-full rounded-sm transition-[height] duration-500 ${d.isToday ? "bg-primary" : "bg-muted"}`,
          style: { height: `${d.volume > 0 ? Math.max(d.volume / max * 100, 8) : 3}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `text-[9px] font-medium ${d.isToday ? "text-primary" : "text-muted-foreground"}`,
          children: d.label
        }
      )
    ] }, d.key)) })
  ] });
}
function HighlightsCard({ highlights }) {
  if (highlights.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: "Destaques" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Continue registrando refeições e treinos pra desbloquear seus destaques aqui." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.15em] text-primary", children: "Destaques" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid gap-3 ${highlights.length >= 3 ? "grid-cols-3" : "grid-cols-2"}`, children: highlights.map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl leading-none", children: h.icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-lg font-bold tabular-nums leading-tight", children: h.value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] leading-tight text-muted-foreground", children: h.label }),
      h.cta && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold text-primary", children: h.cta })
    ] }, i)) })
  ] });
}
function SmartFeedback({ message }) {
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex items-center gap-3 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-snug", children: message })
  ] });
}
function buildSessions(sets) {
  const map = /* @__PURE__ */ new Map();
  for (const s of sets) {
    const dateKey = localDateKey(s.date);
    const blockId = s.blockId ?? "avulso";
    const key = `${dateKey}__${blockId}`;
    if (!map.has(key)) {
      map.set(key, {
        dateKey,
        isoDate: s.date,
        blockId,
        blockLabel: s.blockLabel ?? "Avulso",
        exerciseNames: [],
        setCount: 0,
        volume: 0
      });
    }
    const session = map.get(key);
    if (!session.exerciseNames.includes(s.exerciseName)) session.exerciseNames.push(s.exerciseName);
    session.setCount += 1;
    session.volume += setVolume(s);
    if (s.date > session.isoDate) session.isoDate = s.date;
  }
  return Array.from(map.values()).sort(
    (a, b) => a.dateKey < b.dateKey ? 1 : a.dateKey > b.dateKey ? -1 : 0
  );
}
function lastSession(sets) {
  return buildSessions(sets)[0] ?? null;
}
function lastSessionForBlock(sets, blockId) {
  return buildSessions(sets).find((s) => s.blockId === blockId) ?? null;
}
function suggestedBlock(blocks, sets) {
  if (blocks.length === 0) return null;
  const last = lastSession(sets);
  if (!last) return blocks[0];
  const idx = blocks.findIndex((b) => b.id === last.blockId);
  if (idx === -1) return blocks[0];
  return blocks[(idx + 1) % blocks.length];
}
function daysAgoKey(n) {
  const d = /* @__PURE__ */ new Date();
  d.setDate(d.getDate() - n);
  return localDateKey(d);
}
function weekVolume(sets, weekOffset) {
  const startDaysAgo = weekOffset * 7;
  const endDaysAgo = startDaysAgo + 6;
  const keys = /* @__PURE__ */ new Set();
  for (let i = startDaysAgo; i <= endDaysAgo; i++) keys.add(daysAgoKey(i));
  return sets.filter((s) => keys.has(localDateKey(s.date))).reduce((acc, s) => acc + setVolume(s), 0);
}
const WEEKDAY_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"];
function dailyVolumeLast7(sets) {
  const days = [];
  const todayKey = daysAgoKey(0);
  for (let i = 6; i >= 0; i--) {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - i);
    const key = localDateKey(d);
    days.push({ key, label: WEEKDAY_SHORT[d.getDay()], volume: 0, isToday: key === todayKey });
  }
  const byKey = new Map(days.map((d) => [d.key, d]));
  for (const s of sets) {
    const day = byKey.get(localDateKey(s.date));
    if (day) day.volume += setVolume(s);
  }
  return days;
}
function trainingConsistency7(sets) {
  const days = dailyVolumeLast7(sets);
  const trained = days.filter((d) => d.volume > 0).length;
  return { trained, total: 7, pct: Math.round(trained / 7 * 100) };
}
function monthlyPRs(sets) {
  const now = /* @__PURE__ */ new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const byExercise = /* @__PURE__ */ new Map();
  for (const s of sets) {
    const d = new Date(s.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const entry = byExercise.get(s.exerciseName) ?? { thisMonthMax: 0, beforeMax: 0 };
    if (key === monthKey) entry.thisMonthMax = Math.max(entry.thisMonthMax, s.carga);
    else if (key < monthKey) entry.beforeMax = Math.max(entry.beforeMax, s.carga);
    byExercise.set(s.exerciseName, entry);
  }
  const prs = [];
  for (const [exerciseName, { thisMonthMax, beforeMax }] of byExercise) {
    if (beforeMax > 0 && thisMonthMax > beforeMax) {
      prs.push({ exerciseName, from: beforeMax, to: thisMonthMax });
    }
  }
  return prs.sort((a, b) => b.to - b.from - (a.to - a.from));
}
function activityStreak(meals, sets) {
  const activeDays = /* @__PURE__ */ new Set();
  for (const m of meals) activeDays.add(localDateKey(m.date));
  for (const s of sets) activeDays.add(localDateKey(s.date));
  const hasToday = activeDays.has(daysAgoKey(0));
  const hasYesterday = activeDays.has(daysAgoKey(1));
  if (!hasToday && !hasYesterday) return 0;
  let streak = 0;
  const startOffset = hasToday ? 0 : 1;
  for (let i = startOffset; ; i++) {
    if (activeDays.has(daysAgoKey(i))) streak++;
    else break;
  }
  return streak;
}
function summarizeWeights(entries) {
  const sorted = [...entries].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const latest = sorted[sorted.length - 1] ?? null;
  const previous = sorted[sorted.length - 2] ?? null;
  const diff = latest && previous ? +(latest.weight - previous.weight).toFixed(1) : null;
  const series = sorted.slice(-8).map((e) => ({
    date: new Date(e.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    peso: e.weight
  }));
  return { latest, previous, diff, series };
}
const EMOJI_OPTIONS = ["🍳", "🥗", "🍎", "🥤", "🍫", "🌮", "🍜", "🍇"];
function Dashboard() {
  const [profile, setProfile] = reactExports.useState(DEFAULT_PROFILE);
  const [meals, setMeals] = reactExports.useState([]);
  const [mealTypes, setMealTypes] = reactExports.useState([]);
  const [weights, setWeights] = reactExports.useState([]);
  const [sets, setSets] = reactExports.useState([]);
  const [blocks, setBlocks] = reactExports.useState([]);
  const [managing, setManaging] = reactExports.useState(false);
  const [newLabel, setNewLabel] = reactExports.useState("");
  const [newEmoji, setNewEmoji] = reactExports.useState(EMOJI_OPTIONS[0]);
  reactExports.useEffect(() => {
    setProfile(getProfile());
    setMeals(storage.get(STORAGE_KEYS.meals, []));
    setMealTypes(getMealTypes());
    setWeights(storage.get(STORAGE_KEYS.weights, []));
    setSets(storage.get(STORAGE_KEYS.workoutSets, []));
    setBlocks(storage.get(STORAGE_KEYS.workoutBlocks, DEFAULT_WORKOUT_BLOCKS));
  }, []);
  const today = (/* @__PURE__ */ new Date()).toISOString();
  const todayMeals = meals.filter((m) => isSameDay(m.date, today));
  const totals = sumMeals(todayMeals);
  const goals = calcMacroGoals(profile);
  const todayBlock = reactExports.useMemo(() => suggestedBlock(blocks, sets), [blocks, sets]);
  const todayEstimatedSets = reactExports.useMemo(() => todayBlock ? lastSessionForBlock(sets, todayBlock.id)?.setCount ?? null : null, [todayBlock, sets]);
  const weightSummary = reactExports.useMemo(() => summarizeWeights(weights), [weights]);
  const last = reactExports.useMemo(() => lastSession(sets), [sets]);
  const thisWeekVolume = reactExports.useMemo(() => weekVolume(sets, 0), [sets]);
  const lastWeekVolume = reactExports.useMemo(() => weekVolume(sets, 1), [sets]);
  const dailyVolumes = reactExports.useMemo(() => dailyVolumeLast7(sets), [sets]);
  const prs = reactExports.useMemo(() => monthlyPRs(sets), [sets]);
  const consistency = reactExports.useMemo(() => trainingConsistency7(sets), [sets]);
  const streak = reactExports.useMemo(() => activityStreak(meals, sets), [meals, sets]);
  const highlights = reactExports.useMemo(() => {
    const items = [];
    if (prs.length > 0) {
      items.push({
        icon: "🏆",
        value: `${prs.length}`,
        label: `${prs.length === 1 ? "PR" : "PRs"} este mês`
      });
    }
    if (consistency.trained > 0) {
      items.push({
        icon: "🔥",
        value: `${consistency.pct}%`,
        label: "Consistência (7 dias)"
      });
    }
    if (profile.pesoMeta && weightSummary.latest) {
      const falta = +(profile.pesoMeta - weightSummary.latest.weight).toFixed(1);
      if (falta !== 0) {
        items.push({
          icon: "🎯",
          value: `${Math.abs(falta)} kg`,
          label: falta > 0 ? "Faltam para a meta" : "Acima da meta"
        });
      }
    } else if (prs[0]) {
      const gain = +(prs[0].to - prs[0].from).toFixed(1);
      items.push({
        icon: "📈",
        value: `+${gain} kg`,
        label: `no ${prs[0].exerciseName}`
      });
    }
    return items.slice(0, 3);
  }, [prs, consistency, profile.pesoMeta, weightSummary.latest]);
  const feedback = reactExports.useMemo(() => {
    const remaining = Math.round(goals.calorias - totals.calorias);
    if (todayMeals.length > 0 && remaining >= 50) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "🔥 Você está ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "font-semibold text-primary", children: [
          remaining,
          " kcal"
        ] }),
        " ",
        "abaixo da sua meta hoje."
      ] });
    }
    if (prs.length > 0) {
      const p = prs[0];
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "💪 Novo recorde no",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "font-semibold text-primary", children: p.exerciseName }),
        ": ",
        p.from,
        "kg →",
        " ",
        p.to,
        "kg."
      ] });
    }
    if (todayMeals.length > 0 && remaining <= -50) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "⚠️ Você passou da meta de calorias hoje em",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "font-semibold text-primary", children: [
          Math.abs(remaining),
          " kcal"
        ] }),
        "."
      ] });
    }
    if (consistency.trained >= 4) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        "🎯 Continue assim! Você treinou",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "font-semibold text-primary", children: [
          consistency.trained,
          "x"
        ] }),
        " esta semana."
      ] });
    }
    return null;
  }, [goals.calorias, totals.calorias, todayMeals.length, prs, consistency.trained]);
  function removeMeal(id) {
    const next = meals.filter((m) => m.id !== id);
    setMeals(next);
    storage.set(STORAGE_KEYS.meals, next);
  }
  function persistMealTypes(next) {
    storage.set(STORAGE_KEYS.mealTypes, next);
    setMealTypes(next);
  }
  function removeSection(id) {
    if (mealTypes.length <= 1) return;
    persistMealTypes(mealTypes.filter((t) => t.id !== id));
  }
  function addSection() {
    const label = newLabel.trim();
    if (!label) return;
    const id = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || crypto.randomUUID();
    const hour = mealTypes.length > 0 ? (mealTypes[mealTypes.length - 1].hour + 2) % 24 : 8;
    persistMealTypes([...mealTypes, {
      id,
      label,
      emoji: newEmoji,
      hour
    }]);
    setNewLabel("");
    setNewEmoji(EMOJI_OPTIONS[0]);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 animate-slide-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(HomeHeader, { nome: profile.nome, streak }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DailySummaryCard, { calorias: {
      value: totals.calorias,
      goal: goals.calorias
    }, proteina: {
      value: totals.proteina,
      goal: goals.proteina
    }, carbo: {
      value: totals.carbo,
      goal: goals.carbo
    }, gordura: {
      value: totals.gordura,
      goal: goals.gordura
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(WeightCard, { summary: weightSummary, pesoMeta: profile.pesoMeta }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TodayWorkoutCard, { block: todayBlock, exerciseCount: todayBlock?.exerciseIds.length ?? 0, estimatedSets: todayEstimatedSets })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LastWorkoutCard, { session: last }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WeeklyVolumeCard, { thisWeek: thisWeekVolume, lastWeek: lastWeekVolume, days: dailyVolumes })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightsCard, { highlights }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SmartFeedback, { message: feedback }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "space-y-3 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Refeições de hoje" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setManaging((v) => !v), className: `flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${managing ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:text-foreground"}`, children: [
          managing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { className: "h-3.5 w-3.5" }),
          managing ? "Concluir" : "Editar seções"
        ] })
      ] }),
      managing && /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-3 border-primary/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: 'Remova seções que você não usa ou adicione uma nova (ex: "Pré-treino").' }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: mealTypes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-lg bg-background/40 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-medium", children: [
            t.emoji,
            " ",
            t.label
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeSection(t.id), disabled: mealTypes.length <= 1, className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-30", "aria-label": `Remover ${t.label}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }, t.id)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 border-t border-border/60 pt-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: newEmoji, onChange: (e) => setNewEmoji(e.target.value), className: "h-10 rounded-lg border border-border bg-background/60 px-2 text-lg outline-none", children: EMOJI_OPTIONS.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: e, children: e }, e)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: newLabel, onChange: (e) => setNewLabel(e.target.value), placeholder: "Nome da nova seção", className: "h-10 flex-1 rounded-lg border border-border bg-background/60 px-3 text-sm outline-none ring-primary/40 focus:ring-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: addSection, disabled: !newLabel.trim(), className: "flex h-10 items-center gap-1 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:opacity-40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " Add"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 md:grid-cols-2", children: mealTypes.map((t) => {
        const items = todayMeals.filter((m) => m.mealType === t.id);
        const sub = sumMeals(items);
        return /* @__PURE__ */ jsxRuntimeExports.jsx(MealSection, { type: t.id, label: t.label, emoji: t.emoji, items, kcal: sub.calorias, onRemove: removeMeal }, t.id);
      }) })
    ] })
  ] });
}
function MealSection({
  type,
  label,
  emoji,
  items,
  kcal,
  onRemove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xl leading-none", children: emoji }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold leading-tight", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: [
            items.length,
            " ",
            items.length === 1 ? "item" : "itens",
            " · ",
            kcal,
            " kcal"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/add", search: {
        type
      }, className: "shadow-glow flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95", "aria-label": `Adicionar em ${label}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }) })
    ] }),
    items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5 border-t border-border/60 pt-3", children: items.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-xl bg-background/40 px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: m.nome }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
          m.gramas,
          "g · P",
          m.proteina,
          " · C",
          m.carbo,
          " · G",
          m.gordura
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-sm font-bold tabular-nums text-primary", children: m.calorias }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] uppercase tracking-wider text-muted-foreground", children: "kcal" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onRemove(m.id), className: "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive", "aria-label": "Remover", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }, m.id)) })
  ] });
}
export {
  Dashboard as component
};
