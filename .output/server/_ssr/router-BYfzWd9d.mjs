import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { H as House, P as Plus, D as Dumbbell, C as CalendarDays, U as User } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const appCss = "/assets/styles-Cnp7MTl0.css";
const items = [
  { to: "/", label: "Hoje", icon: House, activeClass: "data-[status=active]:text-primary" },
  { to: "/add", label: "Dieta", icon: Plus, activeClass: "data-[status=active]:text-primary" },
  {
    to: "/workout",
    label: "Treino",
    icon: Dumbbell,
    activeClass: "data-[status=active]:text-workout"
  },
  {
    to: "/days",
    label: "Dias",
    icon: CalendarDays,
    activeClass: "data-[status=active]:text-primary"
  },
  { to: "/profile", label: "Perfil", icon: User, activeClass: "data-[status=active]:text-primary" }
];
function BottomNav() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/85 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "flex items-center justify-around", children: items.map(({ to, label, icon: Icon, activeClass }) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      className: `group flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-muted-foreground transition-colors ${activeClass}`,
      activeOptions: { exact: true },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon,
          {
            className: "h-5 w-5 transition-transform group-hover:scale-110",
            strokeWidth: 2.2
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium uppercase tracking-wider", children: label })
      ]
    }
  ) }, to)) }) });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$6 = createRootRouteWithContext()({
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
      { name: "twitter:description", content: "Suas calorias e macros de hoje em um único lugar." }
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
      },
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$6.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "gradient-hero pointer-events-none fixed inset-x-0 top-0 h-[420px]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "relative mx-auto w-full max-w-md px-5 pb-28 pt-6 md:max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(BottomNav, {})
  ] }) });
}
const $$splitComponentImporter$5 = () => import("./index-BO24P2m3.mjs");
const Route$5 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Gaspar Gym — Hoje"
    }, {
      name: "description",
      content: "Seu centro de controle diário: dieta, treino e evolução."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./add-DAB7WSEa.mjs");
const searchSchema = objectType({
  type: stringType().optional()
});
const Route$4 = createFileRoute()({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{
      title: "Gaspar Gym — Adicionar refeição"
    }, {
      name: "description",
      content: "Pesquise alimentos ou registre calorias extras manualmente."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./days-5lLdzXux.mjs");
const Route$3 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Gaspar Gym — Dias"
    }, {
      name: "description",
      content: "Calendário com suas calorias e macros dos dias anteriores."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./profile-y2BW3WRL.mjs");
const Route$2 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Gaspar Gym — Perfil"
    }, {
      name: "description",
      content: "Configure seus dados e objetivo para calcular calorias diárias."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./progress-fk5bnK7R.mjs");
const Route$1 = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Gaspar Gym — Evolução"
    }, {
      name: "description",
      content: "Acompanhe sua evolução de peso semana a semana."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./workout-DWOSSO7K.mjs");
const Route = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Gaspar Gym — Treino"
    }, {
      name: "description",
      content: "Organize seus treinos em blocos e acompanhe a evolução de carga."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const IndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$6
});
const AddRoute = Route$4.update({
  id: "/add",
  path: "/add",
  getParentRoute: () => Route$6
});
const DaysRoute = Route$3.update({
  id: "/days",
  path: "/days",
  getParentRoute: () => Route$6
});
const ProfileRoute = Route$2.update({
  id: "/profile",
  path: "/profile",
  getParentRoute: () => Route$6
});
const ProgressRoute = Route$1.update({
  id: "/progress",
  path: "/progress",
  getParentRoute: () => Route$6
});
const WorkoutRoute = Route.update({
  id: "/workout",
  path: "/workout",
  getParentRoute: () => Route$6
});
const rootRouteChildren = {
  IndexRoute,
  AddRoute,
  DaysRoute,
  ProfileRoute,
  ProgressRoute,
  WorkoutRoute
};
const routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$4 as R,
  router as r
};
