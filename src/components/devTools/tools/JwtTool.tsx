import { useJwtTool } from "@/lib/devTools/hooks/useJwtTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolOutputBlock, ToolTextAreaField } from "./_shared"

export default function JwtTool() {
  const { input, setInput, result, decode } = useJwtTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextAreaField
        label="JWT"
        rows={3}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={decode}
      />
      {result && (
        <div className="space-y-4">
          <ToolOutputBlock label="HEADER" onCopy={() => copy(result.header)}>
            {result.header}
          </ToolOutputBlock>
          <ToolOutputBlock label="PAYLOAD" onCopy={() => copy(result.payload)}>
            {result.payload}
          </ToolOutputBlock>
          {result.timeClaims.length > 0 && (
            <div>
              <span className="text-sm font-medium text-foreground">TIME CLAIMS</span>
              <ul className="mt-2 space-y-1 text-sm">
                {result.timeClaims.map((t) => (
                  <li key={t.key}>{t.text}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
