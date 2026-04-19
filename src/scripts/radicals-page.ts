/**
 * Tải GET /learning/radicals (response theo `groups`) và dựng UI từng nhóm số nét.
 */
import { apiErrorMessage } from "@/lib/api/errors"
import { showToast } from "@/lib/ui/toast"
import { type RadicalItem, fetchRadicals } from "@/lib/api/radicals"

/** Khớp `id` của `<template>` trong `radicals.astro` (markup từ RadicalCard.astro). */
const RADICAL_CARD_TEMPLATE_ID = "radical-card-tmpl"

/** Lưới dày hơn (cột nhiều, gap nhỏ) — thẻ hẹp vẫn 50/50 glyph / info. */
const gridClass =
  "list-none grid grid-cols-2 gap-2 p-0 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"

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
  setText(cardRoot.querySelector("[data-radical-badge]"), `Kangxi ${r.kangxiNumber} · ${r.strokeCount} nét`)
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
  if (!statusEl || !metaEl || !groupsRoot) return

  function showError(msg: string) {
    showToast(msg, { variant: "destructive" })
    statusEl.classList.add("hidden")
    metaEl.classList.add("hidden")
    groupsRoot.classList.add("hidden")
  }

  void (async () => {
    try {
      const data = await fetchRadicals()
      const groups = Array.isArray(data.groups) ? [...data.groups] : []
      groups.sort((a, b) => a.strokeCount - b.strokeCount)

      const totalFromGroups = groups.reduce(
        (s, g) => s + (typeof g.count === "number" ? g.count : (g.items?.length ?? 0)),
        0
      )
      const total = typeof data.count === "number" ? data.count : totalFromGroups

      statusEl.classList.add("hidden")
      metaEl.textContent =
        groups.length === 0
          ? "Không có nhóm nào trong response."
          : `${total} bộ thủ (Kangxi) · ${groups.length} nhóm theo số nét`
      metaEl.classList.remove("hidden")
      groupsRoot.classList.remove("hidden")
      groupsRoot.replaceChildren()

      if (groups.length === 0) {
        const empty = document.createElement("p")
        empty.className = "text-sm text-muted-foreground"
        empty.textContent = "Mảng groups rỗng hoặc không hợp lệ."
        groupsRoot.append(empty)
        return
      }

      for (const g of groups) {
        const items = Array.isArray(g.items) ? g.items : []
        const section = document.createElement("section")
        section.className = "scroll-mt-4 border-b border-border pb-8 last:border-b-0 last:pb-0"
        section.setAttribute("aria-labelledby", `radical-group-${g.strokeCount}`)

        const head = document.createElement("div")
        head.className = "mb-4 flex flex-wrap items-baseline justify-between gap-2"

        const title = document.createElement("h2")
        title.id = `radical-group-${g.strokeCount}`
        title.className = "text-lg font-semibold tracking-tight text-foreground"
        const n = g.strokeCount
        title.textContent = `${n} nét`

        const sub = document.createElement("span")
        sub.className = "text-sm text-muted-foreground"
        sub.textContent = `${g.count ?? items.length} bộ thủ`

        head.append(title, sub)

        const ul = document.createElement("ul")
        ul.className = gridClass
        ul.setAttribute("role", "list")

        for (const r of items) {
          ul.append(buildRadicalCard(r))
        }

        section.append(head, ul)
        groupsRoot.append(section)
      }
    } catch (e) {
      showError(apiErrorMessage(e, "Không tải được danh sách bộ thủ."))
    }
  })()
}
