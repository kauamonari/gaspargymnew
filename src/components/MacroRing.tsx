interface Props {
  value: number;
  goal: number;
  size?: number;
  stroke?: number;
  label?: string;
  unit?: string;
}

export function MacroRing({
  value,
  goal,
  size = 200,
  stroke = 14,
  label = "kcal",
  unit = "",
}: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / Math.max(goal, 1), 1);
  const offset = circumference * (1 - pct);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-muted)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--color-primary)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.2,.7,.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold tabular-nums text-foreground">
          {Math.round(value)}
          {unit}
        </span>
        <span className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
          de {Math.round(goal)} {label}
        </span>
      </div>
    </div>
  );
}
