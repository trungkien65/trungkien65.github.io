import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ControlledInput } from '@/components/ui/react'
import { authRegister, authLogin, persistAuthTokenPair } from '@/lib/api/auth'
import { getSafeNextPath } from '@/lib/auth/safeNext'
import { apiErrorMessage } from '@/lib/api/errors'
import { showToast } from '@/lib/ui/toast'

interface RegisterFormInputs {
  email: string
  password: string
  confirmPassword: string
}

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, watch } = useForm<RegisterFormInputs>({
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true)
    try {
      await authRegister({
        email: data.email.trim(),
        password: data.password,
      })
      showToast('Đăng ký thành công! Đang tự động đăng nhập...', { variant: 'default' })
      const tokens = await authLogin({
        email: data.email.trim(),
        password: data.password,
      })
      persistAuthTokenPair(tokens)
      window.location.href = getSafeNextPath(window.location.search)
    } catch (err) {
      showToast(apiErrorMessage(err, 'Đăng ký thất bại'), { variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <ControlledInput
        name="email"
        control={control}
        label="Email"
        type="email"
        placeholder="ten@example.com"
        required
        autoComplete="email"
        rules={{
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Địa chỉ email không hợp lệ',
          },
        }}
      />

      <ControlledInput
        name="password"
        control={control}
        label="Mật khẩu"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
        helperText="Tối thiểu 6 ký tự"
        rules={{
          minLength: {
            value: 6,
            message: 'Mật khẩu phải từ 6 ký tự trở lên',
          },
        }}
      />

      <ControlledInput
        name="confirmPassword"
        control={control}
        label="Xác nhận mật khẩu"
        type="password"
        placeholder="••••••••"
        required
        autoComplete="new-password"
        rules={{
          validate: (value) => value === password || 'Mật khẩu xác nhận không khớp',
        }}
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Đang tạo tài khoản...
          </span>
        ) : (
          'Tạo tài khoản'
        )}
      </button>
    </form>
  )
}
