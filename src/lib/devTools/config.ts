export interface DevTool {
  id: string
  label: string
  href: string
  description?: string
}

export interface DevToolGroup {
  id: string
  label: string
  description: string
  tools: DevTool[]
}

/** 4 nhóm chính với 20 tools */
export const DEV_TOOL_GROUPS: DevToolGroup[] = [
  {
    id: "builders",
    label: "Builders",
    description: "JWT, hash, case, type, UUID",
    tools: [
      { id: "jwt", label: "JWT Decoder", href: "/dev-tools/jwt", description: "Decode JWT header & payload" },
      { id: "hash", label: "Hash Generator", href: "/dev-tools/hash", description: "SHA-1, SHA-256, SHA-384, SHA-512" },
      { id: "case", label: "Case Converter", href: "/dev-tools/case", description: "camelCase, snake_case, kebab-case..." },
      { id: "json-type", label: "JSON to TypeScript", href: "/dev-tools/json-type", description: "Sinh type TS từ JSON" },
      { id: "uuid", label: "UUID Generator", href: "/dev-tools/uuid", description: "Tạo UUID v4" },
    ],
  },
  {
    id: "data-text",
    label: "Data & Text",
    description: "JSON, Base64, URL, query, HTML",
    tools: [
      { id: "json", label: "JSON Formatter", href: "/dev-tools/json", description: "Format & validate JSON" },
      { id: "base64", label: "Base64 Encode/Decode", href: "/dev-tools/base64", description: "Encode/Decode Base64" },
      { id: "url", label: "URL Parser", href: "/dev-tools/url", description: "Parse URL components" },
      { id: "query", label: "Query String", href: "/dev-tools/query", description: "Parse & build query string" },
      { id: "html", label: "HTML Encode/Decode", href: "/dev-tools/html", description: "HTML entities" },
    ],
  },
  {
    id: "time-rules",
    label: "Time & Rules",
    description: "Timestamp, relative, regex, cron, slug",
    tools: [
      { id: "timestamp", label: "Timestamp", href: "/dev-tools/timestamp", description: "Unix timestamp converter" },
      { id: "relative", label: "Relative Time", href: "/dev-tools/relative", description: "Relative time format" },
      { id: "regex", label: "Regex Tester", href: "/dev-tools/regex", description: "Test regex patterns" },
      { id: "cron", label: "Cron Parser", href: "/dev-tools/cron", description: "Parse cron expression" },
      { id: "slug", label: "Slug Generator", href: "/dev-tools/slug", description: "Tạo slug từ text" },
    ],
  },
  {
    id: "inspect-convert",
    label: "Inspect & Convert",
    description: "Diff, headers, CSV, color, number base",
    tools: [
      { id: "diff", label: "Text Diff", href: "/dev-tools/diff", description: "So sánh 2 đoạn text" },
      { id: "headers", label: "HTTP Headers", href: "/dev-tools/headers", description: "Parse HTTP headers" },
      { id: "csv", label: "CSV Parser", href: "/dev-tools/csv", description: "Parse CSV to JSON" },
      { id: "color", label: "Color Converter", href: "/dev-tools/color", description: "HEX, RGB, HSL converter" },
      { id: "number-base", label: "Number Base", href: "/dev-tools/number-base", description: "Binary, hex, decimal" },
    ],
  },
]

/** Danh sách phẳng tất cả tools (bỏ group) */
export const ALL_TOOLS = DEV_TOOL_GROUPS.flatMap((g) => g.tools)
