/**
 * Helper localStorage: get/set and subscribe when key changes (storage event or local set).
 * Use when need to read/write and react to changes (e.g. theme).
 */
export function getLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(value) }))
  } catch {
    // ignore
  }
}

/** Subscribe when key value changes (storage event from other tab or setLocalStorage). */
export function subscribeLocalStorage(key: string, callback: (value: string | null) => void): () => void {
  if (typeof window === "undefined") return () => {}

  const handler = (e: StorageEvent) => {
    if (e.key === key) callback(e.newValue)
  }
  window.addEventListener("storage", handler)
  return () => window.removeEventListener("storage", handler)
}
