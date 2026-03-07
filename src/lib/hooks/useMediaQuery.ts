/**
 * Media query: gọi callback với matches (ngay + mỗi khi đổi). Trả về unsubscribe.
 */
export function useMediaQuery(query: string, callback: (matches: boolean) => void): () => void {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return () => {}
  }

  const mql = window.matchMedia(query)
  callback(mql.matches)
  const handler = (e: MediaQueryListEvent) => callback(e.matches)
  mql.addEventListener("change", handler)
  return () => mql.removeEventListener("change", handler)
}

/** Chỉ đọc 1 lần (không subscribe). */
export function getMediaQueryMatches(query: string): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia(query).matches
}
