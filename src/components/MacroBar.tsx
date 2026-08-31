interface Props {
  label: string;
  value: number;
  goal: number;
  color: "protein" | "carbs" | "fat";
  unit?: string;
}

const colorMap = {
  protein: "var(--color-protein)",
  carbs: "var(--color-carbs)",
  fat: "var(--color-fat)",
} as const;

export function MacroBar({ label, value, goal, color, unit = "g" }: Props) {
  const pct = Math.min((value / Math.max(goal, 1)) * 100, 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <span className="text-sm font-semibold tabular-nums">
          <span style={{ color: colorMap[color] }}>{value.toFixed(0)}</span>
          <span className="text-muted-foreground">
            {" "}
            / {goal}
            {unit}
          </span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: colorMap[color] }}
        />
      </div>
    </div>
  );
}
