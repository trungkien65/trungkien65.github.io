import { useNumberBaseTool, type NumberBase } from "@/lib/devTools/hooks/useNumberBaseTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { CopyLink, ToolButton, ToolTextField } from "./_shared"

export default function NumberBaseTool() {
  const { input, setInput, base, setBase, results, run } = useNumberBaseTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <ToolTextField type="text" value={input} onChange={(e) => setInput(e.target.value)} className="min-w-0 flex-1 font-mono" />
        <select
          value={base}
          onChange={(e) => setBase(e.target.value as NumberBase)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          <option value="dec">Decimal</option>
          <option value="hex">Hex</option>
          <option value="bin">Binary</option>
        </select>
      </div>
      <ToolButton onClick={run}>Convert</ToolButton>
      {results && (
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-sm font-medium text-foreground">OUTPUT</span>
            <CopyLink onClick={() => copy(results.map((r) => `${r.key}: ${r.value}`).join("\n"))} />
          </div>
          <div className="space-y-2 rounded border border-border bg-muted p-3 font-mono text-sm">
            {results.map((r) => (
              <div key={r.key}>
                {r.key}: {r.value}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
