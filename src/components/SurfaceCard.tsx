import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function SurfaceCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("gradient-card shadow-card rounded-2xl border border-border/60 p-5", className)}
      {...props}
    />
  );
}
