import { copyToClipboard } from "@/lib/devTools/clipboard"

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

export function initColor(root: HTMLElement) {
  const hexIn = root.querySelector<HTMLInputElement>("[data-dt-col-hex]")
  const rgbIn = root.querySelector<HTMLInputElement>("[data-dt-col-rgb]")
  const hslIn = root.querySelector<HTMLInputElement>("[data-dt-col-hsl]")
  const swatch = root.querySelector<HTMLElement>("[data-dt-col-swatch]")
  if (!hexIn || !rgbIn || !hslIn || !swatch) return

  const applyHex = () => {
    const rgbObj = hexToRgb(hexIn.value)
    if (rgbObj) {
      rgbIn.value = `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`
      const hsl = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b)
      hslIn.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
      swatch.style.backgroundColor = /^#[0-9a-fA-F]{3,6}$/.test(hexIn.value) ? hexIn.value : "#ccc"
    }
  }
  const applyRgb = () => {
    const m = rgbIn.value.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
    if (!m) return
    const r = Number(m[1])
    const g = Number(m[2])
    const b = Number(m[3])
    hexIn.value = rgbToHex(r, g, b)
    const hsl = rgbToHsl(r, g, b)
    hslIn.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
    swatch.style.backgroundColor = hexIn.value
  }

  applyHex()
  hexIn.addEventListener("blur", applyHex)
  rgbIn.addEventListener("blur", applyRgb)
  root.querySelector<HTMLButtonElement>("[data-dt-col-from-hex]")?.addEventListener("click", applyHex)
  root.querySelector<HTMLButtonElement>("[data-dt-col-copy]")?.addEventListener("click", () =>
    copyToClipboard(hexIn.value)
  )
}
