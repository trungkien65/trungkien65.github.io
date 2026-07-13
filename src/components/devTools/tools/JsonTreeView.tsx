import { useState } from "react"
import { cn } from "@/lib/utils"

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue }

function isExpandable(v: JsonValue): v is JsonValue[] | { [key: string]: JsonValue } {
  return v !== null && typeof v === "object"
}

function collectionPreview(v: JsonValue[] | { [key: string]: JsonValue }): string {
  if (Array.isArray(v)) return v.length === 0 ? "" : `${v.length} ${v.length === 1 ? "item" : "items"}`
  const keys = Object.keys(v)
  return keys.length === 0 ? "" : `${keys.length} ${keys.length === 1 ? "key" : "keys"}`
}

function PrimitiveValue({ value }: { value: JsonValue }) {
  if (value === null) return <span className="text-zinc-400 dark:text-zinc-500">null</span>
  if (typeof value === "boolean") return <span className="text-amber-600 dark:text-amber-400">{String(value)}</span>
  if (typeof value === "number") return <span className="text-sky-600 dark:text-sky-400">{value}</span>
  return <span className="text-emerald-600 dark:text-emerald-400">{JSON.stringify(value)}</span>
}

interface TreeNodeProps {
  keyLabel?: string
  isIndex?: boolean
  value: JsonValue
  depth: number
}

function TreeNode({ keyLabel, isIndex, value, depth }: TreeNodeProps) {
  const [open, setOpen] = useState(depth === 0)

  const keyPrefix = keyLabel !== undefined && (
    <>
      {isIndex ? (
        <span className="text-muted-foreground">{keyLabel}</span>
      ) : (
        <span className="text-fuchsia-600 dark:text-fuchsia-400">&quot;{keyLabel}&quot;</span>
      )}
      <span className="text-muted-foreground">: </span>
    </>
  )

  if (!isExpandable(value)) {
    return (
      <div className="whitespace-pre">
        {keyPrefix}
        <PrimitiveValue value={value} />
      </div>
    )
  }

  const isArray = Array.isArray(value)
  const entries = isArray ? value.map((v, i) => [String(i), v] as const) : Object.entries(value)
  const openBracket = isArray ? "[" : "{"
  const closeBracket = isArray ? "]" : "}"
  const preview = collectionPreview(value)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded px-0.5 text-left hover:bg-muted/60"
      >
        <span className="inline-block w-3 shrink-0 text-muted-foreground">{entries.length === 0 ? "" : open ? "▼" : "▶"}</span>
        {keyPrefix}
        <span className="text-muted-foreground">{openBracket}</span>
        {!open && entries.length > 0 && (
          <span className="italic text-muted-foreground/70">{preview}</span>
        )}
        {(!open || entries.length === 0) && <span className="text-muted-foreground">{closeBracket}</span>}
      </button>
      {open && entries.length > 0 && (
        <div className="ml-4 border-l border-border/60 pl-2">
          {entries.map(([k, v]) => (
            <TreeNode key={k} keyLabel={k} isIndex={isArray} value={v} depth={depth + 1} />
          ))}
          <div className="text-muted-foreground">{closeBracket}</div>
        </div>
      )}
    </div>
  )
}

export interface JsonTreeViewProps {
  data: JsonValue
  className?: string
}

/** Collapsible JSON tree — click a bracket to fold/unfold that node. Root starts expanded. */
export function JsonTreeView({ data, className }: JsonTreeViewProps) {
  return (
    <div className={cn("font-mono text-xs leading-relaxed", className)}>
      <TreeNode value={data} depth={0} />
    </div>
  )
}
