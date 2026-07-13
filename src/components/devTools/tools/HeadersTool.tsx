import { useHeadersTool } from "@/lib/devTools/hooks/useHeadersTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolOutputBlock, ToolTextAreaField } from "./_shared"

export default function HeadersTool() {
  const { input, setInput, output, parsed, run } = useHeadersTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextAreaField
        label="Headers"
        rows={6}
        placeholder="Content-Type: application/json"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={run}
      />
      {output && (
        <ToolOutputBlock label="PARSED" onCopy={() => copy(JSON.stringify(parsed, null, 2))}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
