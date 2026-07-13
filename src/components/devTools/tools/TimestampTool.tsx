import { useTimestampTool } from "@/lib/devTools/hooks/useTimestampTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolTextField } from "./_shared"

export default function TimestampTool() {
  const { input, setInput, output, toDate, toTimestamp, now } = useTimestampTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextField label="Timestamp (giây) hoặc ngày" type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={toDate}>Timestamp → Ngày</ToolButton>
        <ToolButton variant="outline" onClick={toTimestamp}>
          Ngày → Timestamp
        </ToolButton>
        <ToolButton variant="outline" onClick={now}>
          Now
        </ToolButton>
      </div>
      <p className="rounded bg-muted p-3 font-mono text-sm">{output}</p>
      <ToolButton variant="outline" onClick={() => copy(output ?? "")}>
        Copy output
      </ToolButton>
    </div>
  )
}
