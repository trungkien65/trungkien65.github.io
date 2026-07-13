import { useMemo, useState } from "react"

export interface DiffLine {
  line: string
  type: "same" | "add" | "remove"
}

function simpleDiff(a: string, b: string): DiffLine[] {
  const linesA = a.split("\n")
  const linesB = b.split("\n")
  const result: DiffLine[] = []
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

export function useDiffTool() {
  const [a, setA] = useState("")
  const [b, setB] = useState("")
  const diff = useMemo(() => simpleDiff(a, b), [a, b])
  return { a, setA, b, setB, diff }
}
