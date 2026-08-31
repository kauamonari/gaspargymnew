import type { ReactNode } from "react";
import { Zap } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";

export function SmartFeedback({ message }: { message: ReactNode | null }) {
  if (!message) return null;

  return (
    <SurfaceCard className="flex items-center gap-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        <Zap className="h-4 w-4" />
      </div>
      <p className="text-sm leading-snug">{message}</p>
    </SurfaceCard>
  );
}
