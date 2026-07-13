import { useCallback } from "react"
import { copyToClipboard } from "@/lib/devTools/clipboard"

/** Copy helper shared by dev-tools React islands. */
export function useClipboardCopy() {
  return useCallback((text: string) => {
    void copyToClipboard(text)
  }, [])
}
