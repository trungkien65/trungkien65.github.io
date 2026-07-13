import { useJsonTypeTool } from "@/lib/devTools/hooks/useJsonTypeTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolOutputBlock, ToolTextAreaField } from "./_shared"

export default function JsonTypeTool() {
  const { input, setInput, output, run } = useJsonTypeTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextAreaField
        label="JSON SAMPLE"
        rows={6}
        placeholder='{"id":1}'
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={run}
      />
      {output && (
        <ToolOutputBlock label="TYPESCRIPT" onCopy={() => copy(output)}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
