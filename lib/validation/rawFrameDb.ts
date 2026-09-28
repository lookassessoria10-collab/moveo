import { RawFrameRecord } from "./types";

// Guardado em IndexedDB (não localStorage/sessionStorage): os registros
// brutos podem crescer bem mais do que o CSV (uma sequência de quadros
// por repetição), e IndexedDB é feito para isso — muito mais espaço
// disponível no navegador, sem travar a interface para escrever.
const DB_NAME = "uort-validation-raw-frames";
const STORE_NAME = "records";
const DB_VERSION = 1;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "recordId" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Salva a sequência bruta de uma repetição (chamado no mesmo instante em que a linha do CSV é gravada). */
export async function addRawFrameRecord(record: RawFrameRecord): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function getAllRawFrameRecords(): Promise<RawFrameRecord[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as RawFrameRecord[]);
    req.onerror = () => reject(req.error);
  });
}

export async function countRawFrameRecords(): Promise<number> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function clearRawFrameRecords(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Baixa todos os registros brutos acumulados como um único arquivo JSON. */
export async function downloadRawFrameRecords(): Promise<void> {
  const records = await getAllRawFrameRecords();
  const json = JSON.stringify(records);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `uort-validacao-pontos-brutos-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
