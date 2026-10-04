import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ControlledInput } from '../react/ControlledInput'

const meta: Meta<typeof ControlledInput> = {
  title: 'Forms/ControlledInput',
  component: ControlledInput,
  parameters: {
    layout: 'centered',
  },
}

export default meta

type Story = StoryObj<typeof ControlledInput>

function InputWrapper(props: any) {
  const { control } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  })

  return (
    <div className="w-[320px] p-4 bg-card rounded-xl border border-border">
      <ControlledInput control={control} {...props} />
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <InputWrapper
      name="username"
      label="Tên người dùng"
      placeholder="Nhập tên người dùng..."
      helperText="Tên hiển thị công khai trên tài khoản của bạn"
    />
  ),
}

export const WithValidation: Story = {
  render: () => (
    <InputWrapper
      name="email"
      label="Địa chỉ Email"
      type="email"
      placeholder="email@example.com"
      required
      rules={{
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Email không hợp lệ',
        },
      }}
    />
  ),
}

export const Password: Story = {
  render: () => (
    <InputWrapper
      name="password"
      label="Mật khẩu"
      type="password"
      placeholder="••••••••"
      required
      rules={{
        minLength: {
          value: 6,
          message: 'Mật khẩu tối thiểu 6 ký tự',
        },
      }}
    />
  ),
}

export const Disabled: Story = {
  render: () => (
    <InputWrapper
      name="username"
      label="Không thể chỉnh sửa"
      placeholder="Giá trị bị vô hiệu"
      disabled
    />
  ),
}
