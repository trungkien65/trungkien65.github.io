/**
 * Dev Tools - Export tất cả tool components
 * Map tool.id -> Component
 */
import { JwtDecoder } from "./JwtDecoder"
import { HashGenerator } from "./HashGenerator"
import { CaseConverter } from "./CaseConverter"
import { JsonToTs } from "./JsonToTs"
import { UuidGenerator } from "./UuidGenerator"
import { JsonFormatter } from "./JsonFormatter"
import { Base64Tool } from "./Base64Tool"
import { UrlParser } from "./UrlParser"
import { QueryStringTool } from "./QueryStringTool"
import { HtmlEncodeTool } from "./HtmlEncodeTool"
import { TimestampTool } from "./TimestampTool"
import { RelativeTimeTool } from "./RelativeTimeTool"
import { RegexTester } from "./RegexTester"
import { CronParserTool } from "./CronParserTool"
import { SlugGenerator } from "./SlugGenerator"
import { TextDiffTool } from "./TextDiffTool"
import { HttpHeadersTool } from "./HttpHeadersTool"
import { CsvParserTool } from "./CsvParserTool"
import { ColorConverterTool } from "./ColorConverterTool"
import { NumberBaseTool } from "./NumberBaseTool"

import type { ComponentType } from "react"

export const TOOL_COMPONENTS: Record<string, ComponentType> = {
  jwt: JwtDecoder,
  hash: HashGenerator,
  case: CaseConverter,
  "json-type": JsonToTs,
  uuid: UuidGenerator,
  json: JsonFormatter,
  base64: Base64Tool,
  url: UrlParser,
  query: QueryStringTool,
  html: HtmlEncodeTool,
  timestamp: TimestampTool,
  relative: RelativeTimeTool,
  regex: RegexTester,
  cron: CronParserTool,
  slug: SlugGenerator,
  diff: TextDiffTool,
  headers: HttpHeadersTool,
  csv: CsvParserTool,
  color: ColorConverterTool,
  "number-base": NumberBaseTool,
}
