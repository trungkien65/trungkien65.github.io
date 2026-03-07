/**
 * Media query: call callback with matches (immediately + on each change). Returns unsubscribe.
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

/** Read once only (no subscribe). */
export function getMediaQueryMatches(query: string): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia(query).matches
}
