/**
 * Một island logic: điều khiển flashcard / quiz / ôn tập, cập nhật DOM tối thiểu (không framework).
 */
import type { LearningWord, ReviewDueItem } from "@/lib/api/learning"
import { fetchLearningWords, fetchReviewDue, learningApiErrorMessage, postLearningReview } from "@/lib/api/learning"

type QuizChoice = { definition: string; correct: boolean }

type QuizState = {
  term: string
  choices: QuizChoice[]
}

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

function formatReviewMeta(item: ReviewDueItem): string {
  const r = item.review
  if (!r) return "Chưa ôn lần nào."
  const next = r.nextReviewAt ? new Date(r.nextReviewAt).toLocaleString() : "—"
  return `Lặp: ${r.repetitions} · Khoảng: ${r.intervalDays} ngày · Hẹn: ${next}`
}

export function initVocabLearn(root: HTMLElement) {
  const flash = root.querySelector("[data-learn-flashcard]")
  const quiz = root.querySelector("[data-learn-quiz]")
  const review = root.querySelector("[data-learn-review]")
  if (!flash || !quiz || !review) return

  // --- Flashcard DOM ---
  const flashTerm = flash.querySelector<HTMLElement>("[data-flash-term]")
  const flashDef = flash.querySelector<HTMLElement>("[data-flash-definition]")
  const flashFront = flash.querySelector<HTMLElement>('[data-flash-face="front"]')
  const flashBack = flash.querySelector<HTMLElement>('[data-flash-face="back"]')
  const flashFlip = flash.querySelector<HTMLButtonElement>("[data-flash-flip]")
  const flashPrev = flash.querySelector<HTMLButtonElement>("[data-flash-prev]")
  const flashNext = flash.querySelector<HTMLButtonElement>("[data-flash-next]")
  const flashProgress = flash.querySelector<HTMLElement>("[data-flash-progress]")
  const flashError = flash.querySelector<HTMLElement>("[data-flash-error]")

  // --- Quiz DOM ---
  const quizTerm = quiz.querySelector<HTMLElement>("[data-quiz-term]")
  const quizOptions = quiz.querySelector<HTMLElement>("[data-quiz-options]")
  const quizFeedback = quiz.querySelector<HTMLElement>("[data-quiz-feedback]")
  const quizNext = quiz.querySelector<HTMLButtonElement>("[data-quiz-next]")
  const quizProgress = quiz.querySelector<HTMLElement>("[data-quiz-progress]")
  const quizError = quiz.querySelector<HTMLElement>("[data-quiz-error]")

  // --- Review DOM ---
  const reviewTerm = review.querySelector<HTMLElement>("[data-review-term]")
  const reviewMeta = review.querySelector<HTMLElement>("[data-review-meta]")
  const reviewProgress = review.querySelector<HTMLElement>("[data-review-progress]")
  const reviewDone = review.querySelector<HTMLElement>("[data-review-done]")
  const reviewError = review.querySelector<HTMLElement>("[data-review-error]")

  if (
    !flashTerm ||
    !flashDef ||
    !flashFront ||
    !flashBack ||
    !flashFlip ||
    !flashPrev ||
    !flashNext ||
    !flashProgress ||
    !flashError ||
    !quizTerm ||
    !quizOptions ||
    !quizFeedback ||
    !quizNext ||
    !quizProgress ||
    !quizError ||
    !reviewTerm ||
    !reviewMeta ||
    !reviewProgress ||
    !reviewDone ||
    !reviewError
  ) {
    return
  }

  let words: LearningWord[] = []
  let flashIndex = 0
  let flashFlipped = false

  let quizState: QuizState | null = null
  let quizAnswered = false
  let quizRound = 0

  let reviewItems: ReviewDueItem[] = []
  let reviewIndex = 0
  let reviewBusy = false

  function showFlashError(msg: string) {
    flashError.textContent = msg
    flashError.classList.remove("hidden")
  }

  function hideFlashError() {
    flashError.classList.add("hidden")
    flashError.textContent = ""
  }

  function showQuizError(msg: string) {
    quizError.textContent = msg
    quizError.classList.remove("hidden")
  }

  function hideQuizError() {
    quizError.classList.add("hidden")
    quizError.textContent = ""
  }

  function showReviewError(msg: string) {
    reviewError.textContent = msg
    reviewError.classList.remove("hidden")
  }

  function hideReviewError() {
    reviewError.classList.add("hidden")
    reviewError.textContent = ""
  }

  function renderFlashcard() {
    hideFlashError()
    if (words.length === 0) {
      flashTerm.textContent = ""
      flashDef.textContent = ""
      flashProgress.textContent = "Chưa có từ."
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
    flashFlipped = false
    flashFront.classList.remove("hidden")
    flashBack.classList.add("hidden")
  }

  function toggleFlashFlip() {
    if (words.length === 0) return
    flashFlipped = !flashFlipped
    if (flashFlipped) {
      flashFront.classList.add("hidden")
      flashBack.classList.remove("hidden")
    } else {
      flashFront.classList.remove("hidden")
      flashBack.classList.add("hidden")
    }
  }

  function renderQuizOptions() {
    quizOptions.replaceChildren()
    quizFeedback.textContent = ""
    quizFeedback.className = "min-h-[1.25rem] text-sm font-medium"
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

    const baseBtn =
      "inline-flex w-full justify-start rounded-lg border-2 border-border bg-transparent px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"

    for (const c of quizState.choices) {
      const btn = document.createElement("button")
      btn.type = "button"
      btn.className = baseBtn
      btn.textContent = c.definition
      btn.addEventListener("click", () => {
        if (quizAnswered || !quizState) return
        quizAnswered = true
        quizNext.disabled = false
        if (c.correct) {
          quizFeedback.textContent = "Đúng."
          quizFeedback.classList.add("text-emerald-600", "dark:text-emerald-400")
        } else {
          quizFeedback.textContent = "Sai."
          quizFeedback.classList.add("text-red-600", "dark:text-red-400")
        }
        for (const b of quizOptions.querySelectorAll("button")) {
          ;(b as HTMLButtonElement).disabled = true
        }
      })
      quizOptions.appendChild(btn)
    }
  }

  function nextQuizQuestion() {
    hideQuizError()
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

  function renderReview() {
    hideReviewError()
    reviewDone.classList.add("hidden")
    if (reviewItems.length === 0) {
      reviewTerm.textContent = ""
      reviewMeta.textContent = ""
      reviewProgress.textContent = ""
      reviewDone.classList.remove("hidden")
      return
    }
    if (reviewIndex >= reviewItems.length) {
      reviewTerm.textContent = ""
      reviewMeta.textContent = ""
      reviewProgress.textContent = ""
      reviewDone.classList.remove("hidden")
      return
    }
    const item = reviewItems[reviewIndex]
    reviewTerm.textContent = item.word.term
    reviewMeta.textContent = formatReviewMeta(item)
    reviewProgress.textContent = `${reviewIndex + 1} / ${reviewItems.length}`
  }

  // --- Sự kiện flashcard ---
  flashFlip.addEventListener("click", () => toggleFlashFlip())
  flashPrev.addEventListener("click", () => {
    if (flashIndex > 0) {
      flashIndex -= 1
      renderFlashcard()
    }
  })
  flashNext.addEventListener("click", () => {
    if (flashIndex < words.length - 1) {
      flashIndex += 1
      renderFlashcard()
    }
  })

  // --- Sự kiện quiz ---
  quizNext.addEventListener("click", () => nextQuizQuestion())

  // --- Sự kiện ôn tập (chất lượng 0–5) ---
  const qualityButtons = review.querySelectorAll<HTMLButtonElement>("[data-review-q]")
  for (const btn of qualityButtons) {
    btn.addEventListener("click", async () => {
      if (reviewBusy || reviewItems.length === 0 || reviewIndex >= reviewItems.length) return
      const q = Number(btn.getAttribute("data-review-q"))
      if (Number.isNaN(q) || q < 0 || q > 5) return
      const wordId = reviewItems[reviewIndex].word.id
      reviewBusy = true
      hideReviewError()
      for (const b of review.querySelectorAll<HTMLButtonElement>("[data-review-q]")) {
        b.disabled = true
      }
      try {
        await postLearningReview({ wordId, quality: q })
        reviewIndex += 1
        if (reviewIndex >= reviewItems.length) {
          // Tải lại danh sách đến hạn sau khi hết hàng cục bộ
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

  // --- Tải dữ liệu ban đầu (GET có cache) ---
  void (async () => {
    try {
      const [wRes, rRes] = await Promise.all([
        fetchLearningWords({ limit: 50, offset: 0 }),
        fetchReviewDue({ limit: 30 })
      ])
      words = wRes.items
      reviewItems = rRes.items
      flashIndex = 0
      reviewIndex = 0
      renderFlashcard()
      nextQuizQuestion()
      renderReview()
    } catch (e) {
      const msg = learningApiErrorMessage(e)
      showFlashError(msg)
      showQuizError(msg)
      showReviewError(msg)
    }
  })()
}
