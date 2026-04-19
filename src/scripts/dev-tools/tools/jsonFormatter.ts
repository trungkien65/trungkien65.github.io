import { copyToClipboard } from "@/lib/devTools/clipboard"
import { showToast } from "@/lib/ui/toast"

const SAMPLE = `{
  "name": "demo",
  "tags": ["json", "formatter"],
  "active": true,
  "count": 42
}`

const btnMid =
  "w-full rounded border-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-wide transition active:scale-[0.98]"
const btnMidSm =
  "w-full rounded border py-1.5 text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-[#148f77] shadow transition hover:bg-zinc-50 active:scale-[0.98] dark:text-teal-900"

export function initJsonFormatter(root: HTMLElement) {
  root.className = "space-y-3 dark:bg-teal-950"

  const fileInp = document.createElement("input")
  fileInp.type = "file"
  fileInp.accept = ".json,.txt,application/json,text/plain"
  fileInp.className = "hidden"
  root.appendChild(fileInp)

  const grid = document.createElement("div")
  grid.className =
    "grid min-h-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_9.5rem_minmax(0,1fr)] lg:items-stretch"

  const mkEditor = (label: string, ro: boolean) => {
    const wrap = document.createElement("div")
    wrap.className =
      "flex min-h-[min(80vh,800px)] min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-700/80 shadow-md ring-1 ring-black/10 dark:ring-white/10"
    const chrome = document.createElement("div")
    chrome.className =
      "flex items-center justify-between gap-1 border-b border-zinc-700 bg-zinc-800 px-2 py-1.5 text-zinc-300"
    const lab = document.createElement("span")
    lab.className = "text-[10px] font-semibold uppercase"
    lab.textContent = label
    chrome.appendChild(lab)
    const ta = document.createElement("textarea")
    ta.className =
      "min-h-[200px] w-full flex-1 resize-y border-0 px-3 py-2 font-mono text-sm text-zinc-900 outline-none focus:ring-0 dark:bg-zinc-950 dark:text-zinc-100 lg:min-h-[400px]"
    ta.spellcheck = false
    ta.readOnly = ro
    wrap.appendChild(chrome)
    wrap.appendChild(ta)
    return { wrap, ta, chrome }
  }

  const left = mkEditor("Input", false)
  const right = mkEditor("Output", true)
  right.ta.placeholder = "Kết quả sau khi Format hoặc Minify…"

  const mid = document.createElement("div")
  mid.className =
    "flex flex-col justify-start gap-2 lg:min-w-[9.5rem] lg:max-w-[9.5rem] lg:justify-center lg:py-2"

  const mkBtn = (text: string, cls: string, fn: () => void) => {
    const b = document.createElement("button")
    b.type = "button"
    b.className = cls
    b.textContent = text
    b.addEventListener("click", fn)
    return b
  }

  let indent = 2
  const indentSel = document.createElement("select")
  indentSel.className =
    "w-full cursor-pointer rounded border-2 py-2 pl-2 pr-8 text-[11px] font-semibold backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-black/20"
    ;[2, 3, 4].forEach((n) => {
      const o = document.createElement("option")
      o.value = String(n)
      o.textContent = `${n} spaces`
      o.className = "text-zinc-900"
      indentSel.appendChild(o)
    })
  indentSel.addEventListener("change", () => (indent = Number(indentSel.value) as 2 | 3 | 4))

  const parseJson = (s: string) => {
    const t = s.trim()
    if (!t) return { ok: false as const, err: "Chưa có JSON" }
    try {
      return { ok: true as const, data: JSON.parse(t) as unknown }
    } catch (e) {
      return { ok: false as const, err: e instanceof Error ? e.message : "Lỗi parse" }
    }
  }

  let debounceId: ReturnType<typeof setTimeout> | null = null
  left.ta.addEventListener("input", () => {
    if (debounceId) clearTimeout(debounceId)
    debounceId = setTimeout(() => {
      debounceId = null
      const trimmed = left.ta.value.trim()
      if (!trimmed) {
        right.ta.value = ""
        return
      }
      try {
        const data = JSON.parse(trimmed) as unknown
        right.ta.value = JSON.stringify(data, null, indent)
      } catch {
        /* typing */
      }
    }, 320)
  })

  fileInp.addEventListener("change", () => {
    const f = fileInp.files?.[0]
    if (!f) return
    const r = new FileReader()
    r.onload = () => {
      left.ta.value = typeof r.result === "string" ? r.result : ""
    }
    r.readAsText(f)
    fileInp.value = ""
  })

  mid.appendChild(mkBtn("Upload", btnMid, () => fileInp.click()))
  mid.appendChild(
    mkBtn("Validate", btnMid, () => {
      const r = parseJson(left.ta.value)
      if (!r.ok) {
        showToast(`Không hợp lệ: ${r.err}`, { variant: "destructive" })
        return
      }
      showToast("JSON hợp lệ.", { variant: "success" })
    })
  )
  const indentLabel = document.createElement("label")
  indentLabel.className = "block"
  indentLabel.innerHTML =
    '<span class="mb-1 block text-center text-[10px] font-bold uppercase">Indent</span>'
  indentLabel.appendChild(indentSel)
  mid.appendChild(indentLabel)

  const row = document.createElement("div")
  row.className = "grid grid-cols-2 gap-1.5"
  row.appendChild(
    mkBtn("Format", btnMidSm, () => {
      const r = parseJson(left.ta.value)
      if (!r.ok) {
        showToast(`JSON không hợp lệ: ${r.err}`, { variant: "destructive" })
        right.ta.value = ""
        return
      }
      right.ta.value = JSON.stringify(r.data, null, indent)
    })
  )
  row.appendChild(
    mkBtn("Beautify", btnMidSm, () => {
      const r = parseJson(left.ta.value)
      if (!r.ok) {
        showToast(`JSON không hợp lệ: ${r.err}`, { variant: "destructive" })
        return
      }
      const pretty = JSON.stringify(r.data, null, indent)
      left.ta.value = pretty
      right.ta.value = pretty
    })
  )
  mid.appendChild(row)
  mid.appendChild(mkBtn("Minify", btnMid, () => {
    const r = parseJson(left.ta.value)
    if (!r.ok) {
      showToast("JSON không hợp lệ", { variant: "destructive" })
      right.ta.value = ""
      return
    }
    right.ta.value = JSON.stringify(r.data)
  }))
  mid.appendChild(
    mkBtn("Download", btnMid, () => {
      if (!right.ta.value) return
      const blob = new Blob([right.ta.value], { type: "application/json;charset=utf-8" })
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "formatted.json"
      a.click()
      URL.revokeObjectURL(a.href)
    })
  )

  left.ta.placeholder = '{"key": "value"}'
  left.ta.value = ""
  const toolbarR = document.createElement("div")
  toolbarR.className = "flex items-center gap-1"
  const sampleBtn = document.createElement("button")
  sampleBtn.type = "button"
  sampleBtn.className =
    "rounded border border-zinc-600 bg-zinc-700/80 px-2 py-0.5 text-[10px] font-medium text-zinc-200 hover:bg-zinc-600"
  sampleBtn.textContent = "Sample"
  sampleBtn.addEventListener("click", () => {
    left.ta.value = SAMPLE
    left.ta.dispatchEvent(new Event("input"))
  })
  const fileBtn = document.createElement("button")
  fileBtn.type = "button"
  fileBtn.className = "rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
  fileBtn.title = "Tải file"
  fileBtn.textContent = "📁"
  fileBtn.addEventListener("click", () => fileInp.click())
  toolbarR.appendChild(sampleBtn)
  toolbarR.appendChild(fileBtn)
  left.chrome.appendChild(toolbarR)

  const copyBtn = document.createElement("button")
  copyBtn.type = "button"
  copyBtn.className = "rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
  copyBtn.title = "Copy"
  copyBtn.textContent = "⎘"
  copyBtn.addEventListener("click", () => copyToClipboard(right.ta.value))
  const rt = document.createElement("div")
  rt.className = "flex items-center gap-1"
  rt.appendChild(copyBtn)
  right.chrome.appendChild(rt)

  grid.appendChild(left.wrap)
  grid.appendChild(mid)
  grid.appendChild(right.wrap)
  root.appendChild(grid)
}
