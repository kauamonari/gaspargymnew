import { Link } from "@tanstack/react-router";
import { Home, Plus, Dumbbell, CalendarDays, Ruler, User } from "lucide-react";

const items = [
  { to: "/", label: "Hoje", icon: Home, activeClass: "data-[status=active]:text-primary" },
  { to: "/add", label: "Dieta", icon: Plus, activeClass: "data-[status=active]:text-primary" },
  {
    to: "/workout",
    label: "Treino",
    icon: Dumbbell,
    activeClass: "data-[status=active]:text-workout",
  },
  {
    to: "/days",
    label: "Dias",
    icon: CalendarDays,
    activeClass: "data-[status=active]:text-primary",
  },
  {
    to: "/progress",
    label: "Corpo",
    icon: Ruler,
    activeClass: "data-[status=active]:text-primary",
  },
  { to: "/profile", label: "Perfil", icon: User, activeClass: "data-[status=active]:text-primary" },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-background/85 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur-xl">
      <ul className="flex items-center justify-around">
        {items.map(({ to, label, icon: Icon, activeClass }) => (
          <li key={to}>
            <Link
              to={to}
              className={`group flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-muted-foreground transition-colors ${activeClass}`}
              activeOptions={{ exact: true }}
            >
              <Icon
                className="h-5 w-5 transition-transform group-hover:scale-110"
                strokeWidth={2.2}
              />
              <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
