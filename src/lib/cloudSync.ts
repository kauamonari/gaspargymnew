import { supabase } from "@/lib/supabase";

// Mesma lista de chaves de src/storage/storage.ts, repetida aqui como
// strings literais (não importamos STORAGE_KEYS de lá) só pra evitar um
// import circular entre storage.ts <-> cloudSync.ts.
const SYNCED_KEYS = [
  "fitdiet:meals",
  "fitdiet:weights",
  "fitdiet:profile",
  "fitdiet:workoutSets",
  "fitdiet:workoutBlocks",
  "fitdiet:mealTypes",
  "fitdiet:customExercises",
];

let currentUserId: string | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

export function setCurrentUser(userId: string | null) {
  currentUserId = userId;
}

function readAllLocal(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of SYNCED_KEYS) {
    const raw = window.localStorage.getItem(key);
    if (raw === null) continue;
    try {
      out[key] = JSON.parse(raw);
    } catch {
      // ignora entradas corrompidas
    }
  }
  return out;
}

function writeAllLocal(data: Record<string, unknown>) {
  for (const key of SYNCED_KEYS) {
    if (key in data) window.localStorage.setItem(key, JSON.stringify(data[key]));
  }
}

/** Chamado a cada gravação local (storage.set). Agenda um envio pra nuvem
 * com debounce, pra não disparar uma requisição por tecla digitada. */
export function pushIfLoggedIn() {
  if (!supabase || !currentUserId) return;
  const userId = currentUserId;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    const data = readAllLocal();
    supabase!
      .from("user_state")
      .upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
  }, 1200);
}

export type HydrateResult = "hydrated" | "uploaded" | "empty" | "error";

/** Roda uma vez ao logar (ou ao abrir o app já logado). Se já existe estado
 * salvo na nuvem, sobrescreve o localStorage com ele (a nuvem manda). Se é o
 * primeiro login e não existe nada na nuvem ainda, sobe o que já tinha
 * localmente — assim o progresso que a pessoa já tinha feito sem conta não
 * se perde. */
export async function pullAndHydrate(userId: string): Promise<HydrateResult> {
  if (!supabase) return "error";
  try {
    const { data: row, error } = await supabase
      .from("user_state")
      .select("data")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return "error";

    if (row?.data && Object.keys(row.data as object).length > 0) {
      writeAllLocal(row.data as Record<string, unknown>);
      return "hydrated";
    }

    const local = readAllLocal();
    if (Object.keys(local).length > 0) {
      await supabase
        .from("user_state")
        .upsert({ user_id: userId, data: local, updated_at: new Date().toISOString() });
      return "uploaded";
    }
    return "empty";
  } catch {
    return "error";
  }
}

/** Limpa os dados locais — chamado no logout, pra não misturar o progresso
 * de duas contas diferentes no mesmo aparelho. */
export function clearLocalData() {
  for (const key of SYNCED_KEYS) window.localStorage.removeItem(key);
}
