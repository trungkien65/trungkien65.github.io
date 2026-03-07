/**
 * Text Diff - So sánh 2 đoạn text
 */
import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { ToolCard, copyToClipboard } from "./ToolCard"

function simpleDiff(a: string, b: string): { line: string; type: "same" | "add" | "remove" }[] {
  const linesA = a.split("\n")
  const linesB = b.split("\n")
  const result: { line: string; type: "same" | "add" | "remove" }[] = []
  let i = 0
  let j = 0
  while (i < linesA.length || j < linesB.length) {
    if (i < linesA.length && j < linesB.length && linesA[i] === linesB[j]) {
      result.push({ line: linesA[i], type: "same" })
      i++
      j++
    } else if (j < linesB.length && (i >= linesA.length || !linesA.slice(i).includes(linesB[j]))) {
      result.push({ line: linesB[j], type: "add" })
      j++
    } else if (i < linesA.length) {
      result.push({ line: linesA[i], type: "remove" })
      i++
    } else {
      j++
    }
  }
  return result
}

export function TextDiffTool() {
  const [textA, setTextA] = useState("")
  const [textB, setTextB] = useState("")

  const diff = useMemo(() => simpleDiff(textA, textB), [textA, textB])

  return (
    <ToolCard
      title="Text Diff"
      description="So sánh 2 đoạn text."
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Text A</label>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Text gốc..."
              className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
              rows={6}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Text B</label>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Text mới..."
              className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
              rows={6}
            />
          </div>
        </div>
        {diff.length > 0 && (
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium">DIFF</span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(
                    diff.map((d) => (d.type === "add" ? "+" : d.type === "remove" ? "-" : " ") + d.line).join("\n")
                  )
                }
                className="text-xs text-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <pre className="max-h-64 overflow-auto rounded bg-muted p-3 font-mono text-xs">
              {diff.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    d.type === "add" && "bg-green-500/20 text-green-700 dark:text-green-400",
                    d.type === "remove" && "bg-red-500/20 text-red-700 dark:text-red-400"
                  )}
                >
                  {d.type === "add" ? "+" : d.type === "remove" ? "-" : " "}
                  {d.line || " "}
                </div>
              ))}
            </pre>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
