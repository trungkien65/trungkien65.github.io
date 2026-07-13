import { useCsvTool } from "@/lib/devTools/hooks/useCsvTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolOutputBlock, ToolTextAreaField } from "./_shared"

export default function CsvTool() {
  const { input, setInput, output, run } = useCsvTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextAreaField label="CSV" rows={6} value={input} onChange={(e) => setInput(e.target.value)} />
      <ToolButton onClick={run}>Parse</ToolButton>
      {output && (
        <ToolOutputBlock label="JSON" onCopy={() => copy(output)}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
