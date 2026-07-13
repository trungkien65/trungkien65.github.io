import { useUuidTool } from "@/lib/devTools/hooks/useUuidTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { CopyLink, ToolButton, ToolTextField } from "./_shared"

export default function UuidTool() {
  const { count, setCount, ids, generate } = useUuidTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <ToolTextField
          label="SỐ LƯỢNG"
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Number(e.target.value))}
          className="w-20"
          wrapperClassName="w-auto shrink-0"
        />
        <ToolButton onClick={generate}>Tạo UUID</ToolButton>
      </div>
      {ids.length > 0 && (
        <div>
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium text-foreground">UUID</span>
            <CopyLink onClick={() => copy(ids.join("\n"))}>Copy All</CopyLink>
          </div>
          <ul className="space-y-2">
            {ids.map((id) => (
              <li key={id} className="flex items-center gap-2 font-mono text-sm">
                <code className="flex-1 rounded bg-muted px-2 py-1">{id}</code>
                <CopyLink onClick={() => copy(id)} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
