import { AlertTriangle, RotateCw } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import { cn } from "@/lib/utils";

/** Estado de erro padrão do app — substitui mensagens técnicas por algo
 * acionável. Usar sempre que uma operação (rede, storage, etc.) falhar de
 * um jeito que o usuário possa tentar de novo. */
export function ErrorState({
  message = "Não conseguimos carregar seus dados. Verifique sua conexão e tente novamente.",
  onRetry,
  className,
}: {
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <SurfaceCard
      className={cn(
        "flex flex-col items-center gap-3 border-destructive/25 py-10 text-center",
        className,
      )}
    >
      <div className="rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <p className="mx-auto max-w-xs text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-1 flex h-11 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 active:scale-[0.98]"
        >
          <RotateCw className="h-4 w-4" /> Tentar novamente
        </button>
      )}
    </SurfaceCard>
  );
}
