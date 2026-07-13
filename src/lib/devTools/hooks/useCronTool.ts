import { useCallback, useState } from "react"
import { showToast } from "@/lib/ui/toast"

export function useCronTool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState<string | null>(null)

  const run = useCallback(() => {
    const parts = input.trim().split(/\s+/)
    if (parts.length < 5) {
      showToast("Cron cần 5 phần: phút giờ ngày tháng thứ", { variant: "destructive" })
      setOutput(null)
      return
    }
    const [min, hour, day, month, dow] = parts
    setOutput([`Phút: ${min}`, `Giờ: ${hour}`, `Ngày: ${day}`, `Tháng: ${month}`, `Thứ: ${dow}`].join("\n"))
  }, [input])

  return { input, setInput, output, run }
}
