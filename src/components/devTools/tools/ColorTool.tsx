import { useColorTool } from "@/lib/devTools/hooks/useColorTool"
import { useClipboardCopy } from "@/lib/devTools/hooks/useClipboardCopy"
import { ToolButton, ToolTextField } from "./_shared"

export default function ColorTool() {
  const { hex, setHex, rgb, setRgb, hsl, swatch, applyHex, applyRgb } = useColorTool()
  const copy = useClipboardCopy()

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <ToolTextField
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          onBlur={() => applyHex()}
          className="min-w-0 flex-1 font-mono"
        />
        <div className="h-10 w-14 shrink-0 rounded border border-border" style={{ backgroundColor: swatch }} />
      </div>
      <ToolTextField label="RGB" type="text" value={rgb} onChange={(e) => setRgb(e.target.value)} onBlur={() => applyRgb()} className="font-mono" />
      <ToolTextField label="HSL" type="text" value={hsl} readOnly className="bg-muted font-mono" />
      <div className="flex flex-wrap gap-2">
        <ToolButton onClick={() => applyHex()}>HEX → RGB/HSL</ToolButton>
        <ToolButton variant="outline" onClick={() => copy(hex)}>
          Copy HEX
        </ToolButton>
      </div>
    </div>
  )
}
