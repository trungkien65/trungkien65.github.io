/**
 * Khởi tạo tất cả dev tools trong DOM (vanilla). Gọi từ trang /dev-tools.
 */
import { initJwt } from "./tools/jwt"
import { initHash } from "./tools/hash"
import { initCase } from "./tools/case"
import { initJsonType } from "./tools/jsonType"
import { initUuid } from "./tools/uuid"
import { initJsonFormatter } from "./tools/jsonFormatter"
import { initJsonConvert } from "./tools/jsonConvert"
import { initBase64 } from "./tools/base64"
import { initUrl } from "./tools/url"
import { initQuery } from "./tools/query"
import { initHtml } from "./tools/html"
import { initTimestamp } from "./tools/timestamp"
import { initRelative } from "./tools/relative"
import { initRegex } from "./tools/regex"
import { initCron } from "./tools/cron"
import { initSlug } from "./tools/slug"
import { initDiff } from "./tools/diff"
import { initHeaders } from "./tools/headers"
import { initCsv } from "./tools/csv"
import { initColor } from "./tools/color"
import { initNumberBase } from "./tools/numberBase"

const REGISTRY: Record<string, (root: HTMLElement) => void> = {
  jwt: initJwt,
  hash: initHash,
  case: initCase,
  "json-type": initJsonType,
  uuid: initUuid,
  json: initJsonFormatter,
  "json-xml": (r) => initJsonConvert(r, "xml"),
  "json-csv": (r) => initJsonConvert(r, "csv"),
  "json-yaml": (r) => initJsonConvert(r, "yaml"),
  base64: initBase64,
  url: initUrl,
  query: initQuery,
  html: initHtml,
  timestamp: initTimestamp,
  relative: initRelative,
  regex: initRegex,
  cron: initCron,
  slug: initSlug,
  diff: initDiff,
  headers: initHeaders,
  csv: initCsv,
  color: initColor,
  "number-base": initNumberBase,
}

export function bootDevTools(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>("[data-dev-tool-id]").forEach((el) => {
    const id = el.getAttribute("data-dev-tool-id")
    if (id && REGISTRY[id]) REGISTRY[id](el)
  })
}
