import React, { useState } from "react"
import type { ReviewDueItem } from "@/lib/api/learning"
import { AudioButton, Badge, Button } from "@/components/ui/react"

export interface ReviewFlowViewProps {
  items: ReviewDueItem[]
  onReview: (wordId: string, quality: number) => Promise<void>
  onRefresh?: () => Promise<void>
  loading?: boolean
}

const QUALITY_LEVELS = [
  { q: 0, label: "0 - Quên hẳn", color: "bg-red-950 text-red-200 border-red-800 hover:bg-red-900" },
  { q: 1, label: "1 - Nhớ sai", color: "bg-red-800 text-red-100 border-red-700 hover:bg-red-700" },
  { q: 2, label: "2 - Khó khăn", color: "bg-orange-700 text-orange-100 border-orange-600 hover:bg-orange-600" },
  { q: 3, label: "3 - Nhớ tạm", color: "bg-amber-600 text-amber-50 border-amber-500 hover:bg-amber-500" },
  { q: 4, label: "4 - Nhớ tốt", color: "bg-emerald-600 text-emerald-50 border-emerald-500 hover:bg-emerald-500" },
  { q: 5, label: "5 - Hoàn hảo", color: "bg-teal-600 text-teal-50 border-teal-500 hover:bg-teal-500" },
]

export function ReviewFlowView({
  items,
  onReview,
  onRefresh,
  loading = false,
}: ReviewFlowViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center">
        <svg className="h-8 w-8 animate-spin text-primary mb-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm font-medium text-muted-foreground">Đang tải lịch ôn tập SM-2...</p>
      </div>
    )
  }

  if (!items || items.length === 0 || currentIndex >= items.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-12 text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Tuyệt vời! Bạn đã hoàn thành các từ cần ôn</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Không còn từ vựng nào đến hạn ôn tập lúc này theo thuật toán SM-2.
          </p>
        </div>
        {onRefresh && (
          <Button
            variant="primary"
            onClick={async () => {
              setCurrentIndex(0)
              setRevealed(false)
              await onRefresh()
            }}
          >
            Kiểm tra lại danh sách ôn
          </Button>
        )}
      </div>
    )
  }

  const currentItem = items[currentIndex]
  const currentWord = currentItem.word
  const reviewMeta = currentItem.review
    ? `Lần ôn: ${currentItem.review.repetitions} · Khoảng cách: ${currentItem.review.intervalDays} ngày`
    : "Từ mới (chưa ôn lần nào)"

  const handleRate = async (quality: number) => {
    if (submitting) return
    setSubmitting(true)
    try {
      await onReview(currentWord.id, quality)
      setRevealed(false)
      setCurrentIndex((prev) => prev + 1)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto space-y-6">
      {/* Progress & Meta info */}
      <div className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground px-1">
        <Badge variant="primary">
          {currentIndex + 1} / {items.length} từ cần ôn
        </Badge>
        <span className="italic">{reviewMeta}</span>
      </div>

      {/* Main Review Card */}
      <div className="w-full rounded-2xl border-2 border-border/80 bg-card p-8 flex flex-col items-center shadow-sm relative min-h-[280px] justify-between">
        <AudioButton
          text={currentWord.term}
          className="absolute top-4 right-4"
        />

        <div className="text-center my-auto py-4">
          <h2 className="text-6xl sm:text-7xl font-bold tracking-tight text-foreground font-serif">
            {currentWord.term}
          </h2>
          {revealed && currentWord.pinyin && (
            <p className="mt-2 text-lg font-medium text-primary animate-fadeIn">
              {currentWord.pinyin}
            </p>
          )}
        </div>

        {/* Revealed Content */}
        {revealed ? (
          <div className="w-full text-center border-t border-border/60 pt-4 mt-2 animate-fadeIn space-y-1">
            <p className="text-xl sm:text-2xl font-semibold text-foreground">
              {currentWord.definition}
            </p>
            {currentWord.notes && (
              <p className="text-xs text-muted-foreground italic">
                {currentWord.notes}
              </p>
            )}
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => setRevealed(true)}
            className="w-full text-primary hover:bg-primary/10 border-primary/20"
          >
            Hiện đáp án & đánh giá
          </Button>
        )}
      </div>

      {/* SM-2 Quality Rating Buttons */}
      {revealed && (
        <div className="w-full space-y-2 animate-fadeIn">
          <p className="text-xs font-semibold text-center text-muted-foreground uppercase tracking-wider">
            Bạn nhớ từ này ở mức độ nào?
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {QUALITY_LEVELS.map((btn) => (
              <button
                key={btn.q}
                type="button"
                disabled={submitting}
                onClick={() => handleRate(btn.q)}
                className={`flex items-center justify-center rounded-xl border p-3 text-xs font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${btn.color}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
