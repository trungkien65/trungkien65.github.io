import { useRegexTool } from "@/lib/devTools/hooks/useRegexTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolOutputBlock, ToolTextAreaField, ToolTextField } from "./_shared"

export default function RegexTool() {
  const { pattern, setPattern, flags, setFlags, text, setText, output, run } = useRegexTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <ToolTextField
        label="Pattern"
        type="text"
        placeholder="\d+"
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        className="font-mono"
      />
      <ToolTextField
        label="Flags"
        type="text"
        value={flags}
        onChange={(e) => setFlags(e.target.value)}
        className="w-20 font-mono"
        wrapperClassName="w-auto"
      />
      <ToolTextAreaField label="Text" rows={4} value={text} onChange={(e) => setText(e.target.value)} />
      <ToolButton onClick={run}>Test</ToolButton>
      {output && (
        <ToolOutputBlock label="Matches" onCopy={() => copy(output)}>
          {output}
        </ToolOutputBlock>
      )}
    </div>
  )
}
