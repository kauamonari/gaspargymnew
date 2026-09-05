// Fotos de evolução corporal — guardadas no IndexedDB do próprio aparelho,
// NUNCA sincronizadas com a nuvem. O app hoje só sincroniza um blob JSON de
// texto (ver cloudSync.ts); empurrar fotos por esse mesmo caminho estufaria
// esse JSON e o bucket de storage necessário ainda não existe no schema do
// Supabase. Como o pedido é justamente manter as fotos privadas, ficarem
// só no dispositivo atende o requisito sem inventar infraestrutura nova.
const isBrowser = typeof window !== "undefined" && typeof indexedDB !== "undefined";

const DB_NAME = "gaspargym-body-photos";
const STORE = "photos";
const DB_VERSION = 1;

export type PhotoCategory = "frente" | "costas" | "lateral";

export const PHOTO_CATEGORY_LABELS: Record<PhotoCategory, string> = {
  frente: "Frente",
  costas: "Costas",
  lateral: "Lateral",
};

export interface BodyPhotoRecord {
  id: string;
  date: string; // ISO
  category: PhotoCategory;
  blob: Blob;
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addBodyPhoto(
  blob: Blob,
  category: PhotoCategory,
  date: string,
): Promise<BodyPhotoRecord> {
  if (!isBrowser) throw new Error("IndexedDB indisponível");
  const db = await openDb();
  const record: BodyPhotoRecord = { id: crypto.randomUUID(), date, category, blob };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return record;
}

export async function listBodyPhotos(): Promise<BodyPhotoRecord[]> {
  if (!isBrowser) return [];
  const db = await openDb();
  const records = await new Promise<BodyPhotoRecord[]>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result as BodyPhotoRecord[]);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return records.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function deleteBodyPhoto(id: string): Promise<void> {
  if (!isBrowser) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

/** Apaga todas as fotos de evolução deste aparelho — usado em
 * Configurações > Privacidade e na exclusão de conta. */
export async function clearAllBodyPhotos(): Promise<void> {
  if (!isBrowser) return;
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
