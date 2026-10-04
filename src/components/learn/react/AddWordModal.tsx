import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Button, ControlledInput, ControlledTextarea, Modal } from "@/components/ui/react"
import { createLearningWord } from "@/lib/api/learning"
import { apiErrorMessage } from "@/lib/api/errors"
import { showToast } from "@/lib/ui/toast"

export interface AddWordFormValues {
  term: string
  pinyin: string
  definition: string
  notes: string
}

export interface AddWordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddWordModal({ isOpen, onClose, onSuccess }: AddWordModalProps) {
  const [submitting, setSubmitting] = useState(false)
  const { control, handleSubmit, reset } = useForm<AddWordFormValues>({
    defaultValues: {
      term: "",
      pinyin: "",
      definition: "",
      notes: "",
    },
  })

  const onSubmit = async (values: AddWordFormValues) => {
    setSubmitting(true)
    try {
      await createLearningWord({
        term: values.term.trim(),
        pinyin: values.pinyin.trim() || undefined,
        definition: values.definition.trim(),
        notes: values.notes.trim() || undefined,
      })
      showToast("Đã thêm từ mới thành công!", { variant: "default" })
      reset()
      onSuccess()
      onClose()
    } catch (err) {
      showToast(apiErrorMessage(err, "Không thể thêm từ mới"), { variant: "destructive" })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Thêm từ vựng tiếng Trung mới">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ControlledInput
          name="term"
          control={control}
          label="Chữ Hán (Term)"
          placeholder="Ví dụ: 学习, 朋友, 谢谢"
          required
          rules={{ required: "Chữ Hán không được để trống" }}
        />

        <ControlledInput
          name="pinyin"
          control={control}
          label="Phiên âm Pinyin"
          placeholder="Ví dụ: xuéxí, péngyou, xièxie"
        />

        <ControlledInput
          name="definition"
          control={control}
          label="Ý nghĩa tiếng Việt"
          placeholder="Ví dụ: học tập, bạn bè, cảm ơn"
          required
          rules={{ required: "Ý nghĩa không được để trống" }}
        />

        <ControlledTextarea
          name="notes"
          control={control}
          label="Ghi chú / Ví dụ ngữ cảnh"
          placeholder="Ví dụ: 我在学习汉语 (Tôi đang học tiếng Trung)"
          rows={3}
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" loading={submitting}>
            {submitting ? "Đang lưu..." : "Lưu từ vựng"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
