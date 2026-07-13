import { useRelativeTool } from "@/lib/devTools/hooks/useRelativeTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolTextField } from "./_shared"

export default function RelativeTool() {
  const { input, setInput, output, run } = useRelativeTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextField label="Ngày" type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <ToolButton onClick={run}>Format</ToolButton>
      <p className="rounded bg-muted p-3 text-sm">{output}</p>
      <ToolButton variant="outline" onClick={() => copy(output ?? "")}>
        Copy
      </ToolButton>
    </div>
  )
}
