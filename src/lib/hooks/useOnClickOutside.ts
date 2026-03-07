/**
 * Call callback when clicking outside element (e.g. close dropdown/modal).
 */
export function useOnClickOutside(
  element: HTMLElement | null,
  callback: () => void,
  options?: { enabled?: boolean }
): () => void {
  if (typeof document === "undefined") return () => {}

  const enabled = options?.enabled !== false

  const handler = (e: MouseEvent) => {
    if (!enabled || !element) return
    const target = e.target as Node
    if (element.contains(target)) return
    callback()
  }

  document.addEventListener("click", handler, true)
  return () => document.removeEventListener("click", handler, true)
}
