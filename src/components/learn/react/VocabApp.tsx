import React, { useState, useEffect, useCallback } from "react"
import { Flashcard3D } from "./Flashcard3D"
import { QuizView } from "./QuizView"
import { ReviewFlowView } from "./ReviewFlowView"
import { AddWordModal } from "./AddWordModal"
import {
  type LearningWord,
  type ReviewDueItem,
  fetchLearningWords,
  fetchReviewDue,
  postLearningReview,
  learningApiErrorMessage,
} from "@/lib/api/learning"
import { showToast } from "@/lib/ui/toast"
import { Badge, Button } from "@/components/ui/react"

export type VocabTab = "flashcard" | "quiz" | "review"

export interface VocabAppProps {
  initialTab?: VocabTab
  initialLimit?: number
}

export function VocabApp({ initialTab = "flashcard", initialLimit = 50 }: VocabAppProps) {
  const [activeTab, setActiveTab] = useState<VocabTab>(initialTab)
  const [words, setWords] = useState<LearningWord[]>([])
  const [reviewItems, setReviewItems] = useState<ReviewDueItem[]>([])
  const [limit] = useState(initialLimit)
  const [offset, setOffset] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [loadingWords, setLoadingWords] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  const loadWords = useCallback(
    async (targetOffset: number) => {
      setLoadingWords(true)
      try {
        const res = await fetchLearningWords({ limit, offset: Math.max(0, targetOffset) })
        setWords(res.items || [])
        setOffset(res.offset)
        setHasNextPage((res.items?.length || 0) >= limit)
      } catch (err) {
        showToast(learningApiErrorMessage(err), { variant: "destructive" })
      } finally {
        setLoadingWords(false)
      }
    },
    [limit],
  )

  const loadReviews = useCallback(async () => {
    setLoadingReviews(true)
    try {
      const res = await fetchReviewDue({ limit: 50 })
      setReviewItems(res.items || [])
    } catch (err) {
      showToast(learningApiErrorMessage(err), { variant: "destructive" })
    } finally {
      setLoadingReviews(false)
    }
  }, [])

  useEffect(() => {
    void loadWords(0)
    void loadReviews()
  }, [loadWords, loadReviews])

  const handleReview = async (wordId: string, quality: number) => {
    await postLearningReview({ wordId, quality })
    showToast("Đã lưu kết quả ôn tập!", { variant: "default" })
  }

  const currentPage = Math.floor(offset / limit) + 1

  return (
    <div className="space-y-6">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-sm">
        {/* Pagination buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadWords(offset - limit)}
            disabled={loadingWords || offset <= 0}
          >
            ← Trang trước
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadWords(offset + limit)}
            disabled={loadingWords || !hasNextPage}
          >
            Trang sau →
          </Button>
          <Badge variant="muted">
            {loadingWords ? "Đang tải..." : `Trang ${currentPage} · ${words.length} từ`}
          </Badge>
        </div>

        {/* Action: Add word */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1.5"
        >
          <span>＋</span>
          <span>Thêm từ mới</span>
        </Button>
      </div>

      {/* Main Learning Navigation Tabs */}
      <div className="flex border-b border-border/60 gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "flashcard"}
          onClick={() => setActiveTab("flashcard")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
            activeTab === "flashcard"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>📇</span>
          <span>Flashcard 3D</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "quiz"}
          onClick={() => setActiveTab("quiz")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
            activeTab === "quiz"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>🧩</span>
          <span>Quiz trắc nghiệm</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "review"}
          onClick={() => setActiveTab("review")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all relative ${
            activeTab === "review"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>🧠</span>
          <span>Ôn tập SM-2</span>
          {reviewItems.length > 0 && (
            <span className="ml-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold px-2 py-0.5">
              {reviewItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="pt-2">
        {activeTab === "flashcard" && (
          <div>
            {loadingWords ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <svg className="h-8 w-8 animate-spin text-primary mb-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-sm">Đang tải thẻ flashcard...</p>
              </div>
            ) : (
              <Flashcard3D words={words} />
            )}
          </div>
        )}

        {activeTab === "quiz" && (
          <div>
            {loadingWords ? (
              <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                <svg className="h-8 w-8 animate-spin text-primary mb-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <p className="text-sm">Đang chuẩn bị câu hỏi...</p>
              </div>
            ) : (
              <QuizView words={words} />
            )}
          </div>
        )}

        {activeTab === "review" && (
          <ReviewFlowView
            items={reviewItems}
            onReview={handleReview}
            onRefresh={loadReviews}
            loading={loadingReviews}
          />
        )}
      </div>

      {/* Add Word Modal */}
      <AddWordModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => void loadWords(0)}
      />
    </div>
  )
}
