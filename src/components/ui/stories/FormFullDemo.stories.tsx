import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
  ControlledCheckbox,
  ControlledSwitch,
} from '../react'

const meta: Meta = {
  title: 'Forms/CompleteFormDemo',
  parameters: {
    layout: 'centered',
  },
}

export default meta

export const FullFormDemo: StoryObj = {
  render: () => {
    const [submittedData, setSubmittedData] = useState<any>(null)
    const { control, handleSubmit } = useForm({
      defaultValues: {
        word: '学习',
        pinyin: 'xuéxí',
        hskLevel: '1',
        meaning: 'Học tập, nghiên cứu',
        isFavorite: true,
        notifyReview: false,
      },
    })

    const onSubmit = (data: any) => {
      setSubmittedData(data)
    }

    return (
      <div className="w-[420px] rounded-2xl border border-border bg-card p-6 shadow-lg">
        <h3 className="mb-1 text-lg font-bold text-foreground">Thêm từ vựng tiếng Trung</h3>
        <p className="mb-4 text-xs text-muted-foreground">
          Biểu mẫu tích hợp 100% qua hook useController của react-hook-form
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ControlledInput
            name="word"
            control={control}
            label="Hán tự (Hanzi)"
            placeholder="Ví dụ: 你好"
            required
          />

          <ControlledInput
            name="pinyin"
            control={control}
            label="Phiên âm (Pinyin)"
            placeholder="Ví dụ: nǐ hǎo"
            required
          />

          <ControlledSelect
            name="hskLevel"
            control={control}
            label="Cấp độ HSK"
            options={[
              { label: 'HSK 1 (Sơ cấp)', value: '1' },
              { label: 'HSK 2', value: '2' },
              { label: 'HSK 3', value: '3' },
              { label: 'HSK 4 (Trung cấp)', value: '4' },
              { label: 'HSK 5', value: '5' },
              { label: 'HSK 6 (Cao cấp)', value: '6' },
            ]}
          />

          <ControlledTextarea
            name="meaning"
            control={control}
            label="Ý nghĩa & Ví dụ"
            placeholder="Nghĩa tiếng Việt..."
            rows={2}
          />

          <ControlledCheckbox
            name="isFavorite"
            control={control}
            label="Đánh dấu từ yêu thích"
          />

          <ControlledSwitch
            name="notifyReview"
            control={control}
            label="Bật nhắc nhở ôn tập SM-2"
            description="Tự động thêm vào hàng đợi ôn hôm nay"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90"
          >
            Lưu dữ liệu
          </button>
        </form>

        {submittedData && (
          <div className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300">Dữ liệu đã submit:</p>
            <pre className="mt-1 text-foreground overflow-x-auto">{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </div>
    )
  },
}
