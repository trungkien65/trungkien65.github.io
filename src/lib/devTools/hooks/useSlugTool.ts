import { useMemo, useState } from "react"

function toSlug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function useSlugTool() {
  const [input, setInput] = useState("")
  const slug = useMemo(() => {
    const v = input.trim()
    return v ? toSlug(v) : null
  }, [input])

  return { input, setInput, slug }
}
