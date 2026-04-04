import { copyToClipboard } from "@/lib/devTools/clipboard"

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

export function initCase(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>("[data-dt-case-input]")
  const rows = root.querySelector<HTMLElement>("[data-dt-case-rows]")
  if (!input || !rows) return

  const render = () => {
    const v = input.value.trim()
    rows.innerHTML = ""
    if (!v) return
    for (const c of CASES) {
      const val = c.fn(v)
      const row = document.createElement("div")
      row.className = "flex items-center gap-2"
      row.innerHTML = `<span class="w-28 shrink-0 text-sm text-muted-foreground">${c.label}</span><code class="flex-1 rounded bg-muted px-2 py-1 font-mono text-sm"></code><button type="button" class="text-xs text-primary hover:underline">Copy</button>`
      row.querySelector("code")!.textContent = val
      row.querySelector("button")!.addEventListener("click", () => copyToClipboard(val))
      rows.appendChild(row)
    }
  }
  input.addEventListener("input", render)
}
