import { useCaseTool } from "@/lib/devTools/hooks/useCaseTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { CopyLink, ToolTextField } from "./_shared"

export default function CaseTool() {
  const { input, setInput, rows } = useCaseTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextField
        label="SOURCE TEXT"
        type="text"
        placeholder="devPocketToolsV2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-2">
            <span className="w-28 shrink-0 text-sm text-muted-foreground">{r.label}</span>
            <code className="flex-1 rounded bg-muted px-2 py-1 font-mono text-sm">{r.value}</code>
            <CopyLink onClick={() => copy(r.value)} />
          </div>
        ))}
      </div>
    </div>
  )
}
