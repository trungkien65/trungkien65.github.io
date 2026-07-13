import { useSlugTool } from "@/lib/devTools/hooks/useSlugTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { CopyLink, ToolTextField } from "./_shared"

export default function SlugTool() {
  const { input, setInput, slug } = useSlugTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextField label="SOURCE TEXT" type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      {slug && (
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-sm font-medium text-foreground">SLUG</span>
            <CopyLink onClick={() => copy(slug)} />
          </div>
          <code className="block rounded bg-muted p-3 font-mono text-sm">{slug}</code>
        </div>
      )}
    </div>
  )
}
