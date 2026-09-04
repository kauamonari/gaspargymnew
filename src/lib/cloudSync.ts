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
<<<<<<< HEAD
let pendingPush: { userId: string; data: Record<string, unknown> } | null = null;

export type SyncStatus = "idle" | "pending" | "synced" | "error";
let status: SyncStatus = "idle";
let listeners: ((s: SyncStatus) => void)[] = [];

function setStatus(next: SyncStatus) {
  status = next;
  for (const l of listeners) l(next);
}

export function getSyncStatus(): SyncStatus {
  return status;
}

export function onSyncStatusChange(listener: (s: SyncStatus) => void): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function setCurrentUser(userId: string | null) {
  currentUserId = userId;
  if (!userId) setStatus("idle");
=======

export function setCurrentUser(userId: string | null) {
  currentUserId = userId;
>>>>>>> origin/main
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

<<<<<<< HEAD
async function sendToCloud(userId: string, data: Record<string, unknown>) {
  if (!supabase) return;
  const { error } = await supabase
    .from("user_state")
    .upsert({ user_id: userId, data, updated_at: new Date().toISOString() });
  if (error) {
    // Motivo mais comum: a tabela user_state ainda não existe (schema.sql
    // não foi rodado no Supabase) ou a política de RLS está bloqueando.
    console.error("[cloudSync] falha ao salvar na nuvem:", error.message);
    setStatus("error");
  } else {
    setStatus("synced");
  }
}

/** Chamado a cada gravação local (storage.set). Captura o estado JÁ NESSE
 * MOMENTO (não quando o timer disparar) — isso é essencial: se o usuário
 * sair da conta logo em seguida, o envio agendado não pode acabar lendo um
 * localStorage que já foi limpo pelo logout. */
export function pushIfLoggedIn() {
  if (!supabase || !currentUserId) return;
  const userId = currentUserId;
  const data = readAllLocal();
  pendingPush = { userId, data };
  setStatus("pending");

  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => {
    const toSend = pendingPush;
    pendingPush = null;
    pushTimer = null;
    if (toSend) sendToCloud(toSend.userId, toSend.data);
  }, 1200);
}

/** Envia imediatamente qualquer alteração ainda pendente, sem esperar o
 * debounce. Use antes de deslogar ou fechar a sessão, senão a última
 * alteração pode nunca chegar na nuvem. */
export async function flushPendingPush(): Promise<void> {
  if (pushTimer) {
    clearTimeout(pushTimer);
    pushTimer = null;
  }
  const toSend = pendingPush;
  pendingPush = null;
  if (toSend) await sendToCloud(toSend.userId, toSend.data);
}

=======
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

>>>>>>> origin/main
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

<<<<<<< HEAD
    if (error) {
      console.error("[cloudSync] falha ao ler da nuvem:", error.message);
      setStatus("error");
      return "error";
    }

    if (row?.data && Object.keys(row.data as object).length > 0) {
      writeAllLocal(row.data as Record<string, unknown>);
      setStatus("synced");
=======
    if (error) return "error";

    if (row?.data && Object.keys(row.data as object).length > 0) {
      writeAllLocal(row.data as Record<string, unknown>);
>>>>>>> origin/main
      return "hydrated";
    }

    const local = readAllLocal();
    if (Object.keys(local).length > 0) {
<<<<<<< HEAD
      await sendToCloud(userId, local);
      return "uploaded";
    }
    setStatus("synced");
    return "empty";
  } catch (err) {
    console.error("[cloudSync] erro inesperado ao hidratar:", err);
    setStatus("error");
=======
      await supabase
        .from("user_state")
        .upsert({ user_id: userId, data: local, updated_at: new Date().toISOString() });
      return "uploaded";
    }
    return "empty";
  } catch {
>>>>>>> origin/main
    return "error";
  }
}

/** Limpa os dados locais — chamado no logout, pra não misturar o progresso
<<<<<<< HEAD
 * de duas contas diferentes no mesmo aparelho. Só deve ser chamado DEPOIS de
 * flushPendingPush() ter terminado. */
=======
 * de duas contas diferentes no mesmo aparelho. */
>>>>>>> origin/main
export function clearLocalData() {
  for (const key of SYNCED_KEYS) window.localStorage.removeItem(key);
}
