import { useEffect, useMemo, useRef, useState } from "react";
import { Camera, ImageOff, Loader2, Lock, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { SurfaceCard } from "@/components/SurfaceCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  addBodyPhoto,
  deleteBodyPhoto,
  listBodyPhotos,
  PHOTO_CATEGORY_LABELS,
  type BodyPhotoRecord,
  type PhotoCategory,
} from "@/storage/bodyPhotos";

const CATEGORIES: PhotoCategory[] = ["frente", "costas", "lateral"];

const MAX_PHOTO_BYTES = 15 * 1024 * 1024;

/** Validação básica antes de aceitar um arquivo pro IndexedDB — mesmo sem
 * bucket de Storage na nuvem, um arquivo disfarçado de imagem ou gigante
 * não deve ser aceito silenciosamente. */
function validatePhotoFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Selecione um arquivo de imagem (JPEG, PNG ou WebP).";
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return "Essa foto é muito grande (máximo 15MB).";
  }
  return null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function PhotosSection() {
  const [photos, setPhotos] = useState<BodyPhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState<PhotoCategory>("frente");
  const [filter, setFilter] = useState<PhotoCategory | "todas">("todas");
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const urlsRef = useRef<Map<string, string>>(new Map());
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function refresh() {
    try {
      const list = await listBodyPhotos();
      for (const [id, url] of urlsRef.current) {
        if (!list.some((p) => p.id === id)) {
          URL.revokeObjectURL(url);
          urlsRef.current.delete(id);
        }
      }
      for (const p of list) {
        if (!urlsRef.current.has(p.id)) urlsRef.current.set(p.id, URL.createObjectURL(p.blob));
      }
      setPhotos(list);
      setLoadError(false);
    } catch (err) {
      console.error("[PhotosSection] falha ao ler fotos do IndexedDB:", err);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const urls = urlsRef.current;
    return () => {
      for (const url of urls.values()) URL.revokeObjectURL(url);
      urls.clear();
    };
  }, []);

  async function handleFile(file: File) {
    const validationError = validatePhotoFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setUploading(true);
    try {
      await addBodyPhoto(file, category, new Date().toISOString());
      await refresh();
      toast.success("✓ Foto adicionada");
    } catch (err) {
      console.error("[PhotosSection] falha ao salvar foto:", err);
      toast.error("Não foi possível salvar a foto neste aparelho.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteBodyPhoto(id);
      setCompareIds((ids) => ids.filter((i) => i !== id));
      await refresh();
      toast("Foto removida");
    } catch (err) {
      console.error("[PhotosSection] falha ao remover foto:", err);
      toast.error("Não foi possível remover a foto.");
    }
  }

  function toggleCompare(id: string) {
    setCompareIds((ids) => {
      if (ids.includes(id)) return ids.filter((i) => i !== id);
      if (ids.length >= 2) return [ids[1], id];
      return [...ids, id];
    });
  }

  const filtered = useMemo(
    () => (filter === "todas" ? photos : photos.filter((p) => p.category === filter)),
    [photos, filter],
  );

  const comparePhotos = compareIds
    .map((id) => photos.find((p) => p.id === id))
    .filter((p): p is BodyPhotoRecord => !!p);

  return (
    <div className="space-y-4">
      <SurfaceCard className="space-y-2">
        <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Lock className="h-3.5 w-3.5" /> Suas fotos ficam salvas só neste aparelho — nunca são
          enviadas para a nuvem.
        </p>
      </SurfaceCard>

      <SurfaceCard className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Adicionar foto</h2>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                category === c
                  ? "border-primary bg-primary/15 text-primary"
                  : "border-border bg-background/40 text-muted-foreground"
              }`}
            >
              {PHOTO_CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="shadow-glow flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground active:scale-[0.98] disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          {uploading ? "Salvando…" : `Adicionar foto (${PHOTO_CATEGORY_LABELS[category]})`}
        </button>
      </SurfaceCard>

      {comparePhotos.length === 2 && (
        <SurfaceCard className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Comparação</p>
            <button
              onClick={() => setCompareIds([])}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" /> Limpar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {comparePhotos.map((p) => (
              <div key={p.id} className="space-y-1.5">
                <img
                  src={urlsRef.current.get(p.id)}
                  alt={`Foto ${PHOTO_CATEGORY_LABELS[p.category]} de ${formatDate(p.date)}`}
                  className="aspect-[3/4] w-full rounded-xl object-cover"
                />
                <p className="text-center text-xs text-muted-foreground">{formatDate(p.date)}</p>
              </div>
            ))}
          </div>
        </SurfaceCard>
      )}

      <div className="flex gap-2 overflow-x-auto pb-1">
        {(["todas", ...CATEGORIES] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f
                ? "border-primary bg-primary/15 text-primary"
                : "border-border bg-card/60 text-muted-foreground"
            }`}
          >
            {f === "todas" ? "Todas" : PHOTO_CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
          ))}
        </div>
      ) : loadError ? (
        <ErrorState
          message="Não conseguimos carregar suas fotos neste aparelho."
          onRetry={() => {
            setLoading(true);
            refresh();
          }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ImageOff}
          title="Nenhuma foto ainda"
          description="Adicione a primeira foto acima para começar a acompanhar sua evolução visual."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {filtered.map((p) => {
            const selected = compareIds.includes(p.id);
            return (
              <div key={p.id} className="space-y-1.5">
                <button
                  onClick={() => toggleCompare(p.id)}
                  className={`relative block aspect-[3/4] w-full overflow-hidden rounded-xl border-2 transition-colors ${
                    selected ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={urlsRef.current.get(p.id)}
                    alt={`Foto ${PHOTO_CATEGORY_LABELS[p.category]} de ${formatDate(p.date)}`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-background/80 px-2 py-0.5 text-[10px] font-medium backdrop-blur">
                    {PHOTO_CATEGORY_LABELS[p.category]}
                  </span>
                  {selected && (
                    <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {compareIds.indexOf(p.id) + 1}
                    </span>
                  )}
                </button>
                <div className="flex items-center justify-between px-0.5">
                  <p className="text-[11px] text-muted-foreground">{formatDate(p.date)}</p>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {photos.length > 0 && compareIds.length < 2 && (
        <p className="text-center text-xs text-muted-foreground">
          Toque em duas fotos para comparar a evolução.
        </p>
      )}
    </div>
  );
}
