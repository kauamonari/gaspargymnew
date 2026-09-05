import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Dumbbell, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyDashboardCard } from "@/components/body/BodyDashboardCard";
import { WeightSection } from "@/components/body/WeightSection";
import { MeasurementsSection } from "@/components/body/MeasurementsSection";
import { PhotosSection } from "@/components/body/PhotosSection";
import {
  DEFAULT_APP_SETTINGS,
  DEFAULT_PROFILE,
  getAppSettings,
  getBodyMeasurements,
  getProfile,
  getTrackedMeasurements,
  saveBodyMeasurements,
  saveTrackedMeasurements,
  STORAGE_KEYS,
  storage,
  type AppSettings,
  type BodyMeasurementEntry,
  type MeasurementKey,
  type Profile,
  type WeightEntry,
} from "@/storage/storage";
import { summarizeWeightFull } from "@/utils/bodyEvolution";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Gaspar Gym — Evolução Corporal" },
      {
        name: "description",
        content: "Acompanhe peso, medidas e fotos da sua evolução corporal em um só lugar.",
      },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [measurements, setMeasurements] = useState<BodyMeasurementEntry[]>([]);
  const [trackedKeys, setTrackedKeys] = useState<MeasurementKey[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>(DEFAULT_APP_SETTINGS);

  useEffect(() => {
    setWeights(storage.get<WeightEntry[]>(STORAGE_KEYS.weights, []));
    setProfile(getProfile());
    setMeasurements(getBodyMeasurements());
    setTrackedKeys(getTrackedMeasurements());
    setAppSettings(getAppSettings());
  }, []);

  function persistWeights(next: WeightEntry[]) {
    storage.set(STORAGE_KEYS.weights, next);
    setWeights(next);
  }

  function addWeight(weight: number) {
    persistWeights([
      ...weights,
      { id: crypto.randomUUID(), weight, date: new Date().toISOString() },
    ]);
    // Mantém o peso do Perfil (usado no cálculo de calorias) em dia com o
    // último registro de evolução, pra não ficar desconexo.
    const nextProfile = { ...profile, peso: weight };
    storage.set(STORAGE_KEYS.profile, nextProfile);
    setProfile(nextProfile);
    toast.success("✓ Peso registrado");
  }

  function removeWeight(id: string) {
    persistWeights(weights.filter((e) => e.id !== id));
    toast("Registro de peso removido");
  }

  function changeMeta(meta: number | undefined) {
    const nextProfile = { ...profile, pesoMeta: meta };
    storage.set(STORAGE_KEYS.profile, nextProfile);
    setProfile(nextProfile);
    if (meta !== undefined) toast.success("🎯 Meta de peso atualizada");
  }

  function persistMeasurements(next: BodyMeasurementEntry[]) {
    saveBodyMeasurements(next);
    setMeasurements(next);
  }

  function addMeasurementEntry(entry: BodyMeasurementEntry) {
    persistMeasurements([...measurements, entry]);
    toast.success("✓ Medidas registradas");
  }

  function removeMeasurementEntry(id: string) {
    persistMeasurements(measurements.filter((e) => e.id !== id));
    toast("Registro removido");
  }

  function changeTracked(keys: MeasurementKey[]) {
    saveTrackedMeasurements(keys);
    setTrackedKeys(keys);
  }

  const weightSummary = summarizeWeightFull(weights);

  return (
    <div className="space-y-6 animate-slide-up">
      <header className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Acompanhamento</p>
          <h1 className="font-display text-3xl font-bold">Evolução Corporal</h1>
        </div>
        <div className="flex gap-2">
          <Link
            to="/workout"
            className="flex items-center gap-1.5 rounded-full border border-workout/30 bg-workout/10 px-3 py-1.5 text-xs font-medium text-workout transition-colors hover:bg-workout/15"
          >
            <Dumbbell className="h-3.5 w-3.5" /> Treino
          </Link>
          <Link
            to="/days"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <CalendarDays className="h-3.5 w-3.5" /> Dias
          </Link>
        </div>
      </header>

      <BodyDashboardCard
        weightLatest={weightSummary.latest}
        weightInitial={weightSummary.initial}
        weightDiff={weightSummary.totalDiff}
        pesoMeta={profile.pesoMeta}
        measurements={measurements}
        trackedKeys={trackedKeys}
        unit={appSettings.unidadePeso}
      />

      <Tabs defaultValue="peso">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="peso">Peso</TabsTrigger>
          <TabsTrigger value="medidas">Medidas</TabsTrigger>
          <TabsTrigger value="fotos">Fotos</TabsTrigger>
        </TabsList>

        <TabsContent value="peso" className="mt-4">
          <WeightSection
            entries={weights}
            pesoMeta={profile.pesoMeta}
            unit={appSettings.unidadePeso}
            onAdd={addWeight}
            onRemove={removeWeight}
            onChangeMeta={changeMeta}
          />
        </TabsContent>

        <TabsContent value="medidas" className="mt-4">
          <MeasurementsSection
            entries={measurements}
            trackedKeys={trackedKeys}
            onAddEntry={addMeasurementEntry}
            onRemoveEntry={removeMeasurementEntry}
            onChangeTracked={changeTracked}
          />
        </TabsContent>

        <TabsContent value="fotos" className="mt-4">
          <PhotosSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
