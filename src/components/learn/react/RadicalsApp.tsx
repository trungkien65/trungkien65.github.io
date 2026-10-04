import React, { useState, useEffect, useMemo } from "react"
import { type RadicalItem, type RadicalsGroup, fetchRadicals } from "@/lib/api/radicals"
import { apiErrorMessage } from "@/lib/api/errors"
import { showToast } from "@/lib/ui/toast"
import { AudioButton, Badge, Chip } from "@/components/ui/react"

export function RadicalsApp() {
  const [groups, setGroups] = useState<RadicalsGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStroke, setSelectedStroke] = useState<number | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const data = await fetchRadicals()
        if (mounted) {
          const sorted = Array.isArray(data.groups) ? [...data.groups] : []
          sorted.sort((a, b) => a.strokeCount - b.strokeCount)
          setGroups(sorted)
        }
      } catch (err) {
        if (mounted) {
          showToast(apiErrorMessage(err, "Không tải được danh sách bộ thủ"), {
            variant: "destructive",
          })
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    void load()
    return () => {
      mounted = false
    }
  }, [])

  const filteredGroups = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return groups
      .filter((g) => {
        if (selectedStroke !== null && g.strokeCount !== selectedStroke) {
          return false
        }
        return true
      })
      .map((g) => {
        const items = Array.isArray(g.items) ? g.items : []
        if (!q) return g

        const filteredItems = items.filter((r) => {
          return (
            r.glyph.toLowerCase().includes(q) ||
            r.pinyin.toLowerCase().includes(q) ||
            r.nameVi.toLowerCase().includes(q) ||
            r.english.toLowerCase().includes(q) ||
            String(r.kangxiNumber) === q
          )
        })

        return {
          ...g,
          items: filteredItems,
        }
      })
      .filter((g) => g.items.length > 0)
  }, [groups, searchQuery, selectedStroke])

  const totalVisibleItems = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.items.length, 0)
  }, [filteredGroups])

  const availableStrokes = useMemo(() => {
    return groups.map((g) => g.strokeCount)
  }, [groups])

  const copyGlyph = (glyph: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(glyph)
      showToast(`Đã sao chép bộ thủ "${glyph}" vào clipboard!`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo chữ Hán, Pinyin, nghĩa tiếng Việt, số nét..."
              className="flex h-11 w-full rounded-2xl border border-border bg-card pl-10 pr-9 text-sm text-foreground shadow-sm placeholder:text-muted-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                aria-label="Xóa tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Results count badge */}
          <div className="text-xs font-semibold text-muted-foreground sm:ml-auto">
            {loading
              ? "Đang tải dữ liệu..."
              : `${totalVisibleItems} bộ thủ · ${filteredGroups.length} nhóm nét`}
          </div>
        </div>

        {/* Stroke Filter Chips */}
        {availableStrokes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-xs font-semibold text-muted-foreground mr-1">Số nét:</span>
            <Chip
              active={selectedStroke === null}
              onClick={() => setSelectedStroke(null)}
            >
              Tất cả
            </Chip>
            {availableStrokes.map((stroke) => (
              <Chip
                key={stroke}
                active={selectedStroke === stroke}
                onClick={() =>
                  setSelectedStroke((prev) => (prev === stroke ? null : stroke))
                }
              >
                {stroke}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
          <svg className="h-8 w-8 animate-spin text-primary mb-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm font-medium text-muted-foreground">
            Đang tải 214 Bộ thủ Khang Hy...
          </p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredGroups.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground space-y-3">
          <span className="text-4xl">🔍</span>
          <p className="text-base font-semibold text-foreground">Không tìm thấy bộ thủ phù hợp</p>
          <p className="text-sm">
            Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn bộ lọc số nét.
          </p>
          {(searchQuery || selectedStroke !== null) && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("")
                setSelectedStroke(null)
              }}
              className="mt-2 text-xs font-semibold text-primary underline"
            >
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Radicals Groups */}
      {!loading && (
        <div className="space-y-10">
          {filteredGroups.map((group) => (
            <section
              key={group.strokeCount}
              className="border-b border-border/50 pb-8 last:border-b-0 last:pb-0"
              aria-labelledby={`radical-group-${group.strokeCount}`}
            >
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-border/30 pb-2">
                <h2
                  id={`radical-group-${group.strokeCount}`}
                  className="text-base font-bold tracking-tight text-foreground flex items-center gap-2"
                >
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  {group.strokeCount} nét
                </h2>
                <Badge variant="muted">{group.items.length} bộ thủ</Badge>
              </div>

              <ul
                role="list"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 list-none p-0"
              >
                {group.items.map((r: RadicalItem) => (
                  <li
                    key={r.kangxiNumber}
                    className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md"
                  >
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-2">
                      <span className="font-bold text-primary">#{r.kangxiNumber}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AudioButton text={r.glyph} size="sm" title={`Phát âm ${r.glyph}`} />
                        <button
                          type="button"
                          onClick={() => copyGlyph(r.glyph)}
                          className="p-1 hover:text-primary rounded text-muted-foreground"
                          title="Sao chép"
                          aria-label={`Sao chép ${r.glyph}`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="my-2 text-center">
                      <span className="text-4xl sm:text-5xl font-bold font-serif text-foreground group-hover:text-primary transition-colors">
                        {r.glyph}
                      </span>
                      {r.pinyin && (
                        <p className="mt-1 text-xs font-semibold text-primary tracking-wide">
                          {r.pinyin}
                        </p>
                      )}
                    </div>

                    <div className="border-t border-border/40 pt-2 text-center space-y-0.5">
                      <p className="text-xs font-bold text-foreground truncate" title={r.nameVi}>
                        {r.nameVi}
                      </p>
                      {r.english && (
                        <p
                          className="text-[11px] text-muted-foreground truncate italic"
                          title={r.english}
                        >
                          {r.english}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
