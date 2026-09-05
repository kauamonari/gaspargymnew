import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { SurfaceCard } from "@/components/SurfaceCard";

// Chave de UI puramente local (não é dado do app) — de propósito não passa
// pelo helper `storage` de storage.ts, pra não sincronizar com a nuvem nem
// disparar pushIfLoggedIn() à toa.
const DISMISSED_KEY = "gaspargym:installPromptDismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isDismissed(): boolean {
  try {
    return window.localStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function dismiss() {
  try {
    window.localStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Sem localStorage disponível — só não persiste a dispensa, sem crash.
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    // @ts-expect-error API não padrão, só existe no Safari/iOS
    window.navigator.standalone === true
  );
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(isDismissed());
    if (isStandalone()) return;

    function onBeforeInstallPrompt(e: Event) {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    // iOS nunca dispara beforeinstallprompt — só dá pra sugerir manualmente
    // o passo "Compartilhar > Adicionar à Tela de Início".
    if (isIos()) setShowIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
  }, []);

  if (dismissed || (!deferredPrompt && !showIosHint)) return null;

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setDeferredPrompt(null);
  }

  function handleDismiss() {
    dismiss();
    setDismissed(true);
  }

  return (
    <SurfaceCard className="mb-4 flex items-center gap-3 border-primary/30 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
        {showIosHint && !deferredPrompt ? (
          <Share className="h-4 w-4" />
        ) : (
          <Download className="h-4 w-4" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Instale o GasparGym</p>
        <p className="text-xs text-muted-foreground">
          {deferredPrompt
            ? "Acesso rápido direto da tela inicial, sem precisar do navegador."
            : "Toque em Compartilhar e depois em “Adicionar à Tela de Início”."}
        </p>
      </div>
      {deferredPrompt && (
        <button
          onClick={handleInstall}
          className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          Instalar
        </button>
      )}
      <button
        onClick={handleDismiss}
        className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Dispensar"
      >
        <X className="h-4 w-4" />
      </button>
    </SurfaceCard>
  );
}
