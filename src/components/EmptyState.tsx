import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import { cn } from "@/lib/utils";

type KnownRoute = "/" | "/add" | "/days" | "/profile" | "/progress" | "/workout";

interface EmptyStateAction {
  label: string;
  to?: KnownRoute;
  onClick?: () => void;
}

/** Estado vazio padrão do app — ícone + título + descrição curta + CTA
 * opcional. Usar em toda lista/página que hoje só mostra "Nenhum registro". */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  className?: string;
}) {
  return (
    <SurfaceCard className={cn("flex flex-col items-center gap-3 py-10 text-center", className)}>
      <div className="rounded-full bg-primary/10 p-3 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <p className="font-display text-base font-semibold">{title}</p>
        {description && (
          <p className="mx-auto max-w-xs text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {action &&
        (action.to ? (
          <Link
            to={action.to}
            className="shadow-glow mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {action.label}
          </Link>
        ) : (
          <button
            onClick={action.onClick}
            className="shadow-glow mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          >
            {action.label}
          </button>
        ))}
    </SurfaceCard>
  );
}
