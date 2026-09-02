import { useState } from "react";
import { Dumbbell, LogIn, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    setError(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(traduzErro(error.message));
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(traduzErro(error.message));
      } else if (!data.session) {
        // Projeto com confirmação de e-mail ativada — sem sessão ainda.
        setCheckEmail(true);
      }
    }
    setLoading(false);
  }

  if (checkEmail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="rounded-full bg-primary/15 p-4 text-primary">
          <UserPlus className="h-6 w-6" />
        </div>
        <h1 className="font-display text-xl font-bold">Confirme seu e-mail</h1>
        <p className="max-w-xs text-sm text-muted-foreground">
          Enviamos um link de confirmação para{" "}
          <span className="font-medium text-foreground">{email}</span>. Depois de confirmar, volte
          aqui e faça login.
        </p>
        <button
          onClick={() => {
            setCheckEmail(false);
            setMode("login");
          }}
          className="mt-2 text-sm font-medium text-primary hover:underline"
        >
          Voltar para o login
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-center px-6">
      <div className="mx-auto w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-primary/15 p-4 text-primary">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold">
              GASPAR<span className="text-primary">GYM</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none ring-primary/40 focus:ring-2"
              required
            />
          </label>
          <label className="block">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Senha</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="mt-1 h-12 w-full rounded-xl border border-border bg-card px-4 text-sm outline-none ring-primary/40 focus:ring-2"
              required
            />
          </label>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="shadow-glow flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            {mode === "login" ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {loading ? "Aguarde…" : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
          }}
          className="mx-auto block text-sm text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>

        {mode === "login" && (
          <p className="text-center text-xs text-muted-foreground">
            Seus dados ficam salvos na nuvem — não somem mais ao limpar o navegador ou trocar de
            aparelho.
          </p>
        )}
      </div>
    </div>
  );
}

function traduzErro(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (msg.includes("already registered")) return "Esse e-mail já está cadastrado.";
  if (msg.includes("Password should be")) return "A senha precisa ter pelo menos 6 caracteres.";
  return msg;
}
