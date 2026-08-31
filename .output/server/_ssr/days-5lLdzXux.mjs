import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { D as DEFAULT_PROFILE, s as storage, S as STORAGE_KEYS, g as getProfile, a as getMealTypes, c as SurfaceCard, e as cn } from "./storage-CZEK3EWH.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { c as calcMacroGoals, s as sumMeals } from "./nutrition-d1K4iIYk.mjs";
import { g as groupByExercise, t as totalVolume, m as maxCarga } from "./workout-PdgrLejk.mjs";
import { l as localDateKey } from "./date-Cpa6Svv0.mjs";
import { D as Dumbbell, d as TrendingUp, l as ChevronLeft, g as ChevronRight, m as ChevronDown } from "../_libs/lucide-react.mjs";
import { g as getDefaultClassNames, D as DayPicker } from "../_libs/react-day-picker.mjs";
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
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/date-fns__tz.mjs";
import "../_libs/date-fns.mjs";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = reactExports.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { className: cn(buttonVariants({ variant, size, className })), ref, ...props });
  }
);
Button.displayName = "Button";
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DayPicker,
    {
      showOutsideDays,
      className: cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      ),
      captionLayout,
      formatters: {
        formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
        ...formatters
      },
      classNames: {
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "label" ? "text-sm" : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn("bg-accent rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-accent rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.outside
        ),
        disabled: cn("text-muted-foreground opacity-50", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames
      },
      components: {
        Root: ({ className: className2, rootRef, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { "data-slot": "calendar", ref: rootRef, className: cn(className2), ...props2 });
        },
        Chevron: ({ className: className2, orientation, ...props2 }) => {
          if (orientation === "left") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: cn("size-4", className2), ...props2 });
          }
          if (orientation === "right") {
            return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn("size-4", className2), ...props2 });
          }
          return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn("size-4", className2), ...props2 });
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props2 }) => {
          return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { ...props2, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex size-(--cell-size) items-center justify-center text-center", children }) });
        },
        ...components
      },
      ...props
    }
  );
}
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames();
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Button,
    {
      ref,
      variant: "ghost",
      size: "icon",
      "data-day": day.date.toLocaleDateString(),
      "data-selected-single": modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle,
      "data-range-start": modifiers.range_start,
      "data-range-end": modifiers.range_end,
      "data-range-middle": modifiers.range_middle,
      className: cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-(--cell-size) flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      ),
      ...props
    }
  );
}
function dayKey(d) {
  return localDateKey(d);
}
function DaysPage() {
  const [meals, setMeals] = reactExports.useState([]);
  const [workoutSets, setWorkoutSets] = reactExports.useState([]);
  const [profile, setProfile] = reactExports.useState(DEFAULT_PROFILE);
  const [mealTypes, setMealTypes] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState(() => {
    const d = /* @__PURE__ */ new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  reactExports.useEffect(() => {
    setMeals(storage.get(STORAGE_KEYS.meals, []));
    setWorkoutSets(storage.get(STORAGE_KEYS.workoutSets, []));
    setProfile(getProfile());
    setMealTypes(getMealTypes());
  }, []);
  const goals = calcMacroGoals(profile);
  const byDay = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const m of meals) {
      const k = localDateKey(m.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(m);
    }
    return map;
  }, [meals]);
  const workoutByDay = reactExports.useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of workoutSets) {
      const k = localDateKey(s.date);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(s);
    }
    return map;
  }, [workoutSets]);
  const recordedDates = reactExports.useMemo(() => {
    const keys = /* @__PURE__ */ new Set([...byDay.keys(), ...workoutByDay.keys()]);
    return Array.from(keys).map((k) => /* @__PURE__ */ new Date(k + "T00:00:00"));
  }, [byDay, workoutByDay]);
  const recordedTotals = reactExports.useMemo(() => Array.from(byDay.values()).map((items) => sumMeals(items).calorias), [byDay]);
  const avg = recordedTotals.length ? Math.round(recordedTotals.reduce((a, b) => a + b, 0) / recordedTotals.length) : 0;
  const selectedKey = dayKey(selected);
  const selectedMeals = byDay.get(selectedKey) ?? [];
  const selectedTotals = sumMeals(selectedMeals);
  const diff = selectedTotals.calorias - goals.calorias;
  const selectedSets = workoutByDay.get(selectedKey) ?? [];
  const selectedExercises = groupByExercise(selectedSets);
  const selectedVolume = totalVolume(selectedSets);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-slide-up", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-muted-foreground", children: "Histórico" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-bold", children: "Calendário" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/workout", className: "flex items-center gap-1.5 rounded-full border border-workout/30 bg-workout/10 px-3 py-1.5 text-xs font-medium text-workout transition-colors hover:bg-workout/15", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Dumbbell, { className: "h-3.5 w-3.5" }),
          " Treino"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/progress", className: "flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5" }),
          " Peso"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "flex items-end justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: [
          "Média (",
          recordedTotals.length,
          " dias)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-4xl font-bold tabular-nums", children: [
          avg,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-sm font-medium text-muted-foreground", children: "kcal" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Meta" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display text-xl font-semibold tabular-nums text-muted-foreground", children: goals.calorias })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "px-2 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { mode: "single", selected, onSelect: (d) => d && setSelected(d), disabled: (date) => date > /* @__PURE__ */ new Date(), modifiers: {
        recorded: recordedDates
      }, modifiersClassNames: {
        recorded: "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-foreground/70"
      }, showOutsideDays: true, className: cn("p-2 pointer-events-auto mx-auto bg-transparent") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex items-center justify-center gap-4 text-[10px] uppercase tracking-wider text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-foreground/70" }),
        " com registro"
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] uppercase tracking-wider text-muted-foreground", children: selected.toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "long"
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-display text-3xl font-bold tabular-nums", children: [
            selectedTotals.calorias,
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 text-sm font-medium text-muted-foreground", children: [
              "/ ",
              goals.calorias,
              " kcal"
            ] })
          ] })
        ] }),
        selectedMeals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("rounded-full border px-3 py-1 text-xs font-semibold tabular-nums", diff > 0 ? "border-destructive/40 text-destructive" : "border-border text-muted-foreground"), children: [
          diff > 0 ? "+" : "",
          diff,
          " kcal"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroPill, { label: "Proteína", value: selectedTotals.proteina, goal: goals.proteina, color: "protein" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroPill, { label: "Carbo", value: selectedTotals.carbo, goal: goals.carbo, color: "carbs" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(MacroPill, { label: "Gordura", value: selectedTotals.gordura, goal: goals.gordura, color: "fat" })
      ] }),
      selectedMeals.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-1.5 border-t border-border/60 pt-3", children: [
        mealTypes.map((t) => {
          const items = selectedMeals.filter((m) => m.mealType === t.id);
          if (items.length === 0) return null;
          const s = sumMeals(items);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-lg bg-background/40 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              t.emoji,
              " ",
              t.label,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[11px]", children: [
                "· ",
                items.length,
                " ",
                items.length === 1 ? "item" : "itens"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold tabular-nums", children: [
              s.calorias,
              " kcal"
            ] })
          ] }, t.id);
        }),
        (() => {
          const knownIds = new Set(mealTypes.map((t) => t.id));
          const orphan = selectedMeals.filter((m) => !knownIds.has(m.mealType));
          if (orphan.length === 0) return null;
          const s = sumMeals(orphan);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-lg bg-background/40 px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "🗂️ Outros",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[11px]", children: [
                "· ",
                orphan.length,
                " ",
                orphan.length === 1 ? "item" : "itens"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold tabular-nums", children: [
              s.calorias,
              " kcal"
            ] })
          ] });
        })()
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "border-t border-border/60 pt-4 text-center text-sm text-muted-foreground", children: "Nenhum registro neste dia." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SurfaceCard, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold", children: "Treino do dia" }),
        selectedSets.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
          selectedVolume.toLocaleString("pt-BR"),
          "kg de volume"
        ] })
      ] }),
      selectedExercises.size > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1.5", children: Array.from(selectedExercises.entries()).map(([name, items]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded-lg bg-background/40 px-3 py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          name,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[11px]", children: [
            "· ",
            items.length,
            " ",
            items.length === 1 ? "série" : "séries"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold tabular-nums", children: [
          maxCarga(items),
          "kg máx"
        ] })
      ] }, name)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-sm text-muted-foreground", children: "Nenhum treino registrado neste dia." })
    ] })
  ] });
}
function MacroPill({
  label,
  value,
  goal,
  color
}) {
  const colorVar = color === "protein" ? "var(--color-protein)" : color === "carbs" ? "var(--color-carbs)" : "var(--color-fat)";
  const pct = Math.min(value / Math.max(goal, 1) * 100, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5 rounded-lg bg-background/40 px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold tabular-nums", style: {
      color: colorVar
    }, children: [
      value.toFixed(0),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
        " / ",
        goal,
        "g"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-[width] duration-500", style: {
      width: `${pct}%`,
      backgroundColor: colorVar
    } }) })
  ] });
}
export {
  DaysPage as component
};
