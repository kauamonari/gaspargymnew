import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Trophy } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";
import { Progress } from "@/components/ui/progress";
import { listBodyPhotos } from "@/storage/bodyPhotos";
import {
  DEFAULT_PROFILE,
  getBodyMeasurements,
  getProfile,
  STORAGE_KEYS,
  storage,
  type BodyMeasurementEntry,
  type Meal,
  type Profile,
  type WeightEntry,
  type WorkoutSet,
} from "@/storage/storage";
import { computeAchievements } from "@/utils/achievements";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Minhas Conquistas" },
      { name: "description", content: "Acompanhe as conquistas desbloqueadas no seu progresso." },
    ],
  }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [measurements, setMeasurements] = useState<BodyMeasurementEntry[]>([]);
  const [photoCount, setPhotoCount] = useState(0);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);

  useEffect(() => {
    setSets(storage.get<WorkoutSet[]>(STORAGE_KEYS.workoutSets, []));
    setMeals(storage.get<Meal[]>(STORAGE_KEYS.meals, []));
    setWeights(storage.get<WeightEntry[]>(STORAGE_KEYS.weights, []));
    setMeasurements(getBodyMeasurements());
    setProfile(getProfile());
    listBodyPhotos()
      .then((photos) => setPhotoCount(photos.length))
      .catch(() => setPhotoCount(0));
  }, []);

  const achievements = useMemo(
    () => computeAchievements({ sets, meals, weights, measurements, photoCount, profile }),
    [sets, meals, weights, measurements, photoCount, profile],
  );

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const pct = Math.round((unlockedCount / achievements.length) * 100);

  return (
    <div className="space-y-6 animate-slide-up">
      <header className="flex items-center gap-3">
        <Link
          to="/profile"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Voltar ao Perfil"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Gamificação</p>
          <h1 className="font-display text-2xl font-bold">Minhas Conquistas</h1>
        </div>
      </header>

      <SurfaceCard className="space-y-3 border-primary/30">
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Trophy className="h-4 w-4 text-primary" /> Progresso
          </p>
          <p className="text-sm font-semibold tabular-nums text-primary">
            {pct}% · {unlockedCount}/{achievements.length}
          </p>
        </div>
        <Progress value={pct} />
      </SurfaceCard>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {achievements.map((a) => (
          <SurfaceCard
            key={a.id}
            className={`flex flex-col items-center gap-1.5 py-5 text-center transition-opacity ${
              a.unlocked ? "" : "opacity-40 grayscale"
            }`}
          >
            <span className="text-3xl leading-none">{a.emoji}</span>
            <p className="text-sm font-semibold leading-tight">{a.label}</p>
            <p className="text-[11px] leading-tight text-muted-foreground">{a.description}</p>
            {a.unlocked && (
              <span className="mt-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                Desbloqueada
              </span>
            )}
          </SurfaceCard>
        ))}
      </div>
    </div>
  );
}
