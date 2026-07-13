import { useCallback, useState } from "react"

function uuidv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function useUuidTool() {
  const [count, setCount] = useState(3)
  const [ids, setIds] = useState<string[]>([])

  const generate = useCallback(() => {
    const n = Math.min(Math.max(1, count || 1), 50)
    setIds(Array.from({ length: n }, () => uuidv4()))
  }, [count])

  return { count, setCount, ids, generate }
}
