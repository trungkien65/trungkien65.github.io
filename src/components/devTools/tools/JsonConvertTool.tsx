import { type JsonConvertKind, useJsonConvertTool } from "@/lib/devTools/hooks/useJsonConvertTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolOutputBlock, ToolTextAreaField, ToolTextField } from "./_shared"

const ACTION_LABEL: Record<JsonConvertKind, string> = {
  xml: "Chuyển sang XML",
  csv: "Chuyển sang CSV",
  yaml: "Chuyển sang YAML",
}

const PLACEHOLDER: Record<JsonConvertKind, string> = {
  xml: '{"user":{"name":"A"}}',
  csv: '[{"a":1}]',
  yaml: '{"a":1}',
}

export default function JsonConvertTool({ kind }: { kind: JsonConvertKind }) {
  const { input, setInput, root, setRoot, output, convert, label } = useJsonConvertTool(kind)
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      {kind === "xml" ? (
        <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <ToolTextAreaField
            label="JSON"
            rows={8}
            placeholder={PLACEHOLDER.xml}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <ToolTextField
            label="Tên root"
            type="text"
            value={root}
            onChange={(e) => setRoot(e.target.value)}
            className="font-mono"
            wrapperClassName="sm:min-w-[140px]"
          />
        </div>
      ) : (
        <ToolTextAreaField
          label="JSON"
          rows={8}
          placeholder={PLACEHOLDER[kind]}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      )}
      <ToolButton onClick={convert}>{ACTION_LABEL[kind]}</ToolButton>
      {output && (
        <ToolOutputBlock label={label} onCopy={() => copy(output)}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
