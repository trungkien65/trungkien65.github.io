import { copyToClipboard } from "@/lib/devTools/clipboard"

function simpleDiff(a: string, b: string): { line: string; type: "same" | "add" | "remove" }[] {
  const linesA = a.split("\n")
  const linesB = b.split("\n")
  const result: { line: string; type: "same" | "add" | "remove" }[] = []
  let i = 0
  let j = 0
  while (i < linesA.length || j < linesB.length) {
    if (i < linesA.length && j < linesB.length && linesA[i] === linesB[j]) {
      result.push({ line: linesA[i], type: "same" })
      i++
      j++
    } else if (j < linesB.length && (i >= linesA.length || !linesA.slice(i).includes(linesB[j]))) {
      result.push({ line: linesB[j], type: "add" })
      j++
    } else if (i < linesA.length) {
      result.push({ line: linesA[i], type: "remove" })
      i++
    } else {
      j++
    }
  }
  return result
}

export function initDiff(root: HTMLElement) {
  const a = root.querySelector<HTMLTextAreaElement>("[data-dt-diff-a]")
  const b = root.querySelector<HTMLTextAreaElement>("[data-dt-diff-b]")
  const pre = root.querySelector<HTMLElement>("[data-dt-diff-pre]")
  const wrap = root.querySelector<HTMLElement>("[data-dt-diff-wrap]")
  if (!a || !b || !pre || !wrap) return

  const render = () => {
    const diff = simpleDiff(a.value, b.value)
    if (diff.length === 0) {
      wrap.classList.add("hidden")
      return
    }
    pre.innerHTML = ""
    for (const d of diff) {
      const div = document.createElement("div")
      const prefix = d.type === "add" ? "+" : d.type === "remove" ? "-" : " "
      div.textContent = prefix + (d.line || " ")
      div.className =
        d.type === "add"
          ? "bg-green-500/20 text-green-700 dark:text-green-400"
          : d.type === "remove"
            ? "bg-red-500/20 text-red-700 dark:text-red-400"
            : ""
      pre.appendChild(div)
    }
    wrap.classList.remove("hidden")
  }
  a.addEventListener("input", render)
  b.addEventListener("input", render)
  root.querySelector<HTMLButtonElement>("[data-dt-diff-copy]")?.addEventListener("click", () => {
    const lines = [...pre.querySelectorAll("div")].map((d) => d.textContent ?? "").join("\n")
    copyToClipboard(lines)
  })
}
