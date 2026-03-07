/**
 * Number Base - Binary, hex, decimal
 */
import { useState, useCallback } from "react"
import { ToolCard, copyToClipboard } from "./ToolCard"

export function NumberBaseTool() {
  const [input, setInput] = useState("")
  const [fromBase, setFromBase] = useState<"dec" | "hex" | "bin">("dec")
  const [output, setOutput] = useState<Record<string, string>>({})
  const [error, setError] = useState<string | null>(null)

  const convert = useCallback(() => {
    setError(null)
    setOutput({})
    const trimmed = input.trim()
    if (!trimmed) return
    let num: number
    try {
      if (fromBase === "dec") num = Number.parseInt(trimmed, 10)
      else if (fromBase === "hex") num = Number.parseInt(trimmed.replace(/^0x/, ""), 16)
      else num = Number.parseInt(trimmed.replace(/^0b/, ""), 2)
      if (Number.isNaN(num)) throw new Error("Invalid")
      setOutput({
        decimal: String(num),
        hex: "0x" + num.toString(16),
        binary: "0b" + num.toString(2),
      })
    } catch {
      setError("Số không hợp lệ")
    }
  }, [input, fromBase])

  return (
    <ToolCard
      title="Number Base"
      description="Chuyển đổi giữa binary, hex, decimal."
    >
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Số</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="255"
              className="flex-1 rounded-lg border border-border bg-card px-3 py-2 font-mono text-sm"
            />
            <select
              value={fromBase}
              onChange={(e) => setFromBase(e.target.value as "dec" | "hex" | "bin")}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="dec">Decimal</option>
              <option value="hex">Hex</option>
              <option value="bin">Binary</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={convert}
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
        >
          Convert
        </button>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {Object.keys(output).length > 0 && (
          <div>
            <div className="mb-1 flex justify-between">
              <span className="text-sm font-medium">OUTPUT</span>
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(output, null, 2))}
                className="text-xs text-primary hover:underline"
              >
                Copy
              </button>
            </div>
            <div className="space-y-2 rounded bg-muted p-3 font-mono text-sm">
              {Object.entries(output).map(([k, v]) => (
                <div key={k}>
                  {k}: {v}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolCard>
  )
}
