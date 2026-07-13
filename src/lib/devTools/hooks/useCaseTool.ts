import { useMemo, useState } from "react"

function toCamelCase(s: string): string {
  return s.replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : "")).replace(/^[A-Z]/, (c) => c.toLowerCase())
}
function toSnakeCase(s: string): string {
  return s
    .replace(/([A-Z])/g, "_$1")
    .replace(/[- ]/g, "_")
    .toLowerCase()
    .replace(/^_/, "")
}
function toKebabCase(s: string): string {
  return toSnakeCase(s).replace(/_/g, "-")
}
function toPascalCase(s: string): string {
  const c = toCamelCase(s)
  return c.charAt(0).toUpperCase() + c.slice(1)
}
function toConstantCase(s: string): string {
  return toSnakeCase(s).toUpperCase()
}

const CASES: { key: string; label: string; fn: (s: string) => string }[] = [
  { key: "camel", label: "camelCase", fn: toCamelCase },
  { key: "snake", label: "snake_case", fn: toSnakeCase },
  { key: "kebab", label: "kebab-case", fn: toKebabCase },
  { key: "pascal", label: "PascalCase", fn: toPascalCase },
  { key: "constant", label: "CONSTANT_CASE", fn: toConstantCase },
]

export function useCaseTool() {
  const [input, setInput] = useState("")
  const rows = useMemo(() => {
    const v = input.trim()
    if (!v) return []
    return CASES.map((c) => ({ key: c.key, label: c.label, value: c.fn(v) }))
  }, [input])

  return { input, setInput, rows }
}
