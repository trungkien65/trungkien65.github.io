import { useCronTool } from "@/lib/devTools/hooks/useCronTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolOutputBlock, ToolTextField } from "./_shared"

export default function CronTool() {
  const { input, setInput, output, run } = useCronTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextField label="Cron" type="text" placeholder="*/5 * * * *" value={input} onChange={(e) => setInput(e.target.value)} className="font-mono" />
      <ToolButton onClick={run}>Parse</ToolButton>
      {output && (
        <ToolOutputBlock label="PARSED" onCopy={() => copy(output)}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
