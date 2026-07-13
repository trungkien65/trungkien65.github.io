import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

export function useBase64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const encode = useCallback(() => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))))
    } catch {
      showToast("Không thể encode", { variant: "destructive" })
    }
  }, [input])

  const decode = useCallback(() => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))))
    } catch {
      showToast("Base64 không hợp lệ", { variant: "destructive" })
    }
  }, [input])

  return { input, setInput, output, encode, decode }
}
