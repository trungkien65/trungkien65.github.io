/**
 * Chuyển đổi JSON → XML / CSV / YAML (client-side, không thêm dependency)
 */

/** Ký tự hợp lệ cho tên thẻ XML */
function sanitizeXmlTag(name: string): string {
  const s = name.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^([0-9-])/, "_$1")
  return s || "item"
}

function escapeXml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

/** JSON → XML với phần tử gốc tùy chọn */
export function jsonToXml(value: unknown, rootName = "root"): string {
  const root = sanitizeXmlTag(rootName)

  function inner(name: string, v: unknown): string {
    const tag = sanitizeXmlTag(name)
    if (v === null || v === undefined) return `<${tag} />`
    if (typeof v === "boolean" || typeof v === "number") return `<${tag}>${v}</${tag}>`
    if (typeof v === "string") return `<${tag}>${escapeXml(v)}</${tag}>`
    if (Array.isArray(v)) {
      return v.map((item) => inner("item", item)).join("")
    }
    if (typeof v === "object") {
      const o = v as Record<string, unknown>
      return `<${tag}>${Object.entries(o)
        .map(([k, val]) => inner(k, val))
        .join("")}</${tag}>`
    }
    return ""
  }

  // Mảng gốc: bọc trong <root> để XML hợp lệ
  const body = Array.isArray(value)
    ? `<${root}>${value.map((item) => inner("item", item)).join("")}</${root}>`
    : inner(root, value)
  return `<?xml version="1.0" encoding="UTF-8"?>\n${body}`
}

function escapeCsvCell(cell: string): string {
  if (/[",\n\r]/.test(cell)) return `"${cell.replace(/"/g, '""')}"`
  return cell
}

/** JSON → CSV: mảng object, mảng scalar, hoặc một object một dòng */
export function jsonToCsv(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) return ""
    const first = value[0]
    if (typeof first === "object" && first !== null && !Array.isArray(first)) {
      const rows = value as Record<string, unknown>[]
      const headers = [...new Set(rows.flatMap((r) => Object.keys(r)))]
      const headerLine = headers.map(escapeCsvCell).join(",")
      const dataLines = rows.map((row) => headers.map((h) => escapeCsvCell(String(row[h] ?? ""))).join(","))
      return [headerLine, ...dataLines].join("\n")
    }
    return (value as unknown[]).map((v) => escapeCsvCell(String(v))).join("\n")
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const o = value as Record<string, unknown>
    const headers = Object.keys(o)
    return [headers.map(escapeCsvCell).join(","), headers.map((h) => escapeCsvCell(String(o[h] ?? ""))).join(",")].join(
      "\n"
    )
  }
  throw new Error("Cần JSON object hoặc array")
}

/** Chuỗi YAML đơn giản cho key */
function yamlKey(k: string): string {
  if (/^[\w.-]+$/.test(k) && !/^(true|false|null)$/i.test(k)) return k
  return JSON.stringify(k)
}

/** JSON → YAML (subset, đủ cho dữ liệu API thông thường) */
export function jsonToYaml(value: unknown, indent = 0): string {
  const pad = "  ".repeat(indent)
  if (value === null || value === undefined) return "null"
  if (typeof value === "boolean") return value ? "true" : "false"
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "null"
  if (typeof value === "string") {
    if (value.includes("\n"))
      return `|\n${value
        .split("\n")
        .map((l) => `${pad}  ${l}`)
        .join("\n")}`
    if (/^[\w.-]+$/.test(value) && !/^(true|false|null)$/i.test(value)) return value
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    return value
      .map((item) => {
        const block = jsonToYaml(item, indent + 1)
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          const lines = block.split("\n")
          return `${pad}- ${lines[0] ?? ""}\n${lines
            .slice(1)
            .map((l) => (l ? `${pad}  ${l}` : ""))
            .join("\n")}`
        }
        const one = block.includes("\n")
        return one
          ? `${pad}-\n${block
              .split("\n")
              .map((l) => `${pad}  ${l}`)
              .join("\n")}`
          : `${pad}- ${block}`
      })
      .join("\n")
  }
  if (typeof value === "object") {
    const o = value as Record<string, unknown>
    const keys = Object.keys(o)
    if (keys.length === 0) return "{}"
    return keys
      .map((k) => {
        const v = o[k]
        const inner = jsonToYaml(v, indent + 1)
        const key = yamlKey(k)
        if (inner.includes("\n")) return `${pad}${key}:\n${inner}`
        return `${pad}${key}: ${inner}`
      })
      .join("\n")
  }
  return String(value)
}
