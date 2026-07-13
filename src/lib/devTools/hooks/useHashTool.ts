import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

export const HASH_ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"] as const
export type HashAlgo = (typeof HASH_ALGOS)[number]

async function hashText(text: string, algo: HashAlgo): Promise<string> {
  const enc = new TextEncoder()
  const data = enc.encode(text)
  const buf = await crypto.subtle.digest(algo, data)
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export function useHashTool() {
  const [text, setText] = useState("")
  const [algo, setAlgo] = useState<HashAlgo>("SHA-256")
  const [output, setOutput] = useState<string | null>(null)

  const run = useCallback(async () => {
    const trimmed = text.trim()
    if (!trimmed) return
    try {
      setOutput(await hashText(trimmed, algo))
    } catch (e) {
      setOutput(null)
      showToast("Lỗi: " + (e instanceof Error ? e.message : "Unknown"), { variant: "destructive" })
    }
  }, [text, algo])

  return { text, setText, algo, setAlgo, output, run }
}
