import { HASH_ALGOS, useHashTool } from "@/lib/devTools/hooks/useHashTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { cn } from "@/lib/utils"
import { ToolButton, ToolOutputBlock, ToolTextAreaField } from "./_shared"

export default function HashTool() {
  const { text, setText, algo, setAlgo, output, run } = useHashTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextAreaField
        label="TEXT"
        rows={3}
        placeholder="Nhập text cần hash"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {HASH_ALGOS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAlgo(a)}
            className={cn("rounded px-3 py-1.5 text-sm", a === algo ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80")}
          >
            {a}
          </button>
        ))}
        <ToolButton onClick={run}>Sinh hash</ToolButton>
      </div>
      {output && (
        <ToolOutputBlock label="HASH OUTPUT" onCopy={() => copy(output)} className="break-all">
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
