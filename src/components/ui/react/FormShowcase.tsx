import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
  ControlledCheckbox,
  ControlledSwitch,
} from './index'

interface ShowcaseFormValues {
  title: string
  category: string
  notes: string
  isPublic: boolean
  enableAlerts: boolean
}

export function FormShowcase() {
  const [result, setResult] = useState<string | null>(null)
  const { control, handleSubmit, reset } = useForm<ShowcaseFormValues>({
    defaultValues: {
      title: 'Học 50 từ HSK 1',
      category: 'chinese',
      notes: 'Luyện tập mỗi ngày 15 phút với Flashcard 3D và SM-2',
      isPublic: true,
      enableAlerts: false,
    },
  })

  const onSubmit = (data: ShowcaseFormValues) => {
    setResult(JSON.stringify(data, null, 2))
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ControlledInput
          name="title"
          control={control}
          label="Tiêu đề mục tiêu"
          placeholder="Nhập tiêu đề..."
          required
          helperText="Được quản lý thông qua hook useController"
        />

        <ControlledSelect
          name="category"
          control={control}
          label="Chuyên mục"
          options={[
            { label: 'Tiếng Trung (HSK)', value: 'chinese' },
            { label: 'Lập trình Web', value: 'coding' },
            { label: 'Công việc hàng ngày', value: 'work' },
          ]}
        />

        <ControlledTextarea
          name="notes"
          control={control}
          label="Ghi chú chi tiết"
          placeholder="Nội dung ghi chú..."
          rows={3}
        />

        <ControlledCheckbox
          name="isPublic"
          control={control}
          label="Hiển thị công khai trong hồ sơ"
        />

        <ControlledSwitch
          name="enableAlerts"
          control={control}
          label="Thông báo nhắc nhở"
          description="Gửi thông báo khi đến hạn ôn tập"
        />

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
          >
            Lưu biểu mẫu (Submit)
          </button>
          <button
            type="button"
            onClick={() => {
              reset()
              setResult(null)
            }}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
          >
            Đặt lại (Reset)
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
          <span className="font-bold text-emerald-700 dark:text-emerald-300">Kết quả xác thực từ react-hook-form:</span>
          <pre className="mt-1 text-foreground overflow-x-auto">{result}</pre>
        </div>
      )}
    </div>
  )
}
