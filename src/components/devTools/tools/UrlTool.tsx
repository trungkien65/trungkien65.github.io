import { useUrlTool } from "@/lib/devTools/hooks/useUrlTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolOutputBlock, ToolTextField } from "./_shared"

export default function UrlTool() {
  const { input, setInput, output, parse } = useUrlTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextField
        label="URL"
        type="text"
        placeholder="https://example.com/path?foo=bar"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={parse}
      />
      {output && (
        <ToolOutputBlock label="PARSED" onCopy={() => copy(output)}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
