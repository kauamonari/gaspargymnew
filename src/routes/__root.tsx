import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { useEffect, useState } from "react";
import { Compass, Home, Loader2 } from "lucide-react";
import appCss from "../styles.css?url";
import { BottomNav } from "@/components/BottomNav";
import { AuthScreen } from "@/components/AuthScreen";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Toaster } from "@/components/ui/sonner";
import { useSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { pullAndHydrate, setCurrentUser } from "@/lib/cloudSync";
import {
  DEFAULT_PROFILE,
  getProfile,
  STORAGE_KEYS,
  storage,
  type Profile,
} from "@/storage/storage";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <EmptyState
          icon={Compass}
          title="Página não encontrada"
          description="A página que você procura não existe ou foi movida."
          action={{ label: "Voltar para o início", to: "/" }}
        />
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm space-y-3">
        <ErrorState
          message="Não conseguimos carregar essa página. Verifique sua conexão e tente novamente."
          onRetry={() => {
            router.invalidate();
            reset();
          }}
        />
        <a
          href="/"
          className="mx-auto flex h-11 w-fit items-center justify-center gap-2 px-5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="h-4 w-4" /> Voltar para o início
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Gaspar Gym — Hoje" },
      { name: "description", content: "Suas calorias e macros de hoje em um único lugar." },
      { name: "author", content: "Gaspar Gym" },
      { property: "og:title", content: "Gaspar Gym — Hoje" },
      { property: "og:description", content: "Suas calorias e macros de hoje em um único lugar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Gaspar Gym — Hoje" },
      { name: "twitter:description", content: "Suas calorias e macros de hoje em um único lugar." },
      { name: "theme-color", content: "#080808" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "Gaspar Gym" },
    ],
    links: [
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "icon", href: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { rel: "icon", href: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

/** Perfil "intocado" = ninguém preencheu nada ainda (nem pelo Perfil, nem
 * por uma versão antiga do app sem onboarding) — só nesse caso mostramos o
 * fluxo de primeira viagem. Qualquer perfil com dado real já digitado é
 * tratado como usuário existente e marcado como onboarded silenciosamente,
 * pra nunca interromper quem já usa o app. */
function isUntouchedProfile(p: Profile): boolean {
  return (
    !p.nome &&
    p.peso === DEFAULT_PROFILE.peso &&
    p.altura === DEFAULT_PROFILE.altura &&
    p.idade === DEFAULT_PROFILE.idade
  );
}

function RootComponent() {
  const { session, loading } = useSession();
  const [hydrating, setHydrating] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Instalar o PWA continua funcionando sem o SW registrado — só perde
        // o cache offline, não é crítico.
      });
    }
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    if (!session) {
      setCurrentUser(null);
      return;
    }
    let cancelled = false;
    setHydrating(true);
    setCurrentUser(session.user.id);
    pullAndHydrate(session.user.id).finally(() => {
      if (!cancelled) setHydrating(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  const readyForOnboardingCheck = isSupabaseConfigured ? !loading && !hydrating && !!session : true;

  useEffect(() => {
    if (!readyForOnboardingCheck) return;
    const profile = getProfile();
    if (profile.onboardingCompleto) return;
    if (!isUntouchedProfile(profile)) {
      // Usuário de antes do onboarding existir — já tem dado real, não
      // interrompe, só marca como concluído silenciosamente.
      storage.set(STORAGE_KEYS.profile, { ...profile, onboardingCompleto: true });
      return;
    }
    setShowOnboarding(true);
  }, [readyForOnboardingCheck]);

  // Gate único de autenticação: nenhuma rota (nem /, /workout, /profile...)
  // renderiza o <Outlet/> sem sessão válida quando o Supabase está
  // configurado. Isso é deliberado em vez de checar sessão rota por rota —
  // uma rota nova esquecida de proteger simplesmente não existe aqui, já que
  // TODAS passam por este mesmo ponto antes do <Outlet/> mais abaixo. A
  // proteção de dado em si é reforçada de novo no banco via RLS (ver
  // supabase/schema.sql: toda policy em user_state exige auth.uid() =
  // user_id, então mesmo um bug aqui no cliente não vazaria dado de outro
  // usuário).
  if (isSupabaseConfigured && !loading && !session) {
    return <AuthScreen />;
  }

  if (isSupabaseConfigured && (loading || hydrating)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        Carregando seus dados…
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <>
        <OnboardingFlow onComplete={() => setShowOnboarding(false)} />
        <Toaster position="top-center" />
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-background">
      <div className="gradient-hero pointer-events-none fixed inset-x-0 top-0 h-[420px]" />
      <main className="relative mx-auto w-full max-w-md px-5 pb-28 pt-6 md:max-w-2xl">
        <InstallPrompt />
        <Outlet />
      </main>
      <BottomNav />
      <Toaster position="top-center" />
    </div>
  );
}
