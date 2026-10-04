/**
 * Tải GET /learning/radicals (response theo `groups`) và dựng UI từng nhóm số nét kèm tìm kiếm tức thì.
 */
import { apiErrorMessage } from "@/lib/api/errors"
import { showToast } from "@/lib/ui/toast"
import { type RadicalItem, type RadicalsGroup, fetchRadicals } from "@/lib/api/radicals"

/** Khớp `id` của `<template>` trong `radicals.astro` (markup từ RadicalCard.astro). */
const RADICAL_CARD_TEMPLATE_ID = "radical-card-tmpl"

/** Lưới thẻ bộ thủ responsive */
const gridClass =
  "list-none grid grid-cols-2 gap-3 p-0 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"

function setText(el: Element | null, text: string) {
  if (el) el.textContent = text
}

/** Clone markup từ RadicalCard.astro (template) và điền dữ liệu. */
function buildRadicalCard(r: RadicalItem): HTMLLIElement {
  const li = document.createElement("li")
  li.className = "!list-none"
  li.setAttribute("role", "listitem")

  const tmpl = document.getElementById(RADICAL_CARD_TEMPLATE_ID) as HTMLTemplateElement | null
  if (!tmpl?.content) {
    console.error(`Thiếu template #${RADICAL_CARD_TEMPLATE_ID}`)
    return li
  }

  const frag = tmpl.content.cloneNode(true) as DocumentFragment
  const cardRoot = frag.querySelector<HTMLElement>("[data-radical-card]")
  if (!cardRoot) {
    console.error("Template thẻ bộ thủ không có [data-radical-card]")
    return li
  }

  cardRoot.setAttribute("aria-label", `Bộ thủ số ${r.kangxiNumber}, ${r.nameVi}`)
  setText(cardRoot.querySelector("[data-radical-glyph]"), r.glyph)
  setText(cardRoot.querySelector("[data-radical-badge]"), `#${r.kangxiNumber} · ${r.strokeCount} nét`)
  setText(cardRoot.querySelector("[data-radical-name-vi]"), r.nameVi)
  setText(cardRoot.querySelector("[data-radical-pinyin]"), r.pinyin)
  setText(cardRoot.querySelector("[data-radical-english]"), r.english)

  li.append(cardRoot)
  return li
}

export function initRadicalsPage(root: HTMLElement) {
  const statusEl = root.querySelector<HTMLElement>("[data-radicals-status]")
  const metaEl = root.querySelector<HTMLElement>("[data-radicals-meta]")
  const groupsRoot = root.querySelector<HTMLElement>("[data-radicals-groups]")
  const searchInput = root.querySelector<HTMLInputElement>("[data-radicals-search]")
  if (!statusEl || !metaEl || !groupsRoot) return

  let allGroups: RadicalsGroup[] = []

  function showError(msg: string) {
    showToast(msg, { variant: "destructive" })
    statusEl?.classList.add("hidden")
    metaEl?.classList.add("hidden")
    groupsRoot?.classList.add("hidden")
  }

  function renderGroups(query: string = "") {
    if (!groupsRoot) return
    groupsRoot.replaceChildren()
    const q = query.trim().toLowerCase()

    let visibleCount = 0

    for (const g of allGroups) {
      const items = Array.isArray(g.items) ? g.items : []
      const filtered = q
        ? items.filter(
            (r) =>
              r.glyph.toLowerCase().includes(q) ||
              r.pinyin.toLowerCase().includes(q) ||
              r.nameVi.toLowerCase().includes(q) ||
              r.english.toLowerCase().includes(q) ||
              String(r.kangxiNumber) === q
          )
        : items

      if (filtered.length === 0) continue

      visibleCount += filtered.length

      const section = document.createElement("section")
      section.className = "scroll-mt-4 border-b border-border/60 pb-8 last:border-b-0 last:pb-0"
      section.setAttribute("aria-labelledby", `radical-group-${g.strokeCount}`)

      const head = document.createElement("div")
      head.className = "mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-border/30 pb-2"

      const title = document.createElement("h2")
      title.id = `radical-group-${g.strokeCount}`
      title.className = "text-base font-bold tracking-tight text-foreground flex items-center gap-2"
      title.innerHTML = `<span class="h-2 w-2 rounded-full bg-primary"></span>${g.strokeCount} nét`

      const sub = document.createElement("span")
      sub.className = "text-xs font-semibold text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full"
      sub.textContent = `${filtered.length} bộ thủ`

      head.append(title, sub)

      const ul = document.createElement("ul")
      ul.className = gridClass
      ul.setAttribute("role", "list")

      for (const r of filtered) {
        ul.append(buildRadicalCard(r))
      }

      section.append(head, ul)
      groupsRoot.append(section)
    }

    if (visibleCount === 0) {
      const empty = document.createElement("div")
      empty.className = "rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground"
      empty.textContent = q ? `Không tìm thấy bộ thủ nào phù hợp với từ khóa "${query}".` : "Không có dữ liệu bộ thủ."
      groupsRoot.append(empty)
    }

    if (metaEl) {
      metaEl.textContent = q ? `Tìm thấy ${visibleCount} kết quả` : `${visibleCount} bộ thủ (Kangxi) · ${allGroups.length} nhóm nét`
    }
  }

  searchInput?.addEventListener("input", (e) => {
    const val = (e.target as HTMLInputElement).value
    renderGroups(val)
  })

  void (async () => {
    try {
      const data = await fetchRadicals()
      const groups = Array.isArray(data.groups) ? [...data.groups] : []
      groups.sort((a, b) => a.strokeCount - b.strokeCount)
      allGroups = groups

      statusEl.classList.add("hidden")
      metaEl.classList.remove("hidden")
      groupsRoot.classList.remove("hidden")

      renderGroups()
    } catch (e) {
      showError(apiErrorMessage(e, "Không tải được danh sách bộ thủ."))
    }
  })()
}
