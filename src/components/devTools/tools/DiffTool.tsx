import { useDiffTool } from "@/lib/devTools/hooks/useDiffTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { toolOutputPreClass } from "@/lib/devTools/uiMirror"
import { cn } from "@/lib/utils"
import { ToolTextAreaField } from "./_shared"

const TYPE_CLASS: Record<string, string> = {
  add: "bg-green-500/20 text-green-700 dark:text-green-400",
  remove: "bg-red-500/20 text-red-700 dark:text-red-400",
  same: "",
}

function prefixFor(type: string): string {
  return type === "add" ? "+" : type === "remove" ? "-" : " "
}

export default function DiffTool() {
  const { a, setA, b, setB, diff } = useDiffTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <ToolTextAreaField label="Text A" rows={6} value={a} onChange={(e) => setA(e.target.value)} />
        <ToolTextAreaField label="Text B" rows={6} value={b} onChange={(e) => setB(e.target.value)} />
      </div>
      {diff.length > 0 && (
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-sm font-medium">DIFF</span>
            <button
              type="button"
              onClick={() => copy(diff.map((d) => prefixFor(d.type) + (d.line || " ")).join("\n"))}
              className="text-xs text-primary hover:underline"
            >
              Copy
            </button>
          </div>
          <pre className={cn(toolOutputPreClass, "max-h-64")}>
            {diff.map((d, i) => (
              <div key={i} className={TYPE_CLASS[d.type]}>
                {prefixFor(d.type) + (d.line || " ")}
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  )
}
