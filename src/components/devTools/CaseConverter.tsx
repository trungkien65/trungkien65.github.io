/**
 * Case Converter - camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE
 */
import { useState, useMemo } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function toCamelCase(s: string): string {
  return s
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^[A-Z]/, (c) => c.toLowerCase())
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
  const camel = toCamelCase(s)
  return camel.charAt(0).toUpperCase() + camel.slice(1)
}

function toConstantCase(s: string): string {
  return toSnakeCase(s).toUpperCase()
}

const CASES = [
  { key: "camel", label: "camelCase", fn: toCamelCase },
  { key: "snake", label: "snake_case", fn: toSnakeCase },
  { key: "kebab", label: "kebab-case", fn: toKebabCase },
  { key: "pascal", label: "PascalCase", fn: toPascalCase },
  { key: "constant", label: "CONSTANT_CASE", fn: toConstantCase },
] as const

export function CaseConverter() {
  const [input, setInput] = useState("")

  const results = useMemo(() => {
    if (!input.trim()) return []
    return CASES.map((c) => ({ ...c, value: c.fn(input.trim()) }))
  }, [input])

  return (
    <ToolCard
      title="Case Converter"
      description="Đổi nhanh giữa các naming convention."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">SOURCE TEXT</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="devPocketToolsV2"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          {results.map((r) => (
            <div key={r.key} className="flex items-center gap-2">
              <span className="w-28 shrink-0 text-sm text-muted-foreground">{r.label}</span>
              <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-sm">{r.value}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(r.value)}
                className="text-xs text-primary hover:underline"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToolCard>
  )
}
