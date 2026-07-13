import { useBase64Tool } from "@/lib/devTools/hooks/useBase64Tool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolOutputBlock, ToolTextAreaField } from "./_shared"

export default function Base64Tool() {
  const { input, setInput, output, encode, decode } = useBase64Tool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextAreaField label="INPUT" rows={4} value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={encode}>Encode</ToolButton>
        <ToolButton variant="outline" onClick={decode}>
          Decode
        </ToolButton>
      </div>
      {output !== null && (
        <ToolOutputBlock label="OUTPUT" onCopy={() => copy(output)}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
