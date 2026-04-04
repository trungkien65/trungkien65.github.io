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

/** Nhóm dev tools (JSON converters bổ sung theo jsonformatter.org) */
export const DEV_TOOL_GROUPS: DevToolGroup[] = [
  {
    id: "data-text",
    label: "Data & Text",
    description: "JSON, chuyển đổi, Base64, URL, query, HTML",
    tools: [
      {
        id: "json",
        label: "JSON Formatter",
        href: "/dev-tools/json",
        description: "Input · thao tác · output — bố cục tương tự jsonformatter.org.",
      },
      {
        id: "json-xml",
        label: "JSON → XML",
        href: "/dev-tools/json-xml",
        description: "Chuyển JSON thành XML (phần tử gốc tùy chỉnh).",
      },
      {
        id: "json-csv",
        label: "JSON → CSV",
        href: "/dev-tools/json-csv",
        description: "Mảng object → bảng CSV; mảng scalar hoặc một object → một cột / một dòng.",
      },
      {
        id: "json-yaml",
        label: "JSON → YAML",
        href: "/dev-tools/json-yaml",
        description: "Chuyển JSON sang YAML (định dạng block đơn giản).",
      },
      { id: "base64", label: "Base64 Encode/Decode", href: "/dev-tools/base64", description: "Encode và decode Base64." },
      { id: "url", label: "URL Parser", href: "/dev-tools/url", description: "Parse URL components." },
      { id: "query", label: "Query String", href: "/dev-tools/query", description: "Parse và build query string." },
      { id: "html", label: "HTML Encode/Decode", href: "/dev-tools/html", description: "Encode và decode HTML entities." },
    ],
  },
  {
    id: "builders",
    label: "Builders",
    description: "JWT, hash, case, type, UUID",
    tools: [
      {
        id: "jwt",
        label: "JWT Decoder",
        href: "/dev-tools/jwt",
        description: "Decode header và payload của JWT. Signature chưa được verify.",
      },
      {
        id: "hash",
        label: "Hash Generator",
        href: "/dev-tools/hash",
        description: "Sinh hash từ text bằng Web Crypto API.",
      },
      { id: "case", label: "Case Converter", href: "/dev-tools/case", description: "Đổi nhanh giữa các naming convention." },
      {
        id: "json-type",
        label: "JSON to TypeScript",
        href: "/dev-tools/json-type",
        description: "Sinh type hoặc interface TypeScript từ JSON mẫu.",
      },
      { id: "uuid", label: "UUID Generator", href: "/dev-tools/uuid", description: "Tạo UUID v4 ngay trên trình duyệt." },
    ],
  },

  {
    id: "time-rules",
    label: "Time & Rules",
    description: "Timestamp, relative, regex, cron, slug",
    tools: [
      { id: "timestamp", label: "Timestamp", href: "/dev-tools/timestamp", description: "Chuyển đổi Unix timestamp và ngày." },
      { id: "relative", label: "Relative Time", href: "/dev-tools/relative", description: "Chuyển ngày thành thời gian tương đối." },
      { id: "regex", label: "Regex Tester", href: "/dev-tools/regex", description: "Test regex patterns." },
      { id: "cron", label: "Cron Parser", href: "/dev-tools/cron", description: "Parse cron expression (đơn giản)." },
      { id: "slug", label: "Slug Generator", href: "/dev-tools/slug", description: "Tạo slug từ text (URL-friendly)." },
    ],
  },
  {
    id: "inspect-convert",
    label: "Inspect & Convert",
    description: "Diff, headers, CSV, color, number base",
    tools: [
      { id: "diff", label: "Text Diff", href: "/dev-tools/diff", description: "So sánh 2 đoạn text" },
      { id: "headers", label: "HTTP Headers", href: "/dev-tools/headers", description: "Parse HTTP headers" },
      { id: "csv", label: "CSV Parser", href: "/dev-tools/csv", description: "Parse CSV sang JSON." },
      { id: "color", label: "Color Converter", href: "/dev-tools/color", description: "Chuyển đổi HEX, RGB, HSL." },
      { id: "number-base", label: "Number Base", href: "/dev-tools/number-base", description: "Chuyển đổi giữa binary, hex, decimal." },
    ],
  },
]

/** Danh sách phẳng tất cả tools (bỏ group) */
export const ALL_TOOLS = DEV_TOOL_GROUPS.flatMap((g) => g.tools)
