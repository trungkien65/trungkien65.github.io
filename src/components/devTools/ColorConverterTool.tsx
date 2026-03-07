/**
 * Color Converter - HEX, RGB, HSL
 */
import { useState, useCallback, useEffect } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace(/^#/, "").match(/^([a-f0-9]{6}|[a-f0-9]{3})$/i)
  if (!m) return null
  let h = m[1]
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  return {
    r: Number.parseInt(h.slice(0, 2), 16),
    g: Number.parseInt(h.slice(2, 4), 16),
    b: Number.parseInt(h.slice(4, 6), 16),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / d + 2) / 6
        break
      default:
        h = ((r - g) / d + 4) / 6
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function ColorConverterTool() {
  const [hex, setHex] = useState("#38bdf8")
  const [rgb, setRgb] = useState("")
  const [hsl, setHsl] = useState("")

  const fromHex = useCallback(() => {
    const rgbObj = hexToRgb(hex)
    if (rgbObj) {
      setRgb(`rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`)
      const hslObj = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b)
      setHsl(`hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`)
    }
  }, [hex])

  // Init rgb/hsl từ hex mặc định khi mount
  useEffect(() => {
    const rgbObj = hexToRgb("#38bdf8")
    if (rgbObj) {
      setRgb(`rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`)
      const hslObj = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b)
      setHsl(`hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`)
    }
  }, [])


  const fromRgb = useCallback(() => {
    const m = rgb.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
    if (m) {
      const r = Number(m[1])
      const g = Number(m[2])
      const b = Number(m[3])
      setHex(rgbToHex(r, g, b))
      const hslObj = rgbToHsl(r, g, b)
      setHsl(`hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`)
    }
  }, [rgb])

  return (
    <ToolCard
      title="Color Converter"
      description="Chuyển đổi HEX, RGB, HSL."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">HEX</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              onBlur={() => fromHex()}
              placeholder="#38bdf8"
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            />
            <div
              className="h-10 w-14 shrink-0 rounded border border-border"
              style={{ backgroundColor: /^#[0-9a-fA-F]{3,6}$/.test(hex) ? hex : "#ccc" }}
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">RGB</label>
          <input
            type="text"
            value={rgb}
            onChange={(e) => setRgb(e.target.value)}
            onBlur={fromRgb}
            placeholder="rgb(56, 189, 248)"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">HSL</label>
          <input
            type="text"
            value={hsl}
            readOnly
            className="w-full rounded-lg border border-border bg-muted px-3 py-2 font-mono text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fromHex()}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            HEX → RGB/HSL
          </button>
          <button
            type="button"
            onClick={() => copyToClipboard(hex)}
            className="rounded border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            Copy HEX
          </button>
        </div>
      </div>
    </ToolCard>
  )
}
