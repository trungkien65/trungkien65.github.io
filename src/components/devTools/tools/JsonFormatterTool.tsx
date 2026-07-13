import { useMemo, useRef, useState } from "react"
import { useJsonFormatterTool } from "@/lib/devTools/hooks/useJsonFormatterTool"
import { cn } from "@/lib/utils"
import { type JsonValue, JsonTreeView } from "./JsonTreeView"

const btnMid = "w-full rounded border-2 py-2.5 text-center text-[11px] font-bold uppercase tracking-wide transition active:scale-[0.98]"
const btnMidSm =
  "w-full rounded border py-1.5 text-center text-[9px] font-bold uppercase leading-tight tracking-wide text-[#148f77] shadow transition hover:bg-zinc-50 active:scale-[0.98] dark:text-teal-900"
const editorWrap =
  "flex min-h-[min(80vh,800px)] min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-zinc-700/80 shadow-md ring-1 ring-black/10 dark:ring-white/10"
const editorChrome = "flex items-center justify-between gap-1 border-b border-zinc-700 bg-zinc-800 px-2 py-1.5 text-zinc-300"
const editorTextarea =
  "min-h-[200px] w-full flex-1 resize-y border-0 px-3 py-2 font-mono text-sm text-zinc-900 outline-none focus:ring-0 dark:bg-zinc-950 dark:text-zinc-100 lg:min-h-[400px]"
const toolbarIconBtn = "rounded p-1 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
const viewToggleBtn = "px-2 py-0.5 text-[10px] font-medium"

export default function JsonFormatterTool() {
  const {
    input,
    setInput,
    output,
    indent,
    setIndent,
    loadSample,
    loadFile,
    validate,
    format,
    beautify,
    minify,
    download,
    copyOutput,
  } = useJsonFormatterTool()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [outputView, setOutputView] = useState<"text" | "tree">("tree")

  const treeData = useMemo<JsonValue | undefined>(() => {
    if (!output) return undefined
    try {
      const parsed = JSON.parse(output) as JsonValue
      return parsed !== null && typeof parsed === "object" ? parsed : undefined
    } catch {
      return undefined
    }
  }, [output])

  const showTree = outputView === "tree" && treeData !== undefined

  return (
    <div className="space-y-3 dark:bg-teal-950">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,application/json,text/plain"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) loadFile(file)
          e.target.value = ""
        }}
      />
      <div className="grid min-h-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_9.5rem_minmax(0,1fr)] lg:items-stretch">
        <div className={editorWrap}>
          <div className={editorChrome}>
            <span className="text-[10px] font-semibold uppercase">Input</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded border border-zinc-600 bg-zinc-700/80 px-2 py-0.5 text-[10px] font-medium text-zinc-200 hover:bg-zinc-600"
                onClick={loadSample}
              >
                Sample
              </button>
              <button type="button" className={toolbarIconBtn} title="Tải file" onClick={() => fileInputRef.current?.click()}>
                📁
              </button>
            </div>
          </div>
          <textarea
            className={editorTextarea}
            spellCheck={false}
            placeholder='{"key": "value"}'
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="flex flex-col justify-start gap-2 lg:min-w-[9.5rem] lg:max-w-[9.5rem] lg:justify-center lg:py-2">
          <button type="button" className={btnMid} onClick={() => fileInputRef.current?.click()}>
            Upload
          </button>
          <button type="button" className={btnMid} onClick={validate}>
            Validate
          </button>
          <label className="block">
            <span className="mb-1 block text-center text-[10px] font-bold uppercase">Indent</span>
            <select
              className="w-full cursor-pointer rounded border-2 py-2 pl-2 pr-8 text-[11px] font-semibold backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/50 dark:bg-black/20"
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
            >
              {[2, 3, 4].map((n) => (
                <option key={n} value={n} className="text-zinc-900">
                  {n} spaces
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button type="button" className={btnMidSm} onClick={format}>
              Format
            </button>
            <button type="button" className={btnMidSm} onClick={beautify}>
              Beautify
            </button>
          </div>
          <button type="button" className={btnMid} onClick={minify}>
            Minify
          </button>
          <button type="button" className={btnMid} onClick={download}>
            Download
          </button>
        </div>

        <div className={editorWrap}>
          <div className={editorChrome}>
            <span className="text-[10px] font-semibold uppercase">Output</span>
            <div className="flex items-center gap-1">
              {treeData !== undefined && (
                <div className="flex overflow-hidden rounded border border-zinc-600">
                  <button
                    type="button"
                    onClick={() => setOutputView("text")}
                    className={cn(viewToggleBtn, outputView === "text" ? "bg-zinc-600 text-zinc-100" : "bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600")}
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => setOutputView("tree")}
                    className={cn(viewToggleBtn, outputView === "tree" ? "bg-zinc-600 text-zinc-100" : "bg-zinc-700/80 text-zinc-300 hover:bg-zinc-600")}
                  >
                    Tree
                  </button>
                </div>
              )}
              <button type="button" className={toolbarIconBtn} title="Copy" onClick={copyOutput}>
                ⎘
              </button>
            </div>
          </div>
          {showTree ? (
            <div className={cn(editorTextarea, "overflow-auto")}>
              <JsonTreeView data={treeData as JsonValue} />
            </div>
          ) : (
            <textarea
              className={editorTextarea}
              spellCheck={false}
              readOnly
              placeholder="Kết quả sau khi Format hoặc Minify…"
              value={output}
            />
          )}
        </div>
      </div>
    </div>
  )
}
