import { useQueryTool } from "@/lib/devTools/hooks/useQueryTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolOutputBlock, ToolTextAreaField } from "./_shared"

export default function QueryTool() {
  const { input, setInput, output, parse, build } = useQueryTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextAreaField label="Query string hoặc JSON" rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={parse}>Parse</ToolButton>
        <ToolButton variant="outline" onClick={build}>
          Build (từ JSON)
        </ToolButton>
      </div>
      {output && (
        <ToolOutputBlock label="OUTPUT" onCopy={() => copy(output)}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
