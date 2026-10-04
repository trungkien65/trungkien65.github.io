/**
 * Logic điều khiển Flashcard 3D, Quiz tương tác và luồng Ôn tập SM-2.
 */
import type { LearningWord, ReviewDueItem } from "@/lib/api/learning"
import { fetchLearningWords, fetchReviewDue, learningApiErrorMessage, postLearningReview } from "@/lib/api/learning"
import { showToast } from "@/lib/ui/toast"

type QuizChoice = { definition: string; correct: boolean }

type QuizState = {
  term: string
  choices: QuizChoice[]
}

const DEFAULT_WORDS_LIMIT = 50

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

function pickQuizQuestion(words: LearningWord[]): QuizState | null {
  if (words.length < 4) return null
  const idx = Math.floor(Math.random() * words.length)
  const target = words[idx]
  const others = words.filter((_, i) => i !== idx)
  shuffleInPlace(others)
  const distractors = others.slice(0, 3).map((w) => ({ definition: w.definition, correct: false }))
  const choices: QuizChoice[] = [{ definition: target.definition, correct: true }, ...distractors]
  shuffleInPlace(choices)
  return { term: target.term, choices }
}

function speakChinese(text: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "zh-CN"
  utterance.rate = 0.85
  window.speechSynthesis.speak(utterance)
}

function formatReviewMeta(item: ReviewDueItem): string {
  const r = item.review
  if (!r) return "Mới (Chưa ôn lần nào)"
  const next = r.nextReviewAt ? new Date(r.nextReviewAt).toLocaleDateString() : "Hôm nay"
  return `Lần ôn: ${r.repetitions} · Cách nhau: ${r.intervalDays} ngày · Hẹn: ${next}`
}

export function initVocabLearn(root: HTMLElement) {
  const flash = root.querySelector("[data-learn-flashcard]")
  const quiz = root.querySelector("[data-learn-quiz]")
  const review = root.querySelector("[data-learn-review]")
  if (!flash || !quiz || !review) return

  // --- Flashcard DOM ---
  const flashTerm = flash.querySelector<HTMLElement>("[data-flash-term]")!
  const flashDef = flash.querySelector<HTMLElement>("[data-flash-definition]")!
  const flashInner = flash.querySelector<HTMLElement>("[data-flash-card-inner]")
  const flashCardContainer = flash.querySelector<HTMLElement>("[data-flash-card-container]")
  const flashFlip = flash.querySelector<HTMLButtonElement>("[data-flash-flip]")!
  const flashPrev = flash.querySelector<HTMLButtonElement>("[data-flash-prev]")!
  const flashNext = flash.querySelector<HTMLButtonElement>("[data-flash-next]")!
  const flashProgress = flash.querySelector<HTMLElement>("[data-flash-progress]")!
  const flashProgressBar = flash.querySelector<HTMLElement>("[data-flash-progress-bar]")
  const flashSpeak = flash.querySelector<HTMLButtonElement>("[data-flash-speak]")
  const flashSpeakBack = flash.querySelector<HTMLButtonElement>("[data-flash-speak-back]")

  // --- Quiz DOM ---
  const quizTerm = quiz.querySelector<HTMLElement>("[data-quiz-term]")!
  const quizOptions = quiz.querySelector<HTMLElement>("[data-quiz-options]")!
  const quizFeedback = quiz.querySelector<HTMLElement>("[data-quiz-feedback]")!
  const quizNext = quiz.querySelector<HTMLButtonElement>("[data-quiz-next]")!
  const quizProgress = quiz.querySelector<HTMLElement>("[data-quiz-progress]")!
  const quizStreak = quiz.querySelector<HTMLElement>("[data-quiz-streak]")
  const quizStreakCount = quiz.querySelector<HTMLElement>("[data-quiz-streak-count]")
  const quizSpeak = quiz.querySelector<HTMLButtonElement>("[data-quiz-speak]")

  // --- Review DOM ---
  const reviewTerm = review.querySelector<HTMLElement>("[data-review-term]")!
  const reviewMeta = review.querySelector<HTMLElement>("[data-review-meta]")!
  const reviewProgress = review.querySelector<HTMLElement>("[data-review-progress]")!
  const reviewDone = review.querySelector<HTMLElement>("[data-review-done]")!
  const reviewSpeak = review.querySelector<HTMLButtonElement>("[data-review-speak]")
  const reviewRevealBtn = review.querySelector<HTMLButtonElement>("[data-review-reveal-btn]")
  const reviewRevealContainer = review.querySelector<HTMLElement>("[data-review-reveal-container]")
  const reviewAnswer = review.querySelector<HTMLElement>("[data-review-answer]")
  const reviewDefinition = review.querySelector<HTMLElement>("[data-review-definition]")

  // --- Pagination DOM ---
  const pagePrev = root.querySelector<HTMLButtonElement>("[data-vocab-page-prev]")!
  const pageNext = root.querySelector<HTMLButtonElement>("[data-vocab-page-next]")!
  const pageLabel = root.querySelector<HTMLElement>("[data-vocab-page-label]")!

  let words: LearningWord[] = []
  let wordsLimit = DEFAULT_WORDS_LIMIT
  let wordsOffset = 0
  let hasNextWordsPage = false
  let loadingWords = false
  let flashIndex = 0
  let flashFlipped = false

  let quizState: QuizState | null = null
  let quizAnswered = false
  let quizRound = 0
  let streak = 0

  let reviewItems: ReviewDueItem[] = []
  let reviewIndex = 0
  let reviewBusy = false

  function showFlashError(msg: string) {
    showToast(msg, { variant: "destructive" })
  }

  function showQuizError(msg: string) {
    showToast(msg, { variant: "destructive" })
  }

  function showReviewError(msg: string) {
    showToast(msg, { variant: "destructive" })
  }

  function renderPagination() {
    const page = Math.floor(wordsOffset / wordsLimit) + 1
    pageLabel.textContent = loadingWords ? `Đang tải trang ${page}...` : `Trang ${page} · ${words.length} từ`
    pagePrev.disabled = loadingWords || wordsOffset <= 0
    pageNext.disabled = loadingWords || !hasNextWordsPage
  }

  function setFlashFlipped(f: boolean) {
    flashFlipped = f
    if (flashInner) {
      flashInner.classList.toggle("rotate-y-180", f)
    }
    flashFlip.textContent = f ? "Xem Hán tự" : "Lật thẻ"
  }

  function renderFlashcard() {
    if (words.length === 0) {
      flashTerm.textContent = "—"
      flashDef.textContent = "Chưa có từ vựng nào"
      flashProgress.textContent = "0 / 0"
      if (flashProgressBar) flashProgressBar.style.width = "0%"
      flashFlip.disabled = true
      flashPrev.disabled = true
      flashNext.disabled = true
      return
    }

    flashFlip.disabled = false
    flashPrev.disabled = flashIndex <= 0
    flashNext.disabled = flashIndex >= words.length - 1
    const w = words[flashIndex]
    flashTerm.textContent = w.term
    flashDef.textContent = w.definition
    flashProgress.textContent = `${flashIndex + 1} / ${words.length}`

    const pct = Math.round(((flashIndex + 1) / words.length) * 100)
    if (flashProgressBar) flashProgressBar.style.width = `${pct}%`

    setFlashFlipped(false)
  }

  function toggleFlashFlip() {
    if (words.length === 0) return
    setFlashFlipped(!flashFlipped)
  }

  function renderQuizOptions() {
    quizOptions.replaceChildren()
    quizFeedback.textContent = ""
    quizFeedback.className = "min-h-[1.5rem] rounded-lg text-center text-sm font-semibold transition-all"
    if (!quizState) {
      quizTerm.textContent = ""
      quizNext.disabled = true
      return
    }
    quizTerm.textContent = quizState.term
    quizNext.disabled = true
    quizAnswered = false
    quizRound += 1
    quizProgress.textContent = `Câu ${quizRound}`

    const optionLabels = ["A", "B", "C", "D"]

    quizState.choices.forEach((c, idx) => {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className =
        "group flex w-full items-center rounded-xl border-2 border-border/80 bg-card p-3.5 text-left text-sm font-medium text-foreground transition-all duration-200 hover:border-primary/60 hover:bg-muted/40 active:scale-[0.99] disabled:cursor-default"

      const badge = document.createElement("span")
      badge.className =
        "mr-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
      badge.textContent = optionLabels[idx] || String(idx + 1)

      const text = document.createElement("span")
      text.className = "grow leading-relaxed"
      text.textContent = c.definition

      btn.append(badge, text)

      btn.addEventListener("click", () => {
        if (quizAnswered || !quizState) return
        quizAnswered = true
        quizNext.disabled = false

        if (c.correct) {
          streak += 1
          if (quizStreak && quizStreakCount) {
            quizStreakCount.textContent = String(streak)
            quizStreak.classList.remove("hidden")
            quizStreak.classList.add("flex")
          }
          btn.classList.add("!border-emerald-500", "!bg-emerald-500/10", "!text-emerald-700", "dark:!text-emerald-300")
          badge.classList.add("!bg-emerald-500", "!text-white")
          quizFeedback.textContent = "✓ Chính xác! Rất tốt."
          quizFeedback.classList.add("text-emerald-600", "dark:text-emerald-400", "bg-emerald-500/10", "py-1.5")
        } else {
          streak = 0
          if (quizStreak) {
            quizStreak.classList.add("hidden")
            quizStreak.classList.remove("flex")
          }
          btn.classList.add("!border-red-500", "!bg-red-500/10", "!text-red-700", "dark:!text-red-300")
          badge.classList.add("!bg-red-500", "!text-white")
          quizFeedback.textContent = "✗ Chưa đúng! Xem đáp án chính xác bên trên."
          quizFeedback.classList.add("text-red-600", "dark:text-red-400", "bg-red-500/10", "py-1.5")

          // Highlight the correct answer
          quizOptions.querySelectorAll("button").forEach((b, bIdx) => {
            if (quizState?.choices[bIdx]?.correct) {
              b.classList.add("!border-emerald-500", "!bg-emerald-500/10")
            }
          })
        }

        for (const b of quizOptions.querySelectorAll("button")) {
          ;(b as HTMLButtonElement).disabled = true
        }
      })
      quizOptions.appendChild(btn)
    })
  }

  function nextQuizQuestion() {
    if (words.length < 4) {
      showQuizError("Cần ít nhất 4 từ trong danh sách để làm quiz.")
      quizState = null
      quizTerm.textContent = ""
      quizOptions.replaceChildren()
      quizNext.disabled = true
      return
    }
    quizState = pickQuizQuestion(words)
    renderQuizOptions()
  }

  async function loadWordsPage(offset: number): Promise<boolean> {
    if (loadingWords) return false
    loadingWords = true
    renderPagination()
    try {
      const nextOffset = Math.max(0, offset)
      const wRes = await fetchLearningWords({ limit: wordsLimit, offset: nextOffset })

      if (wRes.items.length === 0 && nextOffset > 0) {
        hasNextWordsPage = false
        renderPagination()
        showToast("Đã tới trang cuối cùng.")
        return false
      }

      words = wRes.items
      wordsLimit = Math.max(1, wRes.limit || wordsLimit)
      wordsOffset = wRes.offset
      hasNextWordsPage = wRes.items.length >= wordsLimit
      flashIndex = 0
      quizRound = 0

      renderFlashcard()
      nextQuizQuestion()
      return true
    } catch (e) {
      const msg = learningApiErrorMessage(e)
      showFlashError(msg)
      showQuizError(msg)
      return false
    } finally {
      loadingWords = false
      renderPagination()
    }
  }

  function renderReview() {
    reviewDone.classList.add("hidden")
    if (reviewRevealContainer) reviewRevealContainer.classList.remove("hidden")
    if (reviewAnswer) reviewAnswer.classList.add("hidden")

    if (reviewItems.length === 0 || reviewIndex >= reviewItems.length) {
      reviewTerm.textContent = ""
      reviewMeta.textContent = ""
      reviewProgress.textContent = "0 / 0"
      if (reviewRevealContainer) reviewRevealContainer.classList.add("hidden")
      reviewDone.classList.remove("hidden")
      return
    }

    const item = reviewItems[reviewIndex]
    reviewTerm.textContent = item.word.term
    reviewMeta.textContent = formatReviewMeta(item)
    reviewProgress.textContent = `${reviewIndex + 1} / ${reviewItems.length}`
    if (reviewDefinition) {
      reviewDefinition.textContent = item.word.definition
    }
  }

  // --- Sự kiện Flashcard ---
  flashCardContainer?.addEventListener("click", () => toggleFlashFlip())
  flashFlip.addEventListener("click", (e) => {
    e.stopPropagation()
    toggleFlashFlip()
  })

  flashPrev.addEventListener("click", (e) => {
    e.stopPropagation()
    if (flashIndex > 0) {
      flashIndex -= 1
      renderFlashcard()
    }
  })

  flashNext.addEventListener("click", (e) => {
    e.stopPropagation()
    if (flashIndex < words.length - 1) {
      flashIndex += 1
      renderFlashcard()
    }
  })

  flashSpeak?.addEventListener("click", (e) => {
    e.stopPropagation()
    if (words[flashIndex]) speakChinese(words[flashIndex].term)
  })

  flashSpeakBack?.addEventListener("click", (e) => {
    e.stopPropagation()
    if (words[flashIndex]) speakChinese(words[flashIndex].term)
  })

  // Keyboard navigation for Flashcard
  window.addEventListener("keydown", (e) => {
    const activeTab = root.querySelector<HTMLButtonElement>('[role="tab"][aria-selected="true"]')
    if (activeTab?.id === "tab-vocab-flash") {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault()
        toggleFlashFlip()
      } else if (e.code === "ArrowLeft" && flashIndex > 0) {
        flashIndex -= 1
        renderFlashcard()
      } else if (e.code === "ArrowRight" && flashIndex < words.length - 1) {
        flashIndex += 1
        renderFlashcard()
      }
    }
  })

  // --- Sự kiện Quiz ---
  quizNext.addEventListener("click", () => nextQuizQuestion())
  quizSpeak?.addEventListener("click", () => {
    if (quizState) speakChinese(quizState.term)
  })

  // --- Sự kiện Phân trang từ vựng ---
  pagePrev.addEventListener("click", () => {
    void loadWordsPage(wordsOffset - wordsLimit)
  })
  pageNext.addEventListener("click", () => {
    void loadWordsPage(wordsOffset + wordsLimit)
  })

  // --- Sự kiện Ôn tập (SM-2) ---
  reviewRevealBtn?.addEventListener("click", () => {
    if (reviewAnswer) reviewAnswer.classList.remove("hidden")
    if (reviewRevealContainer) reviewRevealContainer.classList.add("hidden")
  })

  reviewSpeak?.addEventListener("click", () => {
    if (reviewItems[reviewIndex]) speakChinese(reviewItems[reviewIndex].word.term)
  })

  const qualityButtons = review.querySelectorAll<HTMLButtonElement>("[data-review-q]")
  for (const btn of qualityButtons) {
    btn.addEventListener("click", async () => {
      if (reviewBusy || reviewItems.length === 0 || reviewIndex >= reviewItems.length) return
      const q = Number(btn.getAttribute("data-review-q"))
      if (Number.isNaN(q) || q < 0 || q > 5) return
      const wordId = reviewItems[reviewIndex].word.id
      reviewBusy = true
      for (const b of review.querySelectorAll<HTMLButtonElement>("[data-review-q]")) {
        b.disabled = true
      }
      try {
        await postLearningReview({ wordId, quality: q })
        reviewIndex += 1
        if (reviewIndex >= reviewItems.length) {
          const due = await fetchReviewDue({ limit: 30 })
          reviewItems = due.items
          reviewIndex = 0
        }
        renderReview()
      } catch (e) {
        showReviewError(learningApiErrorMessage(e))
      } finally {
        reviewBusy = false
        for (const b of review.querySelectorAll<HTMLButtonElement>("[data-review-q]")) {
          b.disabled = false
        }
      }
    })
  }

  // --- Tải dữ liệu ban đầu ---
  void (async () => {
    renderPagination()
    try {
      const [, rRes] = await Promise.all([
        loadWordsPage(0),
        fetchReviewDue({ limit: 30 })
      ])
      reviewItems = rRes.items
      reviewIndex = 0
      renderReview()
    } catch (e) {
      const msg = learningApiErrorMessage(e)
      showReviewError(msg)
    }
  })()
}
