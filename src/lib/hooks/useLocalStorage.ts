/**
 * Helper localStorage: get/set và subscribe khi key thay đổi (storage event hoặc set local).
 * Dùng khi cần đọc/ghi và phản ứng với thay đổi (vd: theme).
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

/** Subscribe khi giá trị key thay đổi (storage event từ tab khác hoặc setLocalStorage). */
export function subscribeLocalStorage(key: string, callback: (value: string | null) => void): () => void {
  if (typeof window === "undefined") return () => {}

  const handler = (e: StorageEvent) => {
    if (e.key === key) callback(e.newValue)
  }
  window.addEventListener("storage", handler)
  return () => window.removeEventListener("storage", handler)
}
